$identityStackName = "onyx-identity"
$identityTemplate = ".\identity\src\Identity.Functions\identity-template.yaml"
$identityPackagedTemplate = ".\identity\src\Identity.Functions\packaged-identity.yaml"
$budgetStackName = "onyx-budget"
$budgetTemplate = ".\budget\src\Budget.Functions\budget-template.yaml"
$budgetPackagedTemplate = ".\budget\src\Budget.Functions\packaged-budget.yaml"
$messangerStackName = "onyx-messanger"
$messangerTemplate = ".\messanger\src\Messanger.Lambda\messanger-template.yaml"
$messangerPackagedTemplate = ".\messanger\src\Messanger.Lambda\packaged-messanger.yaml"
$baseStackName = "onyx-base"
$baseTemplate = ".\base-template.yaml"
$configStackName = "onyx-config"
$configTemplate = ".\config-template.yaml"
$region = "eu-central-1"
$s3bucket = "onyx-default"

# Function to get IAM role ARN if it exists
function Get-IAMRoleArn {
    param (
        [string]$roleName
    )
    try {
        $role = aws iam get-role --role-name $roleName --query "Role.Arn" --output text
        return $role.Arn
    } catch {
        return $null
    }
}

# Check if the FullAccess role exists or create it using CloudFormation
$roleName = "FullAccess"
$fullAccessRoleArn = Get-IAMRoleArn -roleName $roleName

if (-not $fullAccessRoleArn) {
    Write-Host "Role '$roleName' does not exist. Creating new role using CloudFormation..."

    Write-Host "Deploying Base service..."
    aws cloudformation deploy `
        --template-file $baseTemplate `
        --stack-name $baseStackName `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $region

    $fullAccessRoleArn = (aws cloudformation describe-stacks `
        --stack-name $baseStackName `
        --query "Stacks[0].Outputs[?OutputKey=='FullAccessRoleArn'].OutputValue" `
        --output text `
        --region $region)

    if (-not $fullAccessRoleArn) {
        Write-Host "Error: Could not retrieve the ARN of the newly created role. Exiting."
        exit 1
    }
    
    $deadLetterQueueArn = (aws cloudformation describe-stacks `
        --stack-name $baseStackName `
        --query "Stacks[0].Outputs[?OutputKey=='DeadLetterQueueArn'].OutputValue" `
        --output text `
        --region $region)
}

Write-Host "Packaging Messanger service..."
sam build --template $messangerTemplate
sam package --s3-bucket $s3bucket --output-template-file $messangerPackagedTemplate

Write-Host "Deploying Messanger service..."
sam deploy --template-file $messangerPackagedTemplate `
    --stack-name $messangerStackName `
    --capabilities CAPABILITY_IAM `
    --parameter-overrides "FullAccessRoleArn=$fullAccessRoleArn" `
    --region $region

# Identity service
Write-Host "Packaging Identity service..."
sam build --template $identityTemplate
sam package --s3-bucket $s3bucket --output-template-file $identityPackagedTemplate

Write-Host "Deploying Identity service..."
sam deploy --template-file $identityPackagedTemplate `
    --stack-name $identityStackName `
    --capabilities CAPABILITY_IAM `
    --parameter-overrides "DeadLetterQueueArn=$deadLetterQueueArn FullAccessRoleArn=$fullAccessRoleArn" `
    --region $region

$lambdaAuthorizerArn = (aws cloudformation describe-stacks --stack-name $identityStackName --query "Stacks[0].Outputs[?OutputKey=='LambdaAuthorizerArn'].OutputValue" --output text --region $region)

if (-not $lambdaAuthorizerArn) {
    Write-Host "Error: LambdaAuthorizerArn could not be retrieved. Exiting."
    exit 1
}

# Budget Service
Write-Host "Packaging Budget service..."
sam build --template $budgetTemplate
sam package --s3-bucket $s3bucket --output-template-file $budgetPackagedTemplate

Write-Host "Deploying Budget service..."
sam deploy --template-file $budgetPackagedTemplate `
    --stack-name $budgetStackName `
    --capabilities CAPABILITY_IAM `
    --parameter-overrides "LambdaAuthorizerArn=$lambdaAuthorizerArn FullAccessRoleArn=$fullAccessRoleArn" `
    --region $region

Write-Host "Deployment complete."

$addBudgetForUserQueueName = (aws cloudformation describe-stacks --stack-name $identityStackName --query "Stacks[0].Outputs[?OutputKey=='AddBudgetForUserQueueName'].OutputValue" --output text --region $region)
$removeUserFromBudgetQueueName = (aws cloudformation describe-stacks --stack-name $identityStackName --query "Stacks[0].Outputs[?OutputKey=='RemoveUserFromBudgetQueueName'].OutputValue" --output text --region $region)
$sendEmailTopicName = (aws cloudformation describe-stacks --stack-name $messangerStackName --query "Stacks[0].Outputs[?OutputKey=='SendEmailTopicName'].OutputValue" --output text --region $region)

Write-Host "Deploying Configuration service..."

sam deploy --template-file $configTemplate `
    --stack-name $configStackName `
    --capabilities CAPABILITY_IAM `
    --parameter-overrides `
        "AddBudgetForUserQueueName=$addBudgetForUserQueueName" `
        "RemoveUserFromBudgetQueueName=$removeUserFromBudgetQueueName" `
        "SendEmailTopicName=$sendEmailTopicName" `
    --region $region

Write-Host "Configuration deployment complete."
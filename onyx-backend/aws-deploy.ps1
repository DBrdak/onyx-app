$env = $args[0].ToLower()

$identityStackName = "onyx-identity-$env"
$identityTemplate = ".\identity\src\Identity.Functions\identity-template.yaml"
$identityPackagedTemplate = ".\identity\src\Identity.Functions\packaged-identity.yaml"

$budgetStackName = "onyx-budget-$env"
$budgetTemplate = ".\budget\src\Budget.Functions\budget-template.yaml"
$budgetPackagedTemplate = ".\budget\src\Budget.Functions\packaged-budget.yaml"

$messangerStackName = "onyx-messanger"
$messangerTemplate = ".\messanger\src\Messanger.Lambda\messanger-template.yaml"
$messangerPackagedTemplate = ".\messanger\src\Messanger.Lambda\packaged-messanger.yaml"

$baseStackName = "onyx-base"
$baseTemplate = ".\base-template.yaml"

$queuesStackName = "onyx-queues"
$queuesTemplate = ".\queues-template.yaml"

$configStackName = "onyx-config"
$configTemplate = ".\config-template.yaml"

$awsProfile = "dbrdak-lambda"
$region = "eu-central-1"

Write-Host "Deploying Base service..."
aws cloudformation deploy `
    --template-file $baseTemplate `
    --stack-name $baseStackName `
    --capabilities CAPABILITY_NAMED_IAM `
    --region $region `
    --profile $awsProfile

$fullAccessRoleArn = (aws cloudformation describe-stacks `
    --stack-name $baseStackName `
    --query "Stacks[0].Outputs[?OutputKey=='FullAccessRoleArn'].OutputValue" `
    --output text `
    --region $region `
    --profile $awsProfile)

$s3bucket = (aws cloudformation describe-stacks `
    --stack-name $baseStackName `
    --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" `
    --output text `
    --region $region `
    --profile $awsProfile)

if (-not $fullAccessRoleArn -or $fullAccessRoleArn -eq "None") {
    Write-Host "Error: Could not retrieve the ARN of the role. Exiting."
    exit 1
}
if (-not $s3bucket -or $s3bucket -eq "None") {
    $s3bucket = "onyx-default"
}

Write-Host "Deploying Queues service..."
aws cloudformation deploy `
    --template-file $queuesTemplate `
    --stack-name $queuesStackName `
    --capabilities CAPABILITY_NAMED_IAM `
    --region $region `
    --profile $awsProfile

$deadLetterQueueArn = (aws cloudformation describe-stacks `
    --stack-name $queuesStackName `
    --query "Stacks[0].Outputs[?OutputKey=='DeadLetterQueueArn'].OutputValue" `
    --output text `
    --region $region `
    --profile $awsProfile)

$addBudgetForUserQueueName = (aws cloudformation describe-stacks `
    --stack-name $queuesStackName `
    --query "Stacks[0].Outputs[?OutputKey=='AddBudgetForUserQueueName'].OutputValue" `
    --output text `
    --region $region  `
    --profile $awsProfile)

$removeUserFromBudgetQueueName = (aws cloudformation describe-stacks `
    --stack-name $queuesStackName `
    --query "Stacks[0].Outputs[?OutputKey=='RemoveUserFromBudgetQueueName'].OutputValue" `
    --output text `
    --region $region  `
    --profile $awsProfile)

$removeUserQueueName = (aws cloudformation describe-stacks `
    --stack-name $queuesStackName `
    --query "Stacks[0].Outputs[?OutputKey=='RemoveUserQueueName'].OutputValue" `
    --output text `
    --region $region  `
    --profile $awsProfile)
$addBudgetForUserQueueArn = (aws cloudformation describe-stacks `
    --stack-name $queuesStackName `
    --query "Stacks[0].Outputs[?OutputKey=='AddBudgetForUserQueueArn'].OutputValue" `
    --output text `
    --region $region  `
    --profile $awsProfile)

$removeUserFromBudgetQueueArn = (aws cloudformation describe-stacks `
    --stack-name $queuesStackName `
    --query "Stacks[0].Outputs[?OutputKey=='RemoveUserFromBudgetQueueArn'].OutputValue" `
    --output text `
    --region $region  `
    --profile $awsProfile)

$removeUserQueueArn = (aws cloudformation describe-stacks `
    --stack-name $queuesStackName `
    --query "Stacks[0].Outputs[?OutputKey=='RemoveUserQueueArn'].OutputValue" `
    --output text `
    --region $region  `
    --profile $awsProfile)

if (-not $deadLetterQueueArn -or $deadLetterQueueArn -eq "None") {
    Write-Host "Error: Could not retrieve the ARN of the dead letter queue. Exiting."
    exit 1
}
if (-not $addBudgetForUserQueueName -or $addBudgetForUserQueueName -eq "None") {
    Write-Host "Error: AddBudgetForUserQueueName could not be retrieved. Exiting."
    exit 1
}
if (-not $removeUserFromBudgetQueueName -or $removeUserFromBudgetQueueName -eq "None") {
    Write-Host "Error: RemoveUserFromBudgetQueueName could not be retrieved. Exiting."
    exit 1
}
if (-not $removeUserQueueName -or $removeUserQueueName -eq "None") {
    Write-Host "Error: RemoveUserQueueName could not be retrieved. Exiting."
    exit 1
}
if (-not $addBudgetForUserQueueArn -or $addBudgetForUserQueueArn -eq "None") {
    Write-Host "Error: AddBudgetForUserQueueArn could not be retrieved. Exiting."
    exit 1
}
if (-not $removeUserFromBudgetQueueArn -or $removeUserFromBudgetQueueArn -eq "None") {
    Write-Host "Error: RemoveUserFromBudgetQueueArn could not be retrieved. Exiting."
    exit 1
}
if (-not $removeUserQueueArn -or $removeUserQueueArn -eq "None") {
    Write-Host "Error: RemoveUserQueueArn could not be retrieved. Exiting."
    exit 1
}

Write-Host "Packaging Messanger service..."
sam build --template $messangerTemplate
sam package --s3-bucket $s3bucket --output-template-file $messangerPackagedTemplate

Write-Host "Deploying Messanger service..."
sam deploy --template-file $messangerPackagedTemplate `
    --stack-name $messangerStackName `
    --capabilities CAPABILITY_IAM `
    --parameter-overrides "FullAccessRoleArn=$fullAccessRoleArn" `
    --region $region `
    --profile $awsProfile

# Identity service
Write-Host "Packaging Identity service..."
sam build --template $identityTemplate
sam package --s3-bucket $s3bucket --output-template-file $identityPackagedTemplate

Write-Host "Deploying Identity service..."
sam deploy --template-file $identityPackagedTemplate `
    --stack-name $identityStackName `
    --capabilities CAPABILITY_IAM `
    --parameter-overrides "FullAccessRoleArn=$fullAccessRoleArn RemoveUserFromBudgetQueueArn=$removeUserFromBudgetQueueArn AddBudgetForUserQueueArn=$addBudgetForUserQueueArn Environment=$env" `
    --region $region `
    --profile $awsProfile

$lambdaAuthorizerArn = (aws cloudformation describe-stacks `
--stack-name $identityStackName `
--query "Stacks[0].Outputs[?OutputKey=='LambdaAuthorizerArn'].OutputValue" `
--output text `
--region $region `
--profile $awsProfile)

if (-not $lambdaAuthorizerArn -or $lambdaAuthorizerArn -eq "None") {
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
    --parameter-overrides "LambdaAuthorizerArn=$lambdaAuthorizerArn RemoveUserQueueArn=$removeUserQueueArn FullAccessRoleArn=$fullAccessRoleArn Environment=$env" `
    --region $region `
    --profile $awsProfile

Write-Host "Deployment complete."

$sendEmailTopicName = (aws cloudformation describe-stacks `
--stack-name $messangerStackName `
--query "Stacks[0].Outputs[?OutputKey=='SendEmailTopicName'].OutputValue" `
--output text `
--region $region  `
--profile $awsProfile)

if (-not $sendEmailTopicName) {
    Write-Host "Error: SendEmailTopicName could not be retrieved. Exiting."
    exit 1
}

Write-Host "Deploying Configuration service..."

sam deploy --template-file $configTemplate `
    --stack-name $configStackName `
    --capabilities CAPABILITY_IAM `
    --parameter-overrides `
        "AddBudgetForUserQueueName=$addBudgetForUserQueueName" `
        "RemoveUserFromBudgetQueueName=$removeUserFromBudgetQueueName" `
        "RemoveUserQueueName=$removeUserQueueName" `
        "SendEmailTopicName=$sendEmailTopicName" `
    --region $region `
    --profile $awsProfile

Write-Host "Configuration deployment complete."

$identityUrl =(aws cloudformation describe-stacks `
--stack-name $identityStackName `
--query "Stacks[0].Outputs[?OutputKey=='ApiURL'].OutputValue" `
--output text `
--region $region `
--profile $awsProfile)

$budgetUrl = (aws cloudformation describe-stacks `
--stack-name $budgetStackName `
--query "Stacks[0].Outputs[?OutputKey=='ApiURL'].OutputValue" `
--output text `
--region $region `
--profile $awsProfile)

Write-Host "Successfully deployed to $env" -ForegroundColor Blue
Write-Host "Identity $env URL: $identityUrl" -ForegroundColor Green
Write-Host "Budget $env URL: $budgetUrl" -ForegroundColor Green
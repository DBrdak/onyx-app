$identityStackName = "onyx-identity"
$budgetStackName = "onyx-budget"
$messangerStackName = "onyx-messanger"
$baseStackName = "onyx"
$region = "eu-central-1"

Write-Host "Deleting Identity service stack..."
aws cloudformation delete-stack --stack-name $identityStackName --region $region

Write-Host "Waiting for Identity service stack to be deleted..."
aws cloudformation wait stack-delete-complete --stack-name $identityStackName --region $region
Write-Host "Identity service stack deleted."

Write-Host "Deleting Budget service stack..."
aws cloudformation delete-stack --stack-name $budgetStackName --region $region

Write-Host "Waiting for Budget service stack to be deleted..."
aws cloudformation wait stack-delete-complete --stack-name $budgetStackName --region $region
Write-Host "Budget service stack deleted."

Write-Host "Deleting Messanger service stack..."
aws cloudformation delete-stack --stack-name $messangerStackName --region $region

Write-Host "Waiting for Messanger service stack to be deleted..."
aws cloudformation wait stack-delete-complete --stack-name $messangerStackName --region $region
Write-Host "Messanger service stack deleted."

Write-Host "Deleting Messanger service stack..."
aws cloudformation delete-stack --stack-name $baseStackName --region $region

Write-Host "Waiting for base service stack to be deleted..."
aws cloudformation wait stack-delete-complete --stack-name $baseStackName --region $region
Write-Host "Base service stack deleted."
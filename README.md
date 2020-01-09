# AWS Cognito Demo

On the branch **Master** you have the default code. The other branchs have the implementation. See below.

## Option 1

Branch:amplify-basic-cli

Summary: Used the Amplify framework to do all the stuff, from code to AWS configuration.

## Option 2

Branch: SimpleTestEmailOnly

Summary: Used the master branch with code customization to add the cognito web log in page. Only email accepted

## Option 3

Branch: SimpleTestEmailFacebook

Summary: Used the SimpleTestEmailOnly as base to add google and facebook authentication. You can compare both branch and see that there aren`t any code changes. It is just a matter of doing some configuration on Cognito, Facebook and Google.

## Option 4

Branch: CallAwsResources

Summary: Used the SimpleTestEmailFacebook as base to add more instructions and code changes on how to call APIs from the API Gateway in a secure way and how to call a S3 API exchanging the cognito token to a AWS STS token

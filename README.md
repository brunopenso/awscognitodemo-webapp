# AWS Cognito Demo

**Disclaimer:** This code was not create to use on production environment, it is just for learning AWS Cognito.

Below are the steps that I executed to achieve all the functionalities. To see the code with everything you can see the branch **CallAwsResources**

## AWS Amplify

This is a option that is very cool to learn in a future, because AWS amplify framework have a lot of features to comunicate with AWS Resources. Since this was not the objective of this repo I stopped with a very simple configuration.

Branch:amplify-basic-cli

Summary: Used the Amplify framework to do all the stuff, from code to AWS configuration.

## AWS Cognito

## Step 1

Branch: Step1_OnlyEmail

Summary: Used the master branch with code customization to add the cognito web log in page. Only email accepted

## Step 2

Branch: Step2_AddSocialProviders

Summary: Used the SimpleTestEmailOnly as base to add google and facebook authentication. You can compare both branch and see that there aren`t any code changes. It is just a matter of doing some configuration on Cognito, Facebook and Google.

## Step 3

Branch: Step3_CallAwsResources

Summary: Used the SimpleTestEmailFacebook as base to add more instructions and code changes on how to call APIs from the API Gateway in a secure way and how to call a S3 API exchanging the cognito token to a AWS STS token

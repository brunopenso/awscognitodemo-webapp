# Meetup Cognito Demo - Web App

This branch 'Step4_Passwordless' use the external screen provided by AWS Cognito for the login function, where the user and password are stored in Amazon Cognito, with other Identity Providers like Facebook and Google and an option to use the **Passwordless flow**

**Disclaimer:** This code was not create to use on production environment, it is just for learning AWS Cognito.

**Disclaimer 2:** Each branch of this project were created to show the evolution of the code and configuration between each steps. For the passwordless flow the things are a little bit different because we need to use the cloud formation from AWS to create the resources. So the resources created on the other branches should be delete.

## Setup cognito

**Configure for password less flow**

I followed this article is very straight forward.
https://aws.amazon.com/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/

Import the code using the cloudform stack option and get it working.

After steps:

- Go to the Amazon SES and verify the FROM e TO email of your tests
- After you deploy the cloud formation will create a new user pool, so go back to your user pool and setup the lambda triggers to make it work all integrated

Now that you have a user pool configured continue with the steps bellow.

**Setup cognito with other configurations**

*Only the questions that I changed the default option is described bellow.*
- How will a user be able to recover their account?
  - Email only
- Which attributes do you want to verify?
  - Email
- DO NOT create SMS role
- Do you want to remember your user's devices?
  - Always

After saving the user pool, come back to the APP Integration menu.

- Enable all Identity Providers
- Callback URL(s): http://localhost:3000/callback
- Sign out URL(s): http://localhost:3000/signout
- Allowed OAuth Flows: Authorization code grant
- Allowed OAuth Scopes: email, openid, profile
- Create a domain name (in the real world scenario the domain will be something like auth.yourproduct.com)
- Go to UI customization and upload the logo.png file in this project

On the Federation, let`s setup the facebook/google authenticator

### Facebook
- Access https://developers.facebook.com/
  - Create a application
  - Go to Configuration > Application Domain and add the auth url of cognito <userpool_domainname>.auth.us-east-1.amazoncognito.com
  - Go to Product > FacebookLogin > Configuration > Redirect URL > https://<userpool_domainname>.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
- Go to Cognito, Identity Provider and click on facebook
  - Inform the clientId, clientSecret and in Authorize scope inform "public_profile,email"
  - Go to attribute mapping:
    - Check email and map to Email
    - Check first_name and map to Name
  - Go back to App client settings and check Facebook as identity provider
  - Save changes

### Google

- Go to https://console.developers.google.com/
  - Create a new project
    - Name: AwsMeetupDemo
  - Menu > APIs & Services > **OAuth consent screen**
    - Select the Project
    - Mask as external
    - Fill Name 
    - Authorize Domain with <userpool_domainname>.auth.us-east-1.amazoncognito.com
    - Save
  - Menu > APIs & Services > Credentials > + Create Credentials > OAuth client ID
    - Web application
    - Fill the Name
    - Save
  - Back to cognito, create the google identity provider, fill clientId and secret and scope(profile email openid).
  - Hit Enable google
  - Go to attribute mapping and do the same as the Facebook
  - Go to App Client Settings and enable google as a identity provider
  - Go back to google
    - Edit the application on the OAuth 2.0 Client Id
    - Add Authorized redirect URIs with the value https://<userpool_domainname>.auth.us-east-1.amazoncognito.com/oauth2/idpresponse

### Create a lambda code

Go to the AWS Console and Create a lambda with name **myRandomNumber** with all default configuration

Add this code
```javascript
exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: (Math.floor(Math.random() * 100000) + 1)
    };
    return response;
};
```

### Create API

Go to API Gateway and Build a REST API

- Protocol: REST
- Create new API: New API
- Settings
  - API name: My Random Number API
- Create Method: GET
- Lambda Function: myRandomNumber
- Test the call
- Go to the API > Authorizer > Create New Authorizer
  - Name: MyCustom
  - Type: Cognito
  - Cognito User Pool: Name of the user pool created
  - Token Source: Authorization
- Go back to the resources and click on GET, than Method Request
- In the Authorization change to *MyCustom*
  - Hint: If MyCustom is missing, refresh the page
  - DO NOT forget to click on the check button on the right side to save
- Click on Actions, than deploy

**Attention:** Is it necessary to create the method OPTIONS and set the CORS properties on both API of GET/OPTIONS

```javascript
Access-Control-Allow-Headers: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Origin: *
```

## Create S3 access

To use the S3 API directly you will need to create a bucked.

Create a new bucket with *block all public access* options and upload any file to it.

**Changes to Cognito**

- Create a new Identity Pool
  - Name: <samenameofuserpoll>IdentityPool
  - Authentication providers
    - Inform the UserPoolId
    - Inform the ApplicationId
  - Create pool
  - Create a new Role with S3Access on the name. e.g: Cognito_SimpleTestEmailOnlyIdentityPoolAuth_Role
    - The AWS console will ask to create two roles
- Go the IAM console
  - Search the role that have PoolAuth on the name
  - Attach a policy to AmazonS3ReadOnlyAccess
- Go back to S3
  - Select the bucket
  - Go to Permissions > CORS Configuration
  - Add this code

```xml
<CORSConfiguration>
 <CORSRule>
   <AllowedOrigin>*</AllowedOrigin>
   <AllowedMethod>GET</AllowedMethod>
   <AllowedHeader>*</AllowedHeader>
 </CORSRule>
</CORSConfiguration>
```

## Running this code

```javascript
npm install
```

Create a file .env.development with this values:

```javascript
SKIP_PREFLIGHT_CHECK=true
REACT_APP_AWS_COGNITO_CLIENT_ID=<id of the application associated to the user pool>
REACT_APP_AWS_COGNITO_URL=<domain url of the application>
REACT_APP_AWS_USERPOOL_ID=<name complete with the region + id>
REACT_APP_AWS_IDENTITYPOOL_ID=<name complete with the region + id, you get this on the sample code menu>
REACT_APP_AWS_API_GATEWAY=<full url to execute the GET command on api gateway>
REACT_APP_AWS_S3_BUCKET_NAME=<name of the bucket on AWS>
REACT_APP_AWS_PLA_URL=cognito-idp.<region>.amazonaws.com
```

Start

```javascript
npm start
```

After login you can check the button:

- *Click to call an API* will call an API from the API Gateway using the idToken
- *Click to call S3* wil call an API from the S3 to count the number of files that exists on the bucket

# Meetup Cognito Demo - Web App

This branch 'SimpleTestEmailFacebook' use the external screen provided by AWS Cognito for the login function, where the user and password are stored in Amazon Cognito, with other Identity Providers like Facebook and Google.

## Setup cognito

Access the AWS console and create a new user pool, follow the steps bellow to setup the cognito to work with this scenario.

*Only the questions that I changed the default option is described bellow.*

- How do you want your end users to sign in?
  - Email address or phone number
  - Allow email addresses
- Which standard attributes are required?
  - email
  - name
- How will a user be able to recover their account?
  - Email only
- Which attributes do you want to verify?
  - Email
- DO NOT create SMS role
- Do you want to remember your user's devices?
  - Always
- Create an Application
  - Set a name
  - **Uncheck generate CLient Secret**

After saving the user pool, come back to the APP Integration menu.

- Enable all Identity Providers
- Callback URL(s): http://localhost:3000/callback
- Sign out URL(s): http://localhost:3000/signout
- Allowed OAuth Flows: Authorization code grant
- Allowed OAuth Scopes: email, openid, profile
- Create a domain name (in the real world scenario the domain will be something like auth.yourproduct.com)

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
  - Menu > APIs & Services > consent screen
    - Fill Name 
    - Authorize Domain with <userpool_domainname>.auth.us-east-1.amazoncognito.com
    - Save
  - Menu > APIs & Services > Credentials > + Create Credentials OAuth client ID
    - Web application
    - Fill the Name
    - Save
  - Select the application name and add Authorized redirect URIs with the value https://<userpool_domainname>.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
  - Back to cognito, create the google identity provider, fill clientId and secret and scope(profile email openid).
  - Hit Enable google
  - Go to attribute mapping and do the same as the Facebook
  - Go to App Client Settings and enable google as a identity provider

### Create a lambda code

Go to the AWS Console and Create a lambda with name myRandomNumber with all default configuration

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

Go to API Gateway and create a REST API

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
  - After creating just test using the id_token from the callback page
- Click on GET, than Method Request
- Authorization click on edit and select MyCustom
- Click on Actions, than deploy

**Attention:** Is it necessary to create the method OPTIONS and set the CORS properties on both API of GET/OPTIONS

## Create S3 access

To use the S3 API directly you will need to create a bucked.

Create a new bucket with *block all public access* options.

**Changes to Cognito**

- Create a new Identity Pool
  - Name: <samenameofuserpoll>IdentityPool
  - Authentication providers
    - Inform the UserPoolId
    - Inform the ApplicationId
  - Create pool
  - Create a new Role with S3Access on the name. e.g: Cognito_SimpleTestEmailOnlyIdentityPoolAuth_S3Access_Role
    - The AWS console will ask to create two roles
- Go the IAM console
  - Search the role that have PoolAuth on the name
  - Attach a policy to AmazonS3ReadOnlyAccess

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:006f7d0c-c645-43c6-bf6d-f0381fbe823c',
});

```javascript
Access-Control-Allow-Headers: *
Access-Control-Allow-Methods: *
Access-Control-Allow-Origin: *
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
REACT_APP_AWS_IDENTITYPOOL_ID=<name complete with the region + id>
REACT_APP_AWS_API_GATEWAY=<full url to execute the GET command on api gateway>
```

Start

```javascript
npm start
```

After login you can check the button:

- *Click to call an API* will call an API from the API Gateway using the idToken
- *Click to call S3* wil call an API from the S3 to count the number of files that exists on the bucket

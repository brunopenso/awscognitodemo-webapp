# Meetup Cognito Demo - Web App

This branch 'Step1_OnlyEmail' use the external screen provided by AWS Cognito for the login function, where the user and password are stored in Amazon Cognito, with other Identity Providers like Facebook and Google.

**Disclaimer:** This code was not create to use on production environment, it is just for learning AWS Cognito.

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

## Running this code

```javascript
npm install
```

Create a file .env.development with this values:

```javascript
SKIP_PREFLIGHT_CHECK=true
REACT_APP_AWS_COGNITO_CLIENT_ID=<id of the application associated to the user pool>
REACT_APP_AWS_COGNITO_URL=<domain url of the application>
```

Start

```javascript
npm start
```

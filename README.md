# Meetup Cognito Demo - Web App

This branch 'SimpleTestEmailOnly' use the configuration in mode RAW using an external screen to login, where the user and password are stored in Amazon Cognito.

## How to run this code?

```javascript
npm install
```

Create a file .env.local with this values:
```
SKIP_PREFLIGHT_CHECK=true
AWS_COGNITO_CLIENT_ID=<id of the application associated to the user pool>
AWS_COGNITO_URL=<domain url of the application>
```
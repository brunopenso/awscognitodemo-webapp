# Meetup Cognito Demo - Web App

This branch 'amplify-basic-cli' was setup using the Amplify framework and the CLI commands to setup a authentication for a web app application.

The CLI command do everything you need using cloud formation objects.

I used https://aws-amplify.github.io/docs/js/authentication to create everything.

Instructions for react: https://aws-amplify.github.io/docs/js/react

**Disclaimer:** This code was not create to use on production environment, it just for learning Cognito.

## How to run this code?

**Setup your machine**

```javascript
npm install -g @aws-amplify/cli
```

**Setup your project**

Follow the questions of this cli

*Note:* I`m tests I used email as username for the tests.

```javascript
amplify configure
amplify add auth
amplify push
amplify publish
```

**Itens created**

After running everything some aws resources will be created

- Auth
  - User pool: awscognitodemowebappd2b1d65e_userpool_d2b1d65e-local
  - SMS Role: arn:aws:iam::501360543632:role/sns204721-local
  - Identity  Pool: awscognitodemowebappd2b1d65e_identitypool_d2b1d65e__local
- S3: 2 buckets
- CloudFormation: 3 itens

**Running**

After executing the command amplify push a browser url will be open

After login you will see the JWT tokens

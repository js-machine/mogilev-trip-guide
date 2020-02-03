import * as express from 'express';
import * as bodyBarser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { Inject, Injectable } from '@mogilev-guide/api/ioc';

//import passport module for OAuth2
import * as passport from 'passport';
import { AuthorizationRouter } from '@mogilev-guide/api/authorization/auth.routes';
import { GoogleOAuth20Authorization } from '@mogilev-guide/api/authorization/googleAuth.passport';
import { AuthorizationMiddleware } from '@mogilev-guide/api/authorization/auth.middleware';

//for work with environment variables from .env file
import 'dotenv/config';

// import all controllers before routes registration
import '@mogilev-guide/api/controllers';

// routes are auto-generated by tsoa
import { RegisterRoutes } from '@mogilev-guide/api/routes';

const app = express();

const googleStrategy = new GoogleOAuth20Authorization();
const authRout = new AuthorizationRouter();
const authMiddleware = new AuthorizationMiddleware();

app
  .use(cors({ origin: true }))
  .use(bodyBarser.json())
  .use(cookieParser())
  .use(passport.initialize())
  .use(passport.session())
  .use(bodyBarser.urlencoded({ extended: false }))
  .use(authMiddleware.getMiddlewareRoutes())
  .use(authRout.getAuthRoutes(googleStrategy.getStrategy()));

RegisterRoutes(app);

app.get('*', (_, res) =>
  res.status(404).json({
    success: false,
    data: 'Endpoint not found'
  })
);

export default app;

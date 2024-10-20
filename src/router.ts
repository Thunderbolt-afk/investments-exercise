// Importing dependencies.
import express from 'express';

// Importing routers.
import auth from './auth/auth.router';
import investments from './investments/investments.router';

// Creating router.
const Root = express.Router();

// Defining routes.
Root.use('/auth', auth);
Root.use('/investments', investments);

// Exporting router.
export default Root;
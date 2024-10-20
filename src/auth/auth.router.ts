// Importing dependencies.
import express from 'express';

// Importing routers.
import auth from './auth.api';

// Creating router.
const authRouter = express.Router();

// Defining routes.
authRouter.use('/', auth);

// Exporting router.
export default authRouter;
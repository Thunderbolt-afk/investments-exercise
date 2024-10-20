// Importing dependencies.
import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

// Importing middlewares.
import AuthMiddleware from '../../middlewares/auth.middleware';

// Importing service layer.
import AuthService from './auth.service';
import checkHttpMethods from '../../middlewares/checkHttpMethod.middleware';
import { LoginResponse } from './auth';

// Declaring allowed methods.
const allowedAuthMethods = ['POST'];

// Creating router.
const authRouter = express.Router();

// Defining routes.
authRouter
    .route('/')
    .all(checkHttpMethods(allowedAuthMethods))
    .post(
        AuthMiddleware.basicAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Declaring variables.
                const authService = new AuthService();

                // Accessing service layer.
                const response: LoginResponse = await authService.login(req.account);

                // Sending response.
                res.status(200).json(response).end();
            } catch (error) {
                next(error);
            }
        });

// Exporting router.
export default authRouter;
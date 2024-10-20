// Importing dependencies.
import { Account } from '@prisma/client';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import passport from "passport";

// Importing loaders.
import { database } from '../loaders/database.loader';
import ResponseError from '../loaders/error.loader';

// Declaring variables.
let tokenRevocationList = new Set();

// Setting up auth middlewares.
export default class AuthMiddleware {
    /**
     * A middleware that authenticates a request using HTTP Basic Auth.
     * If the request is not a Basic Auth request, it simply passes control to the next middleware.
     * If it is a Basic Auth request, it uses passport to authenticate the user and assigns the user to the request.
     * If the authentication fails, it throws a 401 error.
     * @returns {RequestHandler}
     */
    static basicAuth(): RequestHandler {
        return (req: Request, res: Response, next: NextFunction) => {
            // Checking if it's not a basic auth request.
            if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Basic') {
                next();
            }

            // If it's a basic auth request.
            else {
                passport.authenticate(
                    'basic',
                    { session: false },
                    (error: Error, user: Account | Error, info: any) => {
                        try {
                            // Checking for errors.
                            if (error) {
                                throw new ResponseError(401, error.message);
                            }

                            if (!user) {
                                throw new ResponseError(401, 'Unauthorized. Invalid credentials.');
                            }

                            // Assigning user to request.
                            req.account = user as Account;
                            next();
                        } catch (error) {
                            next(error);
                        }
                    }
                )(req, res, next);
            }
        }
    }

    /**
     * A middleware that authenticates a request using a JWT.
     * If the request is not a JWT Auth request, it simply passes control to the next middleware.
     * If it is a JWT Auth request, it uses passport to authenticate the user and assigns the user to the request.
     * If the authentication fails, it throws a 401 error.
     * @returns {RequestHandler}
     */
    static jwtAuth(): RequestHandler {
        return (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate(
                'jwt',
                { session: false },
                async (error: Error, data: { permissions: string[], account: { id?: number } }, info: any) => {
                    try {
                        // Checking for errors.
                        if (error) {
                            throw new ResponseError(401, error.message);
                        }

                        if (info) {
                            throw new ResponseError(401, info.message);
                        }

                        // Retrieving account.
                        let account: Account | null = null;

                        if (data.account?.id) {
                            account = await database.account.findUnique({
                                where: {
                                    id: data.account.id
                                }
                            });

                            // Checking if account exists.
                            if (!account) {
                                throw new ResponseError(401, 'Unauthorized. Account not found.');
                            }
                        }

                        // Assigning account to request.
                        req.account = account || undefined;

                        // Assigning permissions to request.
                        req.permissions = data.permissions || [];

                        // Deprecating token.
                        if (tokenRevocationList.has(req.headers.authorization)) {
                            throw new ResponseError(401, 'Unauthorized. Token already used.');
                        } else {
                            tokenRevocationList.add(req.headers.authorization);
                        }

                        // Assigning user to request.
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            )(req, res, next);
        }
    }
}
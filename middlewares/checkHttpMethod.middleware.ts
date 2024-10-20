// Importing dependencies.
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Importing loaders.
import ResponseError from '../loaders/error.loader';

/**
 * A middleware that checks if the request method is allowed.
 * If the request method is not allowed, it throws a 405 error.
 * @param methods The allowed methods.
 * @returns A middleware that checks if the request method is allowed.
 */
function checkHttpMethods(methods: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Checking if the request method is allowed.
            if (!methods.includes(req.method)) {
                throw new ResponseError(405, 'Method not allowed.');
            }

            // Passing control to next middleware.
            next();
        } catch (error) {
            next(error);
        }
    }
}

// Exporting middleware.
export default checkHttpMethods;
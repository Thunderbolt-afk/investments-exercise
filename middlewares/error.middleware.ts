// Importing dependencies.
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

// Importing loaders.
import ResponseError from '../loaders/error.loader';

/**
 * Middleware function that handles errors by sending an appropriate error response.
 */
function error(): ErrorRequestHandler {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
        // Sending error response by class send function.
        if (err instanceof ResponseError) {
            err.send(res);
        }
        // Sending generic error response.
        else {
            res.status(500).json({ message: err.message }).end();
        }
    }
}

// Exporting middleware.
export default error;
// Importing dependencies.
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Importing loaders.
import ResponseError from '../loaders/error.loader';

// Declaring types.
type Permissions = 'read' | 'write';

/**
 * A middleware that checks if the request has the given permissions.
 * If the request doesn't have the given permissions, it throws a 401 error.
 * @param permissions The permissions to check.
 * @returns A middleware that checks if the request has the given permissions.
 */
function checkPermissions(permissions: Permissions[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Checking permissions.
            if (!req.permissions?.length) {
                throw new ResponseError(401, 'Unauthorized. Missing permissions.');
            }

            for (let permission of permissions) {
                if (!req.permissions!.includes(permission)) {
                    throw new ResponseError(401, 'Unauthorized. Permission not found.');
                }
            }

            // Passing control to next middleware.
            next();
        } catch (error) {
            next(error);
        }
    }
}

// Exporting middleware.
export default checkPermissions;
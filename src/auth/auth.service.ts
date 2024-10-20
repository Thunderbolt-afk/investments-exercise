// Importing dependencies.
import { Account } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { LoginResponse } from './auth';
import { jwtOptions } from '../../loaders/passport.loader';

export default class AuthService {
    /**
     * Logging in a user.
     * @param user The user to login.
     * @returns The JWT token with the user's permissions.
     * @throws An error if the user is not found.
     */
    public async login(user?: Account | null): Promise<LoginResponse> {
        try {
            // Defining response data.
            const permissions = user ? ["read", "write"] : ["read"];
            const account = { id: user?.id };

            // Generating token.
            let token = jwt.sign({ permissions, account }, jwtOptions.secretOrKey)

            // Returning spot.
            return { data: { token } };
        } catch (error) {
            throw error;
        }
    }
}
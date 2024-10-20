// Importing dependencies.
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import passportJwt from 'passport-jwt';
import crypto from 'crypto';

// Importing loaders.
import { database } from './database.loader';

// Declaring variables.
let ExtractJwt = passportJwt.ExtractJwt;
let JwtStrategy = passportJwt.Strategy;

// Declaring options used for generating jwt.
let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY || new Date().toISOString()
};

// Setting up passport strategies.
export default () => {
    // Initializing basic strategy.
    passport.use(
        new BasicStrategy(async (email, password, done) => {
            try {
                // Validating data.
                if (!email || !password) {
                    throw new Error("Invalid login data.");
                }

                //Retrieving account from database.
                const user = await database.account.findFirst({
                    where: {
                        email: email,
                        password: crypto.createHash('sha256').update(password).digest('hex')
                    }
                });

                // Checking if account exists.
                if (!user) {
                    throw new Error("Invalid credentials.");
                }

                // Returning account.
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        })
    );

    // Initializing jwt strategy.
    passport.use(
        new JwtStrategy(jwtOptions, function (payload, done) {
            try {
                return done(null, payload);
            } catch (error) {
                return done(error, false, error);
            }
        })
    );
}

// Exporting settings.
export { jwtOptions };
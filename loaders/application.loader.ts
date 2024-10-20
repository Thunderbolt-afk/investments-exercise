// Importing dependencies.
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import http from 'http';

// Importing loaders.
import setupPassport from './passport.loader';

// Importing router.
import Root from '../src/router';
import error from '../middlewares/error.middleware';

export default class Application {
    private _app: express.Application;
    private _server: http.Server;

    /**
     * Constructor for the Application class.
     * Sets up an express application and runs it.
     * @constructor
     */
    constructor() {
        // Setting up express application.
        this._app = this._setupApp(express());

        // Setting up server.
        let port = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production' ? Number(process.env.PORT) : 80;

        // Running application.
        this._server = this._app.listen(port, () => {
            console.log('Server is running on port ' + port);
        });
    }

    /**
     * A private method that sets up an express application.
     * @param application The express application to setup.
     * @returns The setup express application.
     */
    private _setupApp(application: express.Application): express.Application {
        try {
            // Initializing helmet.
            application.use(helmet.dnsPrefetchControl());
            application.use(helmet.frameguard());
            application.use(helmet.hidePoweredBy());
            application.use(helmet.hsts());
            application.use(helmet.ieNoOpen());
            application.use(helmet.noSniff());
            application.use(helmet.permittedCrossDomainPolicies());
            application.use(helmet.referrerPolicy());
            application.use(helmet.xssFilter());

            // Initalizing passport.
            application.use(passport.initialize());
            setupPassport();

            // Initializing express body parser.
            application.use(express.json());
            application.use(express.urlencoded({ extended: false }));

            // Initializing api routes.
            application.use('/api', Root);

            // Initializing error middleware.
            application.use(error());

            // Returning spot.
            return application;
        } catch (error) {
            throw error;
        }
    }

    // Getters
    public get app(): express.Application {
        return this._app;
    }

    public get server(): http.Server {
        return this._server;
    }
}
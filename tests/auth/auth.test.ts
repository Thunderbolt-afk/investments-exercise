// Importing dependencies.
import supertest from "supertest"
import express from "express";
import jwt from "jsonwebtoken";

// Importing server.
import Application from "../../loaders/application.loader";

// Declaring variables.
let application: Application;
let app: express.Application;

// Instancing server.
beforeAll(() => {
    application = new Application();
    app = application.app;
});

// Closing http server after each tests to free up resources.
afterAll(() => {
    application.server.close();
});

// Describing tests.
describe('auth', () => {
    describe('POST /api/auth', () => {
        describe('with not valid credentials in Basic Auth', () => {
            it('should throw an error', async () => {
                // Defining credentials for login.
                const credentials = Buffer.from(`aaa@aaa.it:bbb`).toString('base64');

                // Logging in the user.
                const response = await supertest(app).post(`/api/auth`).set('Authorization', `Basic ${credentials}`);

                // Checking response.
                expect(response.status).toBe(401);
            });
        });

        describe('with valid credentials in Basic Auth', () => {
            it('should return a token with read and write permissions in the payload object', async () => {
                // Defining credentials for login.
                const credentials = Buffer.from(`test1@email.com:prova1`).toString('base64');

                // Logging in the user.
                const response = await supertest(app).post(`/api/auth`).set('Authorization', `Basic ${credentials}`);

                // Checking response.
                expect(response.status).toBe(200);
                expect(response.body.data.token).toBeTruthy();

                // Checking permissions.
                const data: any = jwt.decode(response.body.data.token);
                expect(data.permissions).toEqual(['read', 'write']);
            });
        });

        describe('with no Basic Auth', () => {
            it('should return a token with read permission in the payload object', async () => {
                // Logging in the user.
                const response = await supertest(app).post(`/api/auth`).set('Authorization', `Bearer aaa`);

                // Checking response.
                expect(response.status).toBe(200);
                expect(response.body.data.token).toBeTruthy();

                // Checking permissions.
                const data: any = jwt.decode(response.body.data.token);
                expect(data.permissions).toEqual(['read']);
            });
        });

        describe('if the user uses the token two times', () => {
            it('should throw an error', async () => {
                // Defining credentials for login.
                const credentials = Buffer.from(`test1@email.com:prova1`).toString('base64');

                // Logging in the user.
                const authResponse = await supertest(app).post(`/api/auth`).set('Authorization', `Basic ${credentials}`);

                // Checking response.
                const data: any = jwt.decode(authResponse.body.data.token);

                // Trying to retrieve investments first time.
                const response1 = await supertest(app).get(`/api/investments`).set('Authorization', `Bearer ${authResponse.body.data.token}`);
                expect(response1.status).toBe(200);

                // Trying to retrieve investments second time.
                const response2 = await supertest(app).get(`/api/investments`).set('Authorization', `Bearer ${authResponse.body.data.token}`);
                expect(response2.status).toBe(401);
            });
        })
    });
});

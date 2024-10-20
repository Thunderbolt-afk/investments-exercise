// Importing dependencies.
import supertest from "supertest"
import express from "express";

// Importing server.
import Application from "../../loaders/application.loader";

// Importing utils.
import { retrieveToken } from "../utils/test.util";
import { set } from "lodash";

// Declaring variables.
let application: Application;
let app: express.Application;
let token: string;

// Instancing server.
beforeAll(() => {
    application = new Application();
    app = application.app;
});

// Retrieving token before each tests.
beforeEach(async () => {
    token = await retrieveToken(app, token);
});

// Closing http server after each tests to free up resources.
afterAll(() => {
    application.server.close();
});

// Describing tests.
describe('investments', () => {
    describe('GET /api/investments', () => {
        describe('with no jwt authentication token', () => {
            it('should return 401', async () => {
                // Trying to retrieve investments with no token.
                await supertest(app).get('/api/investments').expect(401);
            });
        });

        describe('with valid jwt authentication token', () => {
            it('should return 200', async () => {
                // Trying to retrieve investments with valid token.
                await supertest(app).get('/api/investments').set('Authorization', `Bearer ${token}`).expect(200);
            })
        });
    });

    describe('POST /api/investments', () => {
        // Declaring variables.
        const validPayload = {
            "amount": 12,
            "annualRate": 12.76,
            "confirmedAt": "2024-10-18T20:23:01Z"
        };

        describe('with no jwt authentication token', () => {
            it('should return 401', async () => {
                // Trying to create an investment with no token.
                await supertest(app).post('/api/investments').send(validPayload).expect(401);
            });
        });

        describe('with valid jwt but no write permission', () => {
            it('should return 401', async () => {
                // Retrieving token with no write permission.
                const noWriteToken = await supertest(app).post('/api/auth');

                // Trying to create an investment with no write permission.
                await supertest(app).post('/api/investments').send(validPayload).set('Authorization', `Bearer ${noWriteToken}`).expect(401);
            })
        });

        describe('with valid jwt authentication token and write permission', () => {
            it('should return 200', async () => {
                // Creating an investment.
                const response = await supertest(app).post('/api/investments').send(validPayload).set('Authorization', `Bearer ${token}`);

                // Checking response.
                expect(response.status).toBe(201);
                expect(response.body.data?.id).toBeTruthy();

                // Checking investment.
                token = await retrieveToken(app, token);
                const investment = await supertest(app).get(`/api/investments`).query({ id: response.body.data.id }).set('Authorization', `Bearer ${token}`);

                expect(investment.status).toBe(200);
                expect(investment.body.data[0]?.id).toBe(response.body.data.id);
                expect(investment.body.data[0]?.amount).toBe(validPayload.amount);
                expect(investment.body.data[0]?.annual_rate).toBe(validPayload.annualRate);
                expect(new Date(investment.body.data[0]?.confirmed_at).getTime()).toBe(new Date(validPayload.confirmedAt).getTime());
            });
        });

        describe('with invalid payload', () => {
            it('should return 400', async () => {
                // Creating an investment with various invalid payloads.
                await supertest(app).post('/api/investments').send({ amount: 12 }).set('Authorization', `Bearer ${token}`).expect(400);

                token = await retrieveToken(app, token);
                await supertest(app).post('/api/investments').send({ annualRate: 12.76 }).set('Authorization', `Bearer ${token}`).expect(400);

                token = await retrieveToken(app, token);
                await supertest(app).post('/api/investments').send({ confirmedAt: "2024-10-18T20:23:01Z" }).set('Authorization', `Bearer ${token}`).expect(400);

                token = await retrieveToken(app, token);
                await supertest(app).post('/api/investments').send({ ...validPayload, amount: -12 }).set('Authorization', `Bearer ${token}`).expect(400);

                token = await retrieveToken(app, token);
                await supertest(app).post('/api/investments').send({ ...validPayload, annualRate: -12.76 }).set('Authorization', `Bearer ${token}`).expect(400);
            });
        })
    })
});
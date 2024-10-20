// Importing dependencies.
import supertest from "supertest"
import express from "express";

// Importing server.
import Application from "../../loaders/application.loader";

// Importing utils.
import { calculateInvestmentStatsByInvestments, retrieveToken } from "../utils/test.util";
import { groupBy, set } from "lodash";

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
    describe('GET /api/investments/stats', () => {
        describe('with no jwt authentication token', () => {
            it('should return 401', async () => {
                // Trying to retrieve investments with no token.
                await supertest(app).get('/api/investments/stats').expect(401);
            });
        });

        const today = new Date();
        const midnightToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const midnightTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, 0);

        describe('with not valid query params', () => {
            it('should return 400', async () => {
                // Trying to retrieve investments with not valid query params.
                await supertest(app).get('/api/investments/stats').query({}).set('Authorization', `Bearer ${token}`).expect(400);

                token = await retrieveToken(app, token);
                await supertest(app).get('/api/investments/stats').query({ createdAtGt: midnightToday.toISOString() }).set('Authorization', `Bearer ${token}`).expect(400);

                token = await retrieveToken(app, token);
                await supertest(app).get('/api/investments/stats').query({ createdAtLt: midnightTomorrow.toISOString() }).set('Authorization', `Bearer ${token}`).expect(400);

                token = await retrieveToken(app, token);
                await supertest(app).get('/api/investments/stats').query({ groupBy: "day" }).set('Authorization', `Bearer ${token}`).expect(400);

                token = await retrieveToken(app, token);
                await supertest(app).get('/api/investments/stats').query({ createdAtGt: midnightToday.toISOString(), createdAtLt: midnightTomorrow.toISOString() }).set('Authorization', `Bearer ${token}`).expect(400);

                token = await retrieveToken(app, token);
                await supertest(app).get('/api/investments/stats').query({ createdAtGt: midnightToday.toISOString(), createdAtLt: midnightTomorrow.toISOString(), groupBy: "notValidGroupByValue" }).set('Authorization', `Bearer ${token}`).expect(400);
            }, 60000);
        });

        describe('with valid jwt authentication token', () => {
            it('should return 200 and the data should be compliant', async () => {
                // Retrieving investments in the period.
                const investments = (await supertest(app).get('/api/investments').query({ createdAtGt: midnightToday.toISOString(), createdAtLt: midnightTomorrow.toISOString() }).set('Authorization', `Bearer ${token}`)).body.data;

                // Day groupping.
                // Retrieving stats.
                token = await retrieveToken(app, token);
                let statsResponse = await supertest(app).get('/api/investments/stats').query({ createdAtGt: midnightToday.toISOString(), createdAtLt: midnightTomorrow.toISOString(), groupBy: "day" }).set('Authorization', `Bearer ${token}`).expect(200);

                // Calculating stats.
                let stats = statsResponse.body.data;
                let calculatedStats = calculateInvestmentStatsByInvestments(investments, "day");

                // Checking stats.
                expect(stats).toEqual(calculatedStats);

                // Week groupping.
                // Retrieving stats.
                token = await retrieveToken(app, token);
                statsResponse = await supertest(app).get('/api/investments/stats').query({ createdAtGt: midnightToday.toISOString(), createdAtLt: midnightTomorrow.toISOString(), groupBy: "week" }).set('Authorization', `Bearer ${token}`).expect(200);

                // Calculating stats.
                stats = statsResponse.body.data;
                calculatedStats = calculateInvestmentStatsByInvestments(investments, "week");

                // Checking stats.
                expect(stats).toEqual(calculatedStats);

                // Month groupping.
                // Retrieving stats.
                token = await retrieveToken(app, token);
                statsResponse = await supertest(app).get('/api/investments/stats').query({ createdAtGt: midnightToday.toISOString(), createdAtLt: midnightTomorrow.toISOString(), groupBy: "month" }).set('Authorization', `Bearer ${token}`).expect(200);

                // Calculating stats.
                stats = statsResponse.body.data;
                calculatedStats = calculateInvestmentStatsByInvestments(investments, "month");

                // Checking stats.
                expect(stats).toEqual(calculatedStats);

                // Year groupping.
                // Retrieving stats.
                token = await retrieveToken(app, token);
                statsResponse = await supertest(app).get('/api/investments/stats').query({ createdAtGt: midnightToday.toISOString(), createdAtLt: midnightTomorrow.toISOString(), groupBy: "year" }).set('Authorization', `Bearer ${token}`).expect(200);

                // Calculating stats.
                stats = statsResponse.body.data;
                calculatedStats = calculateInvestmentStatsByInvestments(investments, "year");

                // Checking stats.
                expect(stats).toEqual(calculatedStats);
            }, 120000);
        });
    });
});
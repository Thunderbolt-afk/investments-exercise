// Importing dependencies.
import request, { Response } from "supertest";
import { Application } from "express";
import { Investment } from "@prisma/client";
import { formatInvestmentsStatsTimePeriodUtil } from "../../src/investments/stats/investments.stats.util";
import { InvestmentsStat } from "../../src/investments/stats/investments.stats";

const retrieveToken = async (app: Application, actualToken?: string | null): Promise<string> => {
    // Defining credentials for login.
    const credentials = Buffer.from(`test1@email.com:prova1`).toString('base64');

    // Retrieving token.
    let tempToken: string;
    let response: Response;
    do {
        // Logging in the user.
        response = await request(app).post(`/api/auth`).set('Authorization', `Basic ${credentials}`);
        tempToken = response.body.data.token;

        // Checking if new token is valid.
        if (actualToken && tempToken === actualToken) {
            setTimeout(() => { }, 1000);
        }
    } while (actualToken && tempToken === actualToken);

    // Returning token.
    return response.body.data.token;
}

const calculateInvestmentStatsByInvestments = (investments: Investment[], groupBy: "day" | "week" | "month" | "year") => {
    let stats: InvestmentsStat[] = [];

    for (let investment of investments) {
        if (!investment.created_at || !investment.amount) continue;

        let date: Date = new Date(investment.created_at);
        let key: string = formatInvestmentsStatsTimePeriodUtil(groupBy)({ created_at: date })!;

        let existingStat = stats.findIndex(s => Object.keys(s)[0] === key);
        if (existingStat === -1) {
            stats.push({ [key]: { count: 1, total_amount: investment.amount } });
        } else {
            stats[existingStat][key].count++;
            stats[existingStat][key].total_amount += investment.amount;
        }
    }

    return stats;
}

// Exporting utils.
export { retrieveToken, calculateInvestmentStatsByInvestments };
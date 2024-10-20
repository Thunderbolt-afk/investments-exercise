// Importing loaders.
import { database } from "../../../loaders/database.loader";

// Importing interfaces.
import { ExtendedInvestmentForStats, GetInvestmentsStatsPayload, GetInvestmentsStatsResponse, InvestmentsStat } from "./investments.stats";

// Importing utils.
import { defineStatsFromInvestments, formatInvestmentsStatsTimePeriodUtil } from "./investments.stats.util";

export default class InvestmentsStatsData {
    /**
     * Retrieves investments and calculates stats, grouped by given time period.
     *
     * @param payload - Query payload with time period grouper.
     * @returns Stats of investments, grouped by given time period.
     */
    public async getInvestmentsStats(payload: GetInvestmentsStatsPayload): Promise<GetInvestmentsStatsResponse> {
        try {
            // Extending prisma client with time period grouper.
            let client = database.$extends({
                name: "time_period",
                result: {
                    investment: {
                        time_period: {
                            needs: { created_at: true },
                            compute(investment) {
                                return formatInvestmentsStatsTimePeriodUtil(payload.groupBy)(investment);
                            }
                        }
                    }
                }
            });

            // Retrieving investments.
            let investments: ExtendedInvestmentForStats[] = await client.investment.findMany({
                where: payload.query,
            });

            // Calculating stats.
            let stats: InvestmentsStat[] = defineStatsFromInvestments(investments);

            // Returning spot.
            return { data: stats };
        } catch (error) {
            throw error;
        }
    }
}
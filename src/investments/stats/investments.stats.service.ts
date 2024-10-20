// Importing data layer.
import InvestmentsStatsData from './investments.stats.data';

// Importing interfaces.
import { GetInvestmentsStatsPayload, GetInvestmentsStatsResponse } from './investments.stats';

export default class InvestmentsStatsService {
    // Declaring properties.
    private _investmentsStatsData: InvestmentsStatsData;

    /**
     * Constructor.
     *
     * Initializes data layer.
     */
    constructor() {
        // Initializing data layer.
        this._investmentsStatsData = new InvestmentsStatsData();
    }

    /**
     * Retrieves investments and calculates stats, grouped by given time period.
     *
     * @param payload - Query payload with time period grouper.
     * @returns Stats of investments, grouped by given time period.
     * @throws An error if the query fails.
     */
    public async getInvestmentsStats(payload: GetInvestmentsStatsPayload): Promise<GetInvestmentsStatsResponse> {
        try {
            // Accessing data layer.
            const response = await this._investmentsStatsData.getInvestmentsStats(payload);

            // Returning spot.
            return response;
        } catch (error) {
            throw error;
        }
    }
}
// Importing data layer.
import InvestmentsData from './investments.data';

// Importing interfaces.
import { QueryOptions } from '../../util/query.util';
import { CreateInvestmentPayload, GetInvestmentsPayload, GetInvestmentsResponse } from './investments';

export default class InvestmentsService {
    // Declaring properties.
    private _investmentsData: InvestmentsData;

    /**
     * Constructor.
     *
     * Initializes data layer.
     */
    constructor() {
        // Initializing data layer.
        this._investmentsData = new InvestmentsData();
    }

    /**
     * Retrieves a list of investments based on query and pagination options.
     *
     * @param payload - Query to filter investments by.
     * @param options - Pagination options.
     * @returns A response with the list of investments and pagination options.
     * @throws An error if the query fails.
     */
    public async getInvestments(payload: GetInvestmentsPayload, options: QueryOptions): Promise<GetInvestmentsResponse> {
        try {
            // Accessing data layer.
            const response = await this._investmentsData.getInvestments(payload, options);

            // Returning spot.
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Creates an investment.
     *
     * @param payload - The investment to create.
     * @returns The created investment.
     * @throws An error if the query fails.
     */
    public async createInvestment(payload: CreateInvestmentPayload) {
        try {
            // Accessing data layer.
            const response = await this._investmentsData.createInvestment(payload);

            // Returning spot.
            return response;
        } catch (error) {
            throw error;
        }
    }
}
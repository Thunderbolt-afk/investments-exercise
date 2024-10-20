// Importing loaders.
import { database } from "../../loaders/database.loader";

// Importing interfaces.
import { QueryOptions } from "../../util/query.util";
import { CreateInvestmentPayload, CreateInvestmentResponse, GetInvestmentsPayload } from "./investments";

export default class InvestmentsData {
    /**
     * Retrieves a list of investments based on query and pagination options.
     *
     * @param query - Query to filter investments by.
     * @param options - Pagination options.
     * @returns A response with the list of investments and pagination options.
     * @throws An error if the query fails.
     */
    public async getInvestments(query: GetInvestmentsPayload, options: QueryOptions) {
        try {
            // Declaring variables.
            let investments = await database.investment.findMany({
                where: query,
                take: options.offset,
                skip: options.offset * (options.page - 1),
                orderBy: {
                    [options.sort.by]: options.sort.order
                }
            });

            let count = await database.investment.count({
                where: query
            });

            // Returning spot.
            return {
                data: investments,
                pagination: {
                    total: count,
                    offset: options.offset,
                    page: options.page,
                    totalPages: Math.ceil(count / options.offset),
                }
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Creates an investment.
     * @param data The investment to create.
     * @returns The created investment.
     */
    public async createInvestment(data: CreateInvestmentPayload): Promise<CreateInvestmentResponse> {
        try {
            // Declaring variables.
            let investments = await database.investment.create({ data });

            // Returning spot.
            return {
                data: investments
            };
        } catch (error) {
            throw error
        }
    }
}
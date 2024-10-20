// Importing dependencies.
import { Investment } from "@prisma/client";

// Importing util.
import { PaginationResponse, QueryDateInterval, QueryNumberInterval } from "../../util/query.util";

// Declaring interfaces.
interface GetInvestmentsPayload {
    amount: number | QueryNumberInterval;
    annual_rate: number | QueryNumberInterval;
    confirmed_at: Date | QueryDateInterval;
    created_at: Date | QueryDateInterval;
    created_by: number | QueryNumberInterval;
}

interface GetInvestmentsResponse {
    data: Investment[];
    pagination: PaginationResponse;
}

interface CreateInvestmentPayload {
    amount: number;
    annual_rate: number;
    confirmed_at: Date;
    created_at: Date;
    created_by: number;
}

interface CreateInvestmentResponse {
    data: Investment;
}

// Exporting interfaces.
export { GetInvestmentsPayload, GetInvestmentsResponse, CreateInvestmentPayload, CreateInvestmentResponse };
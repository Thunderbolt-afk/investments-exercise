// Importing dependencies.
import { Investment } from "@prisma/client"

// Declaring interfaces.
interface ExtendedInvestmentForStats extends Investment {
    time_period: string | null
}

interface InvestmentsStat {
    [timePeriod: string]: {
        count: number,
        total_amount: number
    }
}

interface GetInvestmentsStatsPayload {
    query: {
        created_at: {
            lt?: Date,
            gt?: Date
        },
    },
    groupBy: "day" | "week" | "month" | "year"
}


interface GetInvestmentsStatsResponse {
    data: InvestmentsStat[]
}

// Exporting interfaces.
export { GetInvestmentsStatsPayload, GetInvestmentsStatsResponse, InvestmentsStat, ExtendedInvestmentForStats }
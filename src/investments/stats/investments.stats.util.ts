// Importing dependencies.
import { Investment } from '@prisma/client';
import { getYear, getMonth, getWeek, getDate, format } from 'date-fns';
import _ from 'lodash';

// Importing interfaces.
import { ExtendedInvestmentForStats } from './investments.stats';

/**
 * Returns a function that formats the given date to a desired unit of time period.
 *
 * @param unit - Time period unit. It can be 'day', 'week', 'month' or 'year'.
 * @returns A function that accepts an object with a 'created_at' property and returns a string.
 * @throws An error if the given unit is not valid.
 */
function formatInvestmentsStatsTimePeriodUtil(unit: "day" | "week" | "month" | "year") {
    try {
        switch (unit) {
            case 'day':
                // Day grouper function.
                return (data: { created_at?: Date | null }) => data.created_at ? format(data.created_at, 'dd/MM/yyyy') : null;
            case 'week':
                // Week grouper function.
                return (data: { created_at?: Date | null }) => data.created_at ? `${getWeek(data.created_at)}/${getYear(data.created_at)}` : null;
            case 'month':
                // Month grouper function.
                return (data: { created_at?: Date | null }) => data.created_at ? `${getMonth(data.created_at)}/${getYear(data.created_at)}` : null;
            case 'year':
                // Year grouper function.
                return (data: { created_at?: Date | null }) => data.created_at ? `${getYear(data.created_at)}` : null;
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Defines stats from investments, grouped by given time period.
 *
 * @param investments - Array of investments, extended with 'time_period' property.
 * @returns Array of objects, each containing stats for given time period.
 * @throws An error if something goes wrong.
 */
function defineStatsFromInvestments(investments: ExtendedInvestmentForStats[]) {
    try {
        // Grouping by time period.
        let grouping = _.groupBy(investments, 'time_period');

        // Calculating stats.
        let result = Object.keys(grouping).map((key) => {
            return {
                [key]: {
                    count: grouping[key].length,
                    total_amount: _.sumBy(grouping[key], 'amount')
                }
            };
        });

        // Returning spot.
        return result;
    } catch (error) {
        throw error;
    }
}

// Exporting functions.
export { formatInvestmentsStatsTimePeriodUtil, defineStatsFromInvestments };

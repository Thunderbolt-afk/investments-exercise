// Importing dependencies.
import { Prisma } from "@prisma/client";

/**
 * Checks if the given string is a valid sort order.
 * @param {string} sortOrder - Given string to check.
 * @returns {string | undefined} The valid sort order if it is, undefined if it is not.
 */
const checkSortOrder = (sortOrder: string): string | undefined =>
    ['asc', 'desc'].includes(sortOrder.toLocaleLowerCase()) ? sortOrder.toLocaleLowerCase() : undefined;

/**
 * Checks if a model and a field exist in the datamodel.
 * @param {string} model - Name of the model.
 * @param {string} field - Name of the field.
 * @returns {boolean} If the model and the field exist.
 */
const checkModelField = (model: string, field: string): boolean => {
    // Checking if model exists.
    const modelVerified = Prisma.dmmf.datamodel.models.find((m) => m.name === model);

    if (!modelVerified) return false;

    // Checking if field exists.
    const fieldVerified = modelVerified.fields.find((f) => f.name === field);

    if (!fieldVerified) return false;

    return true;
}

// Defining interfaces.
interface QueryNumberInterval {
    gt?: number;
    lt?: number;
}

interface QueryDateInterval {
    gt?: Date;
    lt?: Date;
}

interface QueryOptions {
    page: number;
    offset: number;
    sort: {
        by: string;
        order: string;
    }
}

interface PaginationResponse {
    total: number;
    offset: number;
    page: number;
    totalPages: number;
}

// Exporting utils.
export { checkSortOrder, checkModelField, QueryNumberInterval, QueryDateInterval, QueryOptions, PaginationResponse };
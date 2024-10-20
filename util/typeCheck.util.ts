// Importing dependencies.
import { typeCheck } from 'type-check';

// Declaring types.
type typeCheckType = "String" | "Number" | "Date";

// Exporting utility function.

/**
 * Validates the given value based on the specified type.
 * 
 * @param {typeCheckType} type - The type to validate against.
 * @param {any} value - The value to be validated.
 * @returns {any} The validated value if it matches the specified type, otherwise undefined.
 */
export default function typeCheckUtil(type: typeCheckType, value: any): any {
    return typeCheck(type, value) ? value : undefined
}
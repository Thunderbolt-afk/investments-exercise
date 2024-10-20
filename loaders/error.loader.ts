// Importing dependencies.
import { Response } from "express";

export default class ResponseError extends Error {
    // Defining properties.
    private status: number;

    // Defining constructor.

    /**
     * Constructor for ResponseError class.
     * @param status - Status code that will be sent with the response.
     * @param message - Message that will be sent with the response.
     */
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }

    /**
     * Sends error response with status code and error message.
     * @param res - Express response object.
     */
    send(res: Response) {
        try {
            res.status(this.status).json({ error: { message: this.message } }).end();
        } catch (error) {
            throw error;
        }
    }
}
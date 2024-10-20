// Importing dependencies.
import { User } from "express";
import { Account } from "@prisma/client";

// Declaring module.
declare module "express" {
    interface Request {
        user?: User;
        account?: Account;
        permissions?: string[];
    }
}

// Importing dependencies.
import { PrismaClient } from "@prisma/client";

// Declaring and exporting database singleton.
export const database = new PrismaClient();
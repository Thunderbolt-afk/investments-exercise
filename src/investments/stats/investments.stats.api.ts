// Importing dependencies.
import express, { Request, Response, NextFunction } from 'express';

// Importing middlewares.
import AuthMiddleware from '../../../middlewares/auth.middleware';
import checkPermissions from '../../../middlewares/checkPermissions.middlware';
import checkHttpMethods from '../../../middlewares/checkHttpMethod.middleware';

// Importing loaders.
import ResponseError from '../../../loaders/error.loader';

// Importing util.
import typeCheckUtil from '../../../util/typeCheck.util';
import { checkModelField, checkSortOrder, QueryOptions } from '../../../util/query.util';

// Importing interfaces.
import { GetInvestmentsStatsPayload, GetInvestmentsStatsResponse } from './investments.stats';

// Importing service layer.
import InvestmentsStatsService from './investments.stats.service';

// Declaring allowed methods.
const allowedInvestmentMethods = ['GET'];

// Creating router.
const investmentRouter = express.Router();

// Defining route.
investmentRouter
    .route('/')
    .all(checkHttpMethods(allowedInvestmentMethods))
    .get(
        AuthMiddleware.jwtAuth(),
        checkPermissions(['read']),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Initializing service layer.
                const investmentsStatsService = new InvestmentsStatsService();

                // Defining payload.
                const payload: GetInvestmentsStatsPayload = {
                    query: {
                        created_at: {
                            gt: typeCheckUtil("Date", new Date(String(req.query.createdAtGt))),
                            lt: typeCheckUtil("Date", new Date(String(req.query.createdAtLt))),
                        }
                    },
                    groupBy: typeCheckUtil("String", req.query.groupBy)
                }

                // Validating payload.
                if (!payload.query.created_at.gt && !payload.query.created_at.lt) {
                    throw new ResponseError(400, "Missing or not valid required query parameter 'createdAtGt' or 'createdAtLt'.");
                }

                if (!payload.groupBy || !["day", "week", "month", "year"].includes(payload.groupBy)) {
                    throw new ResponseError(400, "Missing or not valid required query parameter 'groupBy'. It must be 'day', 'week', 'month' or 'year'.");
                }

                // Accessing service layer.
                const response: GetInvestmentsStatsResponse = await investmentsStatsService.getInvestmentsStats(payload);

                // Sending response.
                res.status(200).json(response).end();
            } catch (error: any) {
                next(error);
            }
        });

// Exporting router.
export default investmentRouter;
// Importing dependencies.
import express, { Request, Response, NextFunction } from 'express';

// Importing middlewares.
import AuthMiddleware from '../../middlewares/auth.middleware';
import checkHttpMethods from '../../middlewares/checkHttpMethod.middleware';
import checkPermissions from '../../middlewares/checkPermissions.middlware';

// Importing loaders.
import ResponseError from '../../loaders/error.loader';

// Importing util.
import typeCheckUtil from '../../util/typeCheck.util';
import { checkModelField, checkSortOrder, QueryOptions } from '../../util/query.util';

// Importing interfaces.
import { CreateInvestmentPayload, GetInvestmentsPayload } from './investments';

// Importing service layer.
import InvestmentsService from './investments.service';

// Declaring allowed methods.
const allowedInvestmentsMethods = ['GET', 'POST'];

// Creating router.
const investmentsRouter = express.Router();

// Defining route.
investmentsRouter
    .route('/')
    .all(checkHttpMethods(allowedInvestmentsMethods))
    .get(
        AuthMiddleware.jwtAuth(),
        checkPermissions(['read']),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Initializing service layer.
                const investmentsService = new InvestmentsService();

                // Defining payload.
                const payload: GetInvestmentsPayload = {
                    amount: typeCheckUtil("Number", Number(req.query.amount)) || {
                        gt: typeCheckUtil("Number", Number(req.query.amountGt)),
                        lt: typeCheckUtil("Number", Number(req.query.amountLt)),
                    },
                    annual_rate: typeCheckUtil("Number", Number(req.query.annualeRate)) || {
                        gt: typeCheckUtil("Number", Number(req.query.annualeRateGt)),
                        lt: typeCheckUtil("Number", Number(req.query.annualeRateLt)),
                    },
                    confirmed_at: typeCheckUtil("Date", new Date(String(req.query.confirmedAt))) || {
                        gt: typeCheckUtil("Date", new Date(String(req.query.confirmedAtGt))),
                        lt: typeCheckUtil("Date", new Date(String(req.query.confirmedAtLt))),
                    },
                    created_at: typeCheckUtil("Date", new Date(String(req.query.createdAt))) || {
                        gt: typeCheckUtil("Date", new Date(String(req.query.createdAtGt))),
                        lt: typeCheckUtil("Date", new Date(String(req.query.createdAtLt))),
                    },
                    created_by: typeCheckUtil("Number", String(req.query.createdBy)) || {
                        gt: typeCheckUtil("Number", String(req.query.createdByGt)),
                        lt: typeCheckUtil("Number", String(req.query.createdByLt)),
                    }
                }

                // Defining options.
                const options: QueryOptions = {
                    page: typeCheckUtil("Number", req.query.page) || 1,
                    offset: typeCheckUtil("Number", req.query.offset) || 100,
                    sort: {
                        by: typeCheckUtil("String", req.query.sortBy) && checkModelField("investments", String(req.query.sortBy)) ?
                            String(req.query.sortBy) :
                            "created_at",
                        order: checkSortOrder(typeCheckUtil("String", req.query.sortOrder) || "") || "desc",
                    },
                }

                // Accessing service layer.
                const response = await investmentsService.getInvestments(payload, options);

                // Sending response.
                res.status(200).json(response).end();
            } catch (error: any) {
                next(error);
            }
        })

    .post(
        AuthMiddleware.jwtAuth(),
        checkPermissions(['write']),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Initializing service layer.
                const investmentsService = new InvestmentsService();

                // Defining payload.
                let payload: CreateInvestmentPayload = {
                    amount: typeCheckUtil("Number", Number(req.body.amount)),
                    annual_rate: typeCheckUtil("Number", Number(req.body.annualRate)),
                    confirmed_at: typeCheckUtil("Date", new Date(req.body.confirmedAt)),
                    created_at: new Date(),
                    created_by: req.account?.id!
                }

                // Checking payload.
                if (!payload.amount || !payload.annual_rate || !payload.confirmed_at || payload.amount < 0 || payload.annual_rate < 0) {
                    throw new ResponseError(400, "Invalid payload.");
                }

                // Accessing service layer.
                const response = await investmentsService.createInvestment(payload);

                // Sending response.
                res.status(201).json(response).end();
            } catch (error: any) {
                next(error);
            }
        });

// Exporting router.
export default investmentsRouter;
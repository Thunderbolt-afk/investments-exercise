// Importing dependencies.
import express from 'express';

// Importing routers.
import investments from './investments.api';
import stats from './stats/investments.stats.api';

// Creating router.
const investmentsRouter = express.Router();

// Defining routes.
investmentsRouter.use('/', investments);
investmentsRouter.use('/stats', stats);

// Exporting router.
export default investmentsRouter;
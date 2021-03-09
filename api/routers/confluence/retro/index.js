import express from 'express';

import newMiddleware from './new';

const router = express.Router();

router.post('/new', newMiddleware);

export default router;

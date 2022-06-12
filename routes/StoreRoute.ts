import { Router } from 'express';
import * as storeController from '../controllers/StoreController';
const router = Router();

router.get('/api/v1/Store/:id', storeController.getById);
router.post('/api/v1/Store', storeController.post);
router.put('/api/v1/Store', storeController.put);
router.delete('/api/v1/Store/:id', storeController.deleteById);
router.get('/api/v1/Store/User/:userId', storeController.getByUserId);

export default router;

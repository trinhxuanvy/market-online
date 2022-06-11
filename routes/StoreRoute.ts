import { Router } from 'express';
import * as storeController from '../controllers/StoreController';
const router = Router();

router.get('/api/v1/Store/:id', storeController.getStoreById);
router.post('/api/v1/Store', storeController.postStore);
router.put('/api/v1/Store', storeController.putStore);
router.delete('/api/v1/Store/:id', storeController.deleteStore);
router.get('/api/v1/Store/User/:userId', storeController.getStoreByUserId);

export default router;

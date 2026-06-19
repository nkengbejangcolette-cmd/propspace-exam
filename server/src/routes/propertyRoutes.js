import { Router } from 'express';
import {
  getProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Order matters: /mine must be declared before /:id.
router.get('/', getProperties);
router.get('/mine', protect, getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;

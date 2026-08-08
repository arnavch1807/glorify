import { Router } from 'express';
import { register, login, logout, refresh, me, forgotPasswordPlaceholder, resetPasswordPlaceholder } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authenticate as any, me);
router.post('/forgot-password', forgotPasswordPlaceholder);
router.post('/reset-password', resetPasswordPlaceholder);

export default router;

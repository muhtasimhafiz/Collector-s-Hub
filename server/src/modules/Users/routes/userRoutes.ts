import express, { Router } from 'express';
import { createUserHandler, getuserDetails, loginUserHandler, registrationHandle, updateUserDetails } from '../controllers/UserController';
import { authenticateToken } from '../../../middlewares/authMiddleware';
import { body } from 'express-validator';


const router: Router = express.Router();

router.post('/user', createUserHandler);
router.post('/login', loginUserHandler);
router.get('/user/:id', getuserDetails )
router.put('/user/:id', updateUserDetails )



//routes input sanitization
const registrationSanitize = [
  body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
  body('username').trim().escape().isLength({ min: 1 }).withMessage('Full name is required')
];
router.post('/register',registrationSanitize,registrationHandle);

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: "You have access to the protected route" });
});

export default router;

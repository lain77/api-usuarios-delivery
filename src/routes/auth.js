import { Router } from 'express';
import { registerCliente, registerEntregador, login } from '../controllers/auth.js';

const router = Router();

router.post('/registro/cliente', registerCliente);
router.post('/registro/entregador', registerEntregador);
router.post('/login', login);

export default router;
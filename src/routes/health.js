import { Router } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

// GET /health  -> checagem rasa (o processo esta no ar)
router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'delivery-usuario' });
});

// GET /health/db -> checagem real: conecta no banco e le dados.
// Prova que o DATABASE_URL (vindo do Infisical) funciona e que
// os dados estao chegando do MySQL.
router.get('/db', async (req, res) => {
  try {
    // 1. Ping de conexao
    await prisma.$queryRaw`SELECT 1`;

    // 2. Leitura real de dados: conta usuarios e pega uma amostra
    const totalUsuarios = await prisma.user.count();
    const amostra = await prisma.user.findMany({
      take: 5,
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        user_role: true,
        user_status: true,
        user_created_at: true,
      },
      orderBy: { user_created_at: 'desc' },
    });

    res.json({
      status: 'ok',
      database: 'conectado',
      total_usuarios: totalUsuarios,
      amostra,
    });
  } catch (err) {
    res.status(503).json({
      status: 'erro',
      database: 'falha na conexao ou consulta',
      detalhe: err.message,
    });
  }
});

export default router;

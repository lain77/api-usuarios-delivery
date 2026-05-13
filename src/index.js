import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectRabbitMQ, disconnectRabbitMQ } from './services/rabbitmq.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'delivery-usuario', port: env.port });
});

app.use('/auth', authRoutes);
app.use(errorHandler);

async function start() {
  await connectRabbitMQ();

  const server = app.listen(env.port, () => {
    console.log(`Microsserviço delivery-usuario rodando na porta ${env.port}`);
  });

  const shutdown = async () => {
    console.log('Encerrando microsserviço...');
    
    const forceExit = setTimeout(() => {
      console.error('Shutdown travado, forçando saída');
      process.exit(1);
    }, 10000);
    
    await new Promise((resolve) => server.close(resolve));
    await disconnectRabbitMQ();
    await prisma.$disconnect();
    
    clearTimeout(forceExit);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  console.error('Falha ao iniciar microsserviço:', err);
  process.exit(1);
});
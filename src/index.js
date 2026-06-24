import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectRabbitMQ, disconnectRabbitMQ } from './services/rabbitmq.js';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);

async function start() {
  await connectRabbitMQ();

  const server = app.listen(env.port, () => {
    console.log(`Microsservico delivery-usuario rodando na porta ${env.port}`);
  });

  const shutdown = async () => {
    console.log('Encerrando microsservico...');

    const forceExit = setTimeout(() => {
      console.error('Shutdown travado, forcando saida');
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
  console.error('Falha ao iniciar microsservico:', err);
  process.exit(1);
});

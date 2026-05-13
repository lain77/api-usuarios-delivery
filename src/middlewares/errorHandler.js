import { Prisma } from '@prisma/client';

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'campo';
      return res.status(409).json({ error: `Já existe um registro com este ${field}` });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Dados inválidos', detalhes: err.errors });
  }

  return res.status(500).json({ error: 'Erro interno do servidor' });
}
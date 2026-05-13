import { prisma } from '../config/prisma.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import {
  registerClienteSchema,
  registerEntregadorSchema,
  loginSchema,
} from '../validators/auth.js';
import { publish } from '../services/rabbitmq.js';

export async function registerCliente(req, res) {
  const data = registerClienteSchema.parse(req.body);
  const hashedPassword = await hashPassword(data.user_password);

  const novoUsuario = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        user_name: data.user_name,
        user_email: data.user_email,
        user_password: hashedPassword,
        user_cpf: data.user_cpf,
        user_telefone: data.user_telefone,
        user_role: 'CLIENTE',
      },
    });

    await tx.clienteDados.create({
      data: {
        cliente_user_id: user.user_id,
        cliente_data_nascimento: data.cliente_data_nascimento
          ? new Date(data.cliente_data_nascimento)
          : null,
      },
    });

    return user;
  });

  const { user_password, ...usuarioSeguro } = novoUsuario;

  publish('usuario.cliente.criado', {
  user_id: usuarioSeguro.user_id,
  user_name: usuarioSeguro.user_name,
  user_email: usuarioSeguro.user_email,
  criado_em: usuarioSeguro.user_created_at,
  });

  res.status(201).json(usuarioSeguro);
}

export async function registerEntregador(req, res) {
  const data = registerEntregadorSchema.parse(req.body);
  const hashedPassword = await hashPassword(data.user_password);

  const novoUsuario = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        user_name: data.user_name,
        user_email: data.user_email,
        user_password: hashedPassword,
        user_cpf: data.user_cpf,
        user_telefone: data.user_telefone,
        user_role: 'ENTREGADOR',
      },
    });

    await tx.entregadorDados.create({
      data: {
        entregador_user_id: user.user_id,
        entregador_cnh_numero: data.entregador_cnh_numero,
        entregador_cnh_categoria: data.entregador_cnh_categoria,
        entregador_cnh_validade: new Date(data.entregador_cnh_validade),
        entregador_veiculo_tipo: data.entregador_veiculo_tipo,
        entregador_veiculo_placa: data.entregador_veiculo_placa,
      },
    });

    return user;
  });

  const { user_password, ...usuarioSeguro } = novoUsuario;

  publish('usuario.entregador.criado', {
  user_id: usuarioSeguro.user_id,
  user_name: usuarioSeguro.user_name,
  user_email: usuarioSeguro.user_email,
  veiculo_tipo: data.entregador_veiculo_tipo,
  criado_em: usuarioSeguro.user_created_at,
  });

  res.status(201).json(usuarioSeguro);
}

export async function login(req, res) {
  const data = loginSchema.parse(req.body);

  const usuario = await prisma.user.findUnique({
    where: { user_email: data.user_email },
  });

  if (!usuario) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  if (usuario.user_status !== 'ATIVO') {
    return res.status(403).json({ error: 'Conta inativa ou suspensa' });
  }

  const senhaValida = await verifyPassword(data.user_password, usuario.user_password);

  if (!senhaValida) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = signToken({
    id: usuario.user_id,
    role: usuario.user_role,
  });

  const { user_password, ...usuarioSeguro } = usuario;

  publish('usuario.login.realizado', {
  user_id: usuario.user_id,
  user_role: usuario.user_role,
  em: new Date().toISOString(),
  });

  res.json({ token, user: usuarioSeguro });
}
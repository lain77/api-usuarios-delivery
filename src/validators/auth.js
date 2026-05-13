import { z } from 'zod';

const baseUserSchema = z.object({
  user_name: z.string().min(2).max(100),
  user_email: z.string().email().max(254).toLowerCase(),
  user_password: z.string().min(8).max(72),
  user_cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos'),
  user_telefone: z.string().max(20).optional(),
});

export const registerClienteSchema = baseUserSchema.extend({
  cliente_data_nascimento: z.string().date().optional(),
});

export const registerEntregadorSchema = baseUserSchema
  .extend({
    entregador_cnh_numero: z.string().regex(/^\d{11}$/, 'CNH deve conter 11 dígitos'),
    entregador_cnh_categoria: z.enum(['A', 'B', 'AB', 'C', 'D', 'E']),
    entregador_cnh_validade: z.string().date(),
    entregador_veiculo_tipo: z.enum(['MOTO', 'CARRO', 'BICICLETA', 'A_PE']),
    entregador_veiculo_placa: z.string().max(8).optional(),
  })
  .refine(
    (data) => {
      const requerPlaca = ['MOTO', 'CARRO'].includes(data.entregador_veiculo_tipo);
      return !requerPlaca || (data.entregador_veiculo_placa && data.entregador_veiculo_placa.length > 0);
    },
    { message: 'Placa é obrigatória para veículos motorizados', path: ['entregador_veiculo_placa'] }
  );

export const loginSchema = z.object({
  user_email: z.string().email().toLowerCase(),
  user_password: z.string().min(1),
});
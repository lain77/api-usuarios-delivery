import { InfisicalSDK } from '@infisical/sdk';
import dotenv from 'dotenv';

dotenv.config();

// Credenciais pra acessar o cofre vêm do ambiente (não são segredos da aplicação,
// são a chave de entrada pro Infisical)
const infisicalRequired = ['INFISICAL_CLIENT_ID', 'INFISICAL_CLIENT_SECRET', 'INFISICAL_PROJECT_ID'];
const missingInfisical = infisicalRequired.filter((key) => !process.env[key]);

if (missingInfisical.length > 0) {
  console.error(`Credenciais do Infisical ausentes: ${missingInfisical.join(', ')}`);
  process.exit(1);
}

// Autentica no Infisical
const client = new InfisicalSDK({
  siteUrl: 'https://app.infisical.com',
});

await client.auth().universalAuth.login({
  clientId: process.env.INFISICAL_CLIENT_ID,
  clientSecret: process.env.INFISICAL_CLIENT_SECRET,
});

// Busca todos os segredos do projeto
const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

const response = await client.secrets().listSecrets({
  projectId: process.env.INFISICAL_PROJECT_ID,
  environment,
});

const getSecret = (key) => response.secrets.find((s) => s.secretKey === key)?.secretValue;

// Valida segredos críticos
const requiredSecrets = ['DATABASE_URL', 'JWT_SECRET', 'RABBITMQ_URL'];
const missingSecrets = requiredSecrets.filter((key) => !getSecret(key));

if (missingSecrets.length > 0) {
  console.error(`Segredos obrigatórios ausentes no Infisical: ${missingSecrets.join(', ')}`);
  process.exit(1);
}

// Injeta DATABASE_URL no process.env porque o Prisma lê dali diretamente
process.env.DATABASE_URL = getSecret('DATABASE_URL');

export const env = {
  port: Number(process.env.PORT) || 9525,
  jwtSecret: getSecret('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
  databaseUrl: getSecret('DATABASE_URL'),
  rabbitmqUrl: getSecret('RABBITMQ_URL'),
  nodeEnv: process.env.NODE_ENV || 'development',
};

console.log('Segredos carregados do Infisical');

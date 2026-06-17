import dotenv from 'dotenv';

// Em dev local, o `infisical run` já injeta os segredos no ambiente.
// dotenv.config() só serve de fallback caso alguém rode sem a CLI.
dotenv.config();

// A CLI do Infisical (infisical run) injeta os segredos do cofre como
// variáveis de ambiente antes do Node iniciar. Aqui apenas lemos delas.
const requiredSecrets = ['DATABASE_URL', 'JWT_SECRET', 'RABBITMQ_URL'];
const missingSecrets = requiredSecrets.filter((key) => !process.env[key]);

if (missingSecrets.length > 0) {
  console.error(
    `Segredos obrigatórios ausentes no ambiente: ${missingSecrets.join(', ')}.\n` +
      'Verifique se o microsserviço está sendo executado via "infisical run" ' +
      'e se a Machine Identity tem acesso (role Viewer) ao ambiente correto.'
  );
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT) || 9525,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
  databaseUrl: process.env.DATABASE_URL,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
};

console.log('Segredos carregados do ambiente (injetados pela CLI do Infisical)');

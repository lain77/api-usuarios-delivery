import amqp from 'amqplib';
import { env } from '../config/env.js';

const EXCHANGE_NAME = 'delivery.eventos';
const EXCHANGE_TYPE = 'topic';

let connection = null;
let channel = null;

export async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(env.rabbitmqUrl);
    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });

    connection.on('error', (err) => {
      console.error('Erro na conexão RabbitMQ:', err.message);
    });

    connection.on('close', () => {
      console.warn('Conexão RabbitMQ encerrada');
      channel = null;
      connection = null;
    });

    console.log(`Conectado ao RabbitMQ, exchange "${EXCHANGE_NAME}" pronto`);
  } catch (err) {
    console.error('Falha ao conectar no RabbitMQ:', err.message);
    throw err;
  }
}

export function publish(routingKey, payload) {
  if (!channel) {
    console.warn(`Mensagem descartada (canal indisponível): ${routingKey}`);
    return false;
  }

  const message = Buffer.from(JSON.stringify(payload));

  return channel.publish(EXCHANGE_NAME, routingKey, message, {
    persistent: true,
    contentType: 'application/json',
    timestamp: Date.now(),
  });
}

export async function disconnectRabbitMQ() {
  if (channel) await channel.close();
  if (connection) await connection.close();
}
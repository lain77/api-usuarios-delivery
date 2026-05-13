import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

export async function hashPassword(plainText) {
  return bcrypt.hash(plainText, env.bcryptRounds);
}

export async function verifyPassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}
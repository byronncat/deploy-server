import bcrypt from 'bcrypt';
import { escapeRegExp } from '@utilities';

async function hash(password: string): Promise<string> {
  password = escapeRegExp(password);
  const salt = await generateSalt();
  return await bcrypt.hash(password, salt);
}

async function compare(
  password: string,
  hashPassword: string,
): Promise<boolean> {
  password = escapeRegExp(password);
  return await bcrypt.compare(password, hashPassword);
}

async function generateSalt(): Promise<string> {
  const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
  return await bcrypt.genSalt(saltRounds);
}

export const passwordHelper = {
  hash,
  compare,
  generateSalt,
};

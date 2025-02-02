import crypto from 'crypto';

export function escapeRegExp(string: string) {
  return JSON.stringify(string).slice(1, -1);
}

export function generateRandomString(
  length: number,
  type: 'hex' | 'base64' = 'hex',
) {
  return crypto.randomBytes(length).toString(type);
}

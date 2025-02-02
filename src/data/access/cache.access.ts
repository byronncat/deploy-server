import Redis from '../database/Redis.database';

export async function get(sessionId: string) {
  return await Redis.get(`bygram:${sessionId}`);
}

export async function remove(sessionId: string) {
  return await Redis.del(`bygram:${sessionId}`);
}

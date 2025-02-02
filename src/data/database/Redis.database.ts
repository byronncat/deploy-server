import { createClient } from 'redis';
import { logger } from '../../utilities';

const client = createClient({
  url: process.env.REDIS_URI,
});

client.on('connect', () => logger.success('Database connected', 'Redis'));
client.on('error', (error: unknown) => logger.error(error as string, 'Redis'));

(async () => await client.connect())();

export default client;

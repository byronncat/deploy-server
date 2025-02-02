import mongoose from 'mongoose';
import { logger } from '../../utilities';

(async () =>
  await mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
      logger.success('Database connected', 'MongoDB');
    })
    .catch((error: any) => {
      logger.error(`${error}`, 'MongoDB');
    }))();

import { LOGIN_RESULT, REGISTER_RESULT } from '@constants';
import type { User } from './entity';

export type UserToken = Pick<User, 'id' | 'username' | 'email'>;

export type LoginMessage = `${LOGIN_RESULT}`;
export type RegisterMessage = `${REGISTER_RESULT}`;

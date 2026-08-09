import { hash, compare } from 'bcrypt';

export const bcryptAdapter = {
  hash: (password: string) => hash(password, 10),

  compare: (password: string, hashed: string) => compare(password, hashed),
};

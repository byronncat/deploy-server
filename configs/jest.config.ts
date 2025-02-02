import type { JestConfigWithTsJest } from 'ts-jest';
import { compilerOptions } from '../tsconfig.json';

const paths = compilerOptions.paths as { [key: string]: string[] };

const moduleNameMapper = Object.keys(paths).reduce((acc, key) => {
  const name = key.replace('/*', '/(.*)$');
  const value = `<rootDir>/${paths[key][0].replace('/*', '/$1')}`;
  return {
    ...acc,
    [name]: value,
  };
}, {});

const config: JestConfigWithTsJest = {
  rootDir: '../',
  moduleNameMapper,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!**/index.ts',
    '!src/**/{constants,libraries,database}/**',
    '!src/settings.ts',
  ],
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
};

export default config;

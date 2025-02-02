import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  
dotenv.config();
const root = path.resolve(__dirname, '..');
  
const config = {
  target: 'node',
  entry: path.resolve(root, 'src/index.ts'),
  resolve: {
    extensions: ['.ts', '.js', '.html'],
    alias: {
      // "paths": {
      //   "@/*": ["src/*"],
      //   "@constants": ["src/constants/index.ts"],
      //   "@data": ["src/data/index.ts"],
      //   "@helpers": ["src/helpers/index.ts"],
      //   "@libraries": ["src/libraries/index.ts"],
      //   "@middlewares": ["src/middlewares/index.ts"],
      //   "@controllers": ["src/controllers/index.ts"],
      //   "@services": ["src/services/index.ts"],
      //   "@types": ["src/types/index.d.ts"],
      //   "@utilities": ["src/utilities/index.ts"]
      // }
      '@': path.resolve(root, 'src'),
      '@constants': path.resolve(root, 'src/constants/index.ts'),
      '@data': path.resolve(root, 'src/data/index.ts'),
      '@helpers': path.resolve(root, 'src/helpers/index.ts'),
      '@libraries': path.resolve(root, 'src/libraries/index.ts'),
      '@middlewares': path.resolve(root, 'src/middlewares/index.ts'),
      '@controllers': path.resolve(root, 'src/controllers/index.ts'),
      '@services': path.resolve(root, 'src/services/index.ts'),
      '@types': path.resolve(root, 'src/types/index.d.ts'),
      '@utilities': path.resolve(root, 'src/utilities/index.ts'),
    },
  },
  externals: [
    'bcrypt',
    /^[a-z][a-z\/\.\-0-9]*$/i
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(root, 'dist'),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: 'inline-source-map',
  mode:
    process.env.NODE_ENV ||
    'development',
};

  export default config;

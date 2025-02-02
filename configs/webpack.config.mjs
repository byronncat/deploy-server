import webpack from 'webpack';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const root = path.resolve(__dirname, '..');

const config = {
  target: 'node',
  entry: path.resolve(root, 'src/index.ts'),
  resolve: {
    extensions: ['.ts', '.js', '.html'],
    alias: {
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
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
  mode: process.env.NODE_ENV || 'development',
};

export default config;

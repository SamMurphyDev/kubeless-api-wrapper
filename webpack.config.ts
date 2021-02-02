/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'development' ?? 'production',
  entry: slsw.lib.entries,
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts'],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '.webpack'),
    libraryTarget: 'commonjs',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;

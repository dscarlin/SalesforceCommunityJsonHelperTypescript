const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './InitializingScripts/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'Scripts/bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    minimizer: [
      new TerserPlugin()
    ],
  },
};


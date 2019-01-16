const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
	test: /\.css$/,
	use: ['style-loader', 'css-loader']
      },
      {
	test: /\.png$/,
	use: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  watchOptions: {
    poll: 1000,
    ignored: ['/node_modules/']
  }
};


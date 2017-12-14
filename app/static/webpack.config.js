const path = require('path');

module.exports = {
  entry: './js/main/chartviews.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, // 这里面的不解析
        loader: 'babel-loader',
        query: {
            presets: ['react', 'es2015'],
            compact: false
        }
    }]
  }
};

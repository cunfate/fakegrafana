const path = require('path');

module.exports = {
  entry: './js/main/chartviews.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    loaders: [{
      loaders: ['babel-loader?presets[]=es2015,presets[]=react']
    }]
  }
};

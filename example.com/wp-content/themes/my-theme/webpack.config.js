var webpack = require('webpack'),
path = require('path');

var srcPath  = path.join(__dirname, '/src/js'),
distPath = path.join(__dirname, '/assets/js');


module.exports = {

  context: srcPath,
  module: {

    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ 'babel-preset-env' ]
            }
          }
        }
      ]
    },
    entry: {
      app: ['./app.js'],
    },
    output: {
      path: distPath,
      filename: '[name].bundle.js',
    },
    externals: {
      jquery: 'jQuery'
    }
  };

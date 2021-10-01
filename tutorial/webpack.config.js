const path = require('path'); // using the old way of importing modules - you have to

module.exports = {
  entry: './src/index.js', // entry point, which imports all other modules. webpack starts from this file when running the build process
  output: {
    filename: 'bundle.js',
    // path: './dist' // webpack auto creates this if it doesn't exist. this needs to be an absolute path, like below.
    path: path.resolve(__dirname, './dist') // a library which creates an absolute path
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/, 
        type: 'asset/resource' // either type or use, asset modules require the type property.
      }
    ]
  }
}
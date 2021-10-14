const path = require('path'); // using the old way of importing modules - you have to

module.exports = {
  entry: './src/index.js', // entry point, which imports all other modules. webpack starts from this file when running the build process
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'), // a library which creates an absolute path
    publicPath: 'dist/'
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/, 
        type: 'asset', // either type or use, asset modules require the type property.
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024 // 3kb
          }
        }
      },
      {
        test: /\.txt/,
        type: 'asset/source'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader'
        ]
      }
    ]
  }
}
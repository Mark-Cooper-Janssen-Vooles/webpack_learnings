# Webpack 5: The Complete Guide for Beginners 

- Why do we need webpack? / Intro
- Asset Modules
- Loaders
- Plugins
- Production vs Development builds
- Multiple page applications
- Github repository
- Webpack Integration with Node and Express
- Module Federation
- Integration with jQuery
- Using ESLint
- Summary


===


## Why do we need webpack? / Intro


- webpack is a static module bundler for js applications. when webpack bundles your app, it recursively builds a dependency graph and includes every module in your application, and then packages all of these modules into one or more bundles.

- Life without webpack
  - back in the day we had a html which loaded in javascript files, but we might've had 11+ 
  - "grunt" and "gulp" came along which combined all these js files into one, but they couldn't manage dependencies
  - we used 'require js' to manage dependencies 
- when using webpack, you'll most likely only have one js file and maybe one cs file. no hidden dependencies, and no need to worry about the order of the js files in the html doc anymore. 
- webpack manages all of your code in one place 
  - An example would be using a function from hell-world.js in index.js => here you need to make sure hello-world.js is imported into the html before index.js, or that function will be undefined. 


Tutorial (in tutorial file):
- uses `npm install webpack and webpack-cli --save-dev`
  - webpack-cli allows you to run webpack commands from the terminal
- removes import from html file for 'hello-world.js', now we'll need to explicitly import our JS files into other JS files for them to work.
  - this requires:
    - exporting the function in hell-world.js
    - importing the function in index.js 
    - running `npx webpack` in the terminal. This runs webpack without any config at all (webpack 4 and 5 has a default one, but its better to have a custom one)
    - this creates a dist folder and inside main.js
    - if you run `npx webpack --stats detailed` it provides more info about the build process

- custom webpack configuration:
  - creates in the root folder named `webpack.config.js`
  - creates a very similar one to the default one - the most basic ones only so far:
  ````js
  const path = require('path'); // using the old way of importing modules - you have to

  module.exports = {
    entry: './src/index.js', // entry point, which imports all other modules. webpack starts from this file when running the build process
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, './dist') // a library which creates an absolute path
    },
    mode: 'none'
  }
  ````
- we need to change the index.html file to look for ./dist/bundle.js instead now, then refresh the browser and it works.
- to run webpack more conveniently, we can create a script in package.json:
  - `"build": "webpack"`


===


## Asset Modules


- webpack allows you to import lots of different stuff into your JS code 
- webpack provides asset modules and loaders 
- asset modules is new, introduced in webpack 5 
  - allows you to use asset files in your JS app without installing additional libraries
  - need to make changes in webpack config files
  - images, fonts, plaintext files etc. can be processed using asset modules 


4 types of asset modules 
- asset/resource: emits file into output directory (i.e. dist), exports url to that file
  - used to import large images or font files 
- asset/inline: inlines a file into the bundle as a data URI 
  - used to import small asset files like SVGs
  - doesn't generate new file into the output file 
- asset: a combo of the previous two - webpack will auto choose between resource or inline
  - if file is less than 8kb, treated as inline. if more, its resource. can change 8kb to whatever you want. 
- asset/source: imports source code of the file as it is, injects it into JS bundle as a string of text


#### Handling images with webpack


asset/resource module type 
- lets import an image into JS code (webpack allows this)
- creates add-image.js, exports and imports into index.js 
- webpack doesn't know how to add this image:
  - in webpack.config.js add:
  ````js
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/, 
        type: 'asset/resource' // either type or use, asset modules require the type property.
      }
    ]
  }
  ````
  - webpack sees that it needs to `import Apples from './apples.jpg';`, it asks itself:
    - do I know how to import this by default? it can for js or json files, not for .jpg
    - it doesn't for .jpg files, so it looks at webpack rules. 
    - if there is a rule applicable to jpg files, then it checks the type i.e. 'asset/resource' in this case. 


===


## Loaders


===


## Plugins


===


## Production vs Development builds


===


## Multiple page applications


===


## Github repository


===


## Webpack Integration with Node and Express


===


## Module Federation


===


## Integration with jQuery


===


## Using ESLint


===


## Summary

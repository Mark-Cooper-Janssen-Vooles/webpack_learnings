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


#### asset/resource module type: Handling images with webpack 


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


#### publicPath (config option)


- tells webpack which url to use to load all the generated files in the browser 
  - i.e. static files liek images, you can tell the browser where those static files should be taken from
- starting from webpack version 5 you don't need to worry about this option much anymore 
- only worry about publicPath if your repo isn't that simple
- by default webpack 5 ssets public path to `options: { publicPath: 'auto' }`
- you can also use a relative class like `'/dist'`
- there are some cases were pubicPath should be specified explicitly:
  - Serving static files from cdn
  - serving static files from express and using special url prefix to serve static files 
  - when you use module configuration feature
- if we deploy static files to CDN:
  - publicPath would need to be 'http://some-cdn.com/' (or different local dev vs prod)


#### asset/inline module type

- inlines a file into the bundle as a data uri
  - doesn't generate new file in output directory
- used when importing small asset files (svgs)
- not good for large files, can make JS file bundle much bigger. 
  - i.e. the image we use is 197kb. With inline our asset bundle.js is 267kb. With resource its 4.7kb.  
- asset/inline can be better than asset/resource:
  - when using asset/resource, webpack generates a seperate file for every image you're using. it makes seperate http request for every image you display. if there are 20 images, browser makes 20 additional http requests to display them all.
  - if they are huge, it makes sense to use asset/resource
  - if you're using small icon svgs, it makes sense to use asset/inline and not make the http requests. 


#### General asset module type 

- a combination of inline and resource. 
- set using type `asset` instead of `asset/resource` or `asset/inline`
- webpack makes the decision for you if its resource or inline. greater than 8kb, its resource, less than and its inline.
- you can change the 8kb threshhold using the parser/dataUrlCondition/maxSize property: 
  ````js
    rules: [
    {
      test: /\.(png|jpg)$/, 
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 3 * 1024 // 3kb
        }
      }
    }
  ````


#### Asset/source module type 


- reads the contents of the file into a javascript string and injects that string into the js bundle without any modifications
- doesn't generate any file in the output directory 
- example:
  - moved in-line altText to its own .txt file 
  - imported it into the add-image.js (where its used)
  - added to the webpack config file: (we need a rule to teach webpack how to import txt files)
  ````js
    rules: [
      {
        test: /\.txt/,
        type: 'asset/source' // this tells webpack when we import a .txt it reads it as asset/source
      }
    ]
  ````


===


## Loaders


#### What is webpack loader?

- webpack allows you to import lots of different stuff in your code
- possible because of features webpack provides 
  - asset modules allow you to import images, fonts, plain text files
  - loads allow you to import all other types of files that you can't import with asset modules
- webpack designed to import all your dependencies into one or more files 
  - dependencies are other javascript modules your main js requires to do its job 
  - can import SASS, CSS etc 
- loaders are javascript librarys which help us import all the above stuff 



#### Handling CSS with webpack 


- we can import CSS right into our JS code 
- once we have a .js file using css and we create and import the css file, we need to teach webpack how to understand it
  - we create a new rule in webpack config
  - it affects all css files 
  - asset modules uses "type", but we use "use" for this one
  - we specify one or more loaders that will be used for our css files 
  - every time it tries to import a css file, it uses both `css-loader` and `style-loader `
    - css loader: reads contents of css and returns contents
    - style-loader: takes css and injects it into page using style tags 
    - style-loader bundles css into js bundle.js file 
    - we can specify to make seperate files if we want 
  - when we used asset modues, we didn't need to install additional npm files because webpack includes asset modules out of the box 
  - when using loaders we need to install them explicitly (they're all npm packages we need to add )
  - `npm install css-loader style-loader --save-dev`
  ````js
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader'
        ]
      }
    ]
  }
  ````
  - when you npm build you can see in the dev tools, elements, the head tag has a style tag 

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

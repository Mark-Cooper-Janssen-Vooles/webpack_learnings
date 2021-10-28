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


#### Handling SASS


- change css file into .scss
- change import in js 
- add rule to webpack config: 
  ````js
  {
    test: /\.scss$/,
    use: [
      'style-loader', 'css-loader', 'sass-loader'
    ]
  }
  ````
- note the order of loaders is important, webpack handles the order from right to left
  - first it invokes sass-loader which converts sass to css 
  - then it invokes css-loader which reads the contents into the js representation
  - then style-loader which injects it into page with style tag
- need to `npm install sass-loader sass --save-dev`


#### Using latest JavaScript features with Babel


- import other javascript files inside our javascript files
  - we don't need an additional loader for this 
- javascript language is based on acma script specification (new versions come out)
  - browsers can be slow to implement these, we want to use them straight away, what do we do?
  - tools can convert modern js code into older js code which is already supported by browers 
  - the most popular js compiler is 'babel', which we will use 
- need to create a new rule applicable to all js files except those in node_modules folder
  ````js
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/env' ],
            plugins: [ '@babel/plugin-proposal-class-properties' ]
          }
        }
      }
    ]
  }
  ````
  - we can specify extra options for any webpack loader, but the loader needs to support them
  - first option is presets, `@babel/env` supports the latest javascript language updates
  - second option is plugins. for this example we use `'@babel/plugin-proposal-class-properties'`
  - `npm install @babel/core babel-loader @babel/preset-env @babel/plugin-proposal-class-properties --save-dev`


- now when you run webpack it will use babel loader to import js files and cutting edge features will work on older browsers.


===


## Plugins


#### What is Webpack Plugin?


- Plugins are additional javascript libraries that do everything that loaders cannot do 
- We use loaders when we want to import different files (css loaders, xml loaders)
- if you want to import something else? With plugins you can do more
  - you can define global constants in whole app
  - you can minifiy entire bundle so its smaller + faster
  - you can generate other files besides bundle.js 


#### Minification of the resulting webpack bundle 

- bundle without minification is 19.5kb 
- add new section to webpack.config.js called 'plugins' (lives at the same level as modules)
````js
const TerserPlugin = require('terser-webpack-plugin');

// inside module.exports: 
  plugins: [
    new TerserPlugin()
  ]
````
- need to install and import these plugins too 
  - `npm install terser-webpack-plugin --save-dev` note: webpack 5 comes with this out of the box. 
- bundle now is only 5.25kb! 
- using TereserPlugin is the new way of minifiying js bundles. EArlier it was using uglify, but terserPlugin is recommended now. 


#### Extracting CSS into a separate bundle with mini-css-extract-plugin 


- Extracts CSS into a seperate file
- bundling styles together with javascript code inside a single bundle.js is not good practice
- our bundle file will become too big, and big files need more time to load 
- we will extract css into seperate file generated along js bundle, why? 
  - js bundle will be smaller, so faster to download 
  - we can load several files in parrallel 


- add new plugin to webpack.config.js:
````js
  plugins: [
    new TerserPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    })
  ]
````
- change the rules for css and scss: 
  - replace `'style-loader'` with `miniCssExtractPlugin.loader`:
  ````js
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader, 'css-loader'
    ]
  },
  {
    test: /\.scss$/,
    use: [
      MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
    ]
  }, 
  ````
  - import at the top of the webpack.config.js and `npm install mini-css-extract-plugin --save-dev`
  - run `npm run build`
  - now need to include this file at the top of the index.html 


#### Browser Caching 


- webpack can help us with browser caching
- every time a browser loads a website, it downloads all the assets to load it
- some websites require lots of javascript, and with every reload the browser downloads all the files from the internet
  - can be an issue with slow internet, mobile devices etc
- solution is browser caching. if the file doesn't change between reloads, the browser can save it and not download it. it goes to the cache
- may lead to issues, i.e. if you fix a bug and the js file has changed 
  - we need a mechanism for updating the cache, i.e. creating a new file with a new name each time you make a change 
  - if the name changes, browsers will download the new version. 
  - we don't need to change our file name manually, webpack can do this. 
  - we can add md5 hash to the name of the file 
- to get this to work, just add [contenthash] to the filename:
````js
  output: {
    filename: 'bundle.[contenthash].js', // this is the change
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/'
  },
````
- this generates `bundle.<random characters>.js`, and the random characters stay the same as long as there is no js content change.
- to have the css do the same thing, add [contenthash] to the plugins MiniCssExtractPlugin (the plugin responsible for generating the seperate css file):
````js
  plugins: [
    new TerserPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css', // this is the change
    })
  ]
````


#### How to Clean Dist Folder before generating new bundles 


- webpack has a plugin for this called 'clean-webpack-plugin'
- every time you run a new build, webpack will removes the files from the output path folder 
- need to `npm install clean-webpack-plugin --save-dev`
- need to import in webpack.config.js: `const { CealnWebpackPlugin } = require('clean-webpack-plugin');`
- need to add to plugins:
````js
  plugins: [
    new TerserPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new CleanWebpackPlugin(),
  ]
````

- this plugin can also clean non-output path folders:
````js
  plugins: [
    new TerserPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        // all patterns related to webpack output directory (in our case the dist folder)
        '**/*', // removes all files and subfolders in dist folder 
        path.join(process.cwd(), 'build/**/*') // removes all files and subfolders in the build folder 
      ]
    }),
  ]
````


#### Generating HTML files automatically during webpack build process


- we updated the bundle and styles name using the md6 hash with [contenthash], but nothing happened to our html file - which looks for just `bundle.js`: so now it will be broken 
- to fix this, we need to change the references in index.html - but this is a manual process
- webpack has a special plugin that updates the names of the references, it can even create the whole html file for us:
  - `npm install html-webpack-plugin --save-dev`
````js
const HtmlWebpackPlugin = require('html-webpack-plugin')


  },
  plugins: [
    new TerserPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin()
  ]
````
- run `npm run build` and see it has generated an index.html
- might need to set the publicPath to an empty string in webpack.config now, as the bundles will be in the same folder as the html file 
- we can delete the index.html file in the root now - we don't need it


#### Customising Generated HTML files


- adding the htmlWebpackPlugin changed the generated html file, earlier the page title was 'hello world' and now its 'webpack app'.
- to get our title back, in webpack.config can do some options like so:
````js
    new HtmlWebpackPlugin({
      title: 'Hello world',
      filename: 'subfolder/custom_filename.html',
      meta: {
        description: 'Some description'
      }
    })
````
- there are more options listed on the github page of the plugin. https://github.com/jantimon/html-webpack-plugin/
- you can even provide your own template for the html file to fully customise how it looks


#### Fully customised html with template: Integration with Handlebars 


- various template options here, we're using handlebars: https://github.com/jantimon/html-webpack-plugin/blob/main/docs/template-option.md
- handlebars is a template engine for js, allowing you to seperate business logic from presentation
- steps:
  - create an index.hbs file in src, need to include variables like so:
  ````html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>{{htmlWebpackPlugin.options.title}}</title>
      <meta name="description" content="{{htmlWebpackPlugin.options.description}}">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
    </body>
  </html>
  ````
  - note: do not include bundle or css file, they will be added by webpack
  - add template option to webpack config and include variables at the same level:
  ````js
      new HtmlWebpackPlugin({
      template: 'src/index.hbs',
      title: 'Hello world',
      description: 'Some description'
    })
  ````
  - create a new rule for .hbs files so webpack knows what to do with it:
  ````js
      {
        test: /\.hbs$/,
        use: [
          'handlebars-loader'
        ]
      }
  ````
  - `npm install handlebars-loader --save-dev` && `npm install handlebars --save-dev`


#### More Webpack Plugins 


- there is a huge list of plugins here: https://webpack.js.org/plugins/


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

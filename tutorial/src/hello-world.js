import HelloWorldButton from './components/hello-world-button/hello-world-button.js';
import Heading from './components/heading/heading.js';
import React from 'react';

const heading = new Heading;
heading.render('hello world');
const button = new HelloWorldButton();
button.render();

if (process.env.NODE_ENV === 'production') {
  console.log('production mode')
} else if (process.env.NODE_ENV === 'development') {
  console.log('development mode')
}
import Heading from './components/heading/heading';
import ApplesImage from './components/apple-image/apples-image';
import React from 'react';

const heading = new Heading();
heading.render('apples');

const applesImage = new ApplesImage();
applesImage.render();
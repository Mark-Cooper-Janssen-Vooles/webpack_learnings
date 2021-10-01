import Apples from './apples.jpg';

const addImage = () => {
  const img = document.createElement('img');
  img.alt = 'Apple';
  img.width = 300;
  img.src = Apples;
  const body = document.querySelector('body');
  body.appendChild(img);
}

export default addImage();
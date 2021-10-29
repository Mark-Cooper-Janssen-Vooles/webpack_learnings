import Apples from './apples.jpg';
import './apples-image.scss';

class ApplesImage {
  render() {
    const img = document.createElement('img');
    img.src = Apples;
    img.alt = 'Apples';
    img.classList.add('apples-image');

    const bodyDomElement = document.querySelector('body');
    bodyDomElement.appendChild(img);
  }
}

export default ApplesImage;
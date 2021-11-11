import './hello-world-button.scss';

class HelloWorldButton {
  buttonCssClass = 'hello-world-button'; // most browsers don't yet support properties on classes

  render() {
    const button = document.createElement('button');
    button.innerHTML = 'Hello world';
    button.classList.add(this.buttonCssClass);
    const body = document.querySelector('body');
    button.onclick = () => {
      const p = document.createElement('p');
      p.innerHTML = 'Hello world';
      p.classList.add('hello-world-text');
      body.appendChild(p)
    }
    body.appendChild(button);
  }
}

export default HelloWorldButton;
import { createApp } from '@jaredtbrown/dulo'

const app = (props) => {
  const { greetings } = props;
  const h1 = document.createElement('h1');
  h1.appendChild(document.createTextNode(greetings));

  return h1;
}

createApp({
  name: 'app',
  component: app,
})
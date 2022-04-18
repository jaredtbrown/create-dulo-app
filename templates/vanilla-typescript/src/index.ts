import { createApp } from '@jaredtbrown/dulo'

interface Props {
  greetings: string
}

createApp({
  name: 'app',
  component: (props: Props) => {
    const { greetings } = props;
    const h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(greetings));
    return h1;
  }
})
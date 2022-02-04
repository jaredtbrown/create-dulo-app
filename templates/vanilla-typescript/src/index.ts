// Type definitions needed for global functions
export {}
declare global {
  interface Window {
    renderApp: (rootElementId: string, props: Args) => void;
  }
}

interface Args {
  greetings: string
}

window.renderApp = (rootElementId: string, args: Args) => {
  const element = document.getElementById(rootElementId);
  const { greetings } = args;
  const h1 = document.createElement('h1');
  h1.appendChild(document.createTextNode(greetings));
  element.appendChild(h1);
}
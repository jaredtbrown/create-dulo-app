window.renderApp = (rootElementId, args) => {
  const element = document.getElementById(rootElementId);
  const { greetings } = args;
  const h1 = document.createElement('h1');
  h1.appendChild(document.createTextNode(greetings));
  element.appendChild(h1);
}
import ReactDOM from 'react-dom';
import App, { AppProps } from './App';

declare global {
  interface Window {
    renderApp: (rootElementId: string, props: AppProps) => void;
  }
}

window.renderApp = (rootElementId: string, props: AppProps) => {
  ReactDOM.render(<App {...props} />, document.getElementById(rootElementId));
}
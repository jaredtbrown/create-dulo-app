import ReactDOM from 'react-dom';
import App from './App';

window.renderApp = (rootElementId, props) => {
  ReactDOM.render(<App {...props} />, document.getElementById(rootElementId));
}
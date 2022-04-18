import { createReactApp } from '@jaredtbrown/dulo';

import App from './App';

createReactApp({
  name: 'app',
  component: (props) => <App {...props} />
})
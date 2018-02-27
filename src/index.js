// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reauthenticateLastUser from './reauthenticate';
import mobileFixes from './mobile-fixes';

reauthenticateLastUser();
const rootEl = document.getElementById('root')
if (!(rootEl instanceof Element)) {
  throw new Error('invalid type')
}
ReactDOM.render(<App />, rootEl)
if (global.location.protocol === 'https:') registerServiceWorker();
mobileFixes();

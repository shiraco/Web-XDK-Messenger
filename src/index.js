import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reauthenticateLastUser from './reauthenticate';
import mobileFixes from './mobile-fixes';

reauthenticateLastUser();
ReactDOM.render(<App />, document.getElementById('root'));
if (global.location.protocol === 'https:') registerServiceWorker();
mobileFixes();


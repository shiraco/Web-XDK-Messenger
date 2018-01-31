import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/layout.css';
import './css/dialog.css';
import './css/announcements.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { layerClient } from './get-layer';

try {
  throw new Error("FRELL");
} catch (e) {}

function reauthenticateLastUser() {
  // If we have a recent user who checked the isTrustedDevice checkbox then immediately authenticate as that user
  // and flag the client as isTrustedDevice.
  var lastUserId = localStorage.getItem('layer-sample-app-last-user');
  if (lastUserId) {
    layerClient.isTrustedDevice = true;
    layerClient.connect(lastUserId);
  }

  // Afte authentication, see if the Login page has changed isTrustedDevice, and update our cached last-user id accordingly
  layerClient.on('ready', function() {
    if (layerClient.isTrustedDevice) {
      localStorage.setItem('layer-sample-app-last-user', layerClient.user.userId);
    } else {
      localStorage.removeItem('layer-sample-app-last-user');
    }
  });
}

reauthenticateLastUser();
ReactDOM.render(<App />, document.getElementById('root'));
if (global.location.protocol === 'https:') registerServiceWorker();


// Mobile browser hack to prevent the location bar from covering part of the UI, and causing the entire UI to scroll up/down
// on occasion
const isMobile = navigator.userAgent.match(/android/i) || navigator.platform === 'iPhone' || navigator.platform === 'iPad';
if (isMobile) {
  function onResize() {
    document.body.style.height = window.innerHeight + 'px';
  }
  window.addEventListener('resize', onResize);
  setTimeout(onResize, 10);
}

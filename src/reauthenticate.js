// @flow
import { layerClient } from './get-layer';

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

export default reauthenticateLastUser;

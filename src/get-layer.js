import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';

import layerConfig from './LayerConfiguration.json';

import Layer from '@layerhq/web-xdk';
import '@layerhq/web-xdk/ui/adapters/react';
import '@layerhq/web-xdk/ui/messages/status/layer-status-message-view';
import '@layerhq/web-xdk/ui/messages/receipt/layer-receipt-message-view';
import '@layerhq/web-xdk/ui/messages/choice/layer-choice-message-view';
import '@layerhq/web-xdk/ui/messages/carousel/layer-carousel-message-view';
import '@layerhq/web-xdk/ui/messages/buttons/layer-buttons-message-view';
import '@layerhq/web-xdk/ui/messages/file/layer-file-message-view';
import '@layerhq/web-xdk/ui/messages/location/layer-location-message-view';
import '@layerhq/web-xdk/ui/messages/product/layer-product-message-view';
import '@layerhq/web-xdk/ui/messages/feedback/layer-feedback-message-view';
import '@layerhq/web-xdk/ui/components/layer-send-button';
import '@layerhq/web-xdk/ui/components/layer-file-upload-button';
import '@layerhq/web-xdk/ui/components/layer-notifier';
import '@layerhq/web-xdk/ui/components/layer-conversation-list';
import '@layerhq/web-xdk/ui/components/layer-identity-list';


// initialize Layer Client with your appID
const layerClient = Layer.init({
  appId: layerConfig[0].app_id,
})

const LayerReactComponents = Layer.UI.adapters.react(React, ReactDom)

export { LayerReactComponents };
export { Layer };
export { layerClient }
export default { Layer, LayerReactComponents, layerClient };
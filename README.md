# Setup

Before you install and run any of the sample apps provided in this repo, you will need to setup your [Configuration file](./src/LayerConfiguration.json) with your Layer appID and the URL to your Identity Provider (authenticator) server.

This JSON file contains an array of at least one:

* `app_id`: Go to [The Developer Dashboard](https://dashboard.layer.com), select your Application, and select `Keys` in the table of contents on the left.  You should see your Application ID.
* `identity_provider_url`: If you are using the Layer Sample Identity server deployed to your server or your Heroku account, enter the url to that server here.  Note that if you are using your own custom identity service (recommended once you are no longer working on demos), you will need to replace your client's authentication code, and this configuration file is no longer needed.
* `name`: Support for this field will be added eventually to let you select between different configurations when logging in.

```json
[{
  "app_id": "layer:///apps/staging/f34bdf52-fd26-11e6-9f75-336a5aaaaaaa",
  "identity_provider_url": "https://layer-quickstart-frodo-the-dodo.herokuapp.com"
  "name": "Staging Demo"
}]
```

## Run flow

1. `npm run flow` or `yarn flow`

## Running the Demo

1. `npm install` OR `yarn install`
2. `npm start` OR `yarn start`


## Deploying the Demo

To deploy this demo onto a web server that is not running on localhost, its worth noting that this project
is created using `react-scripts`, which has extensive instructions at [React Scripts Docs](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).

For a quick deploy:

1. `npm run build`
2. Deploy the `build` folder to your server

However, note that if this app is **not** running at the root path of your web server, you will need the following changes:

1. Add an entry to your `package.json` file: `"homepage": "http://myco.com/mypath/toapp"`
2. Edit your `App.js` file and update the `<BrowserRouter/>` to: `<BrowserRouter basename={'/mypath/toapp'}>`

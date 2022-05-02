
const { Headers } = require('node-fetch');
const MutationObserver = require('@sheerun/mutationobserver-shim');


global.window.app = {
  applicationName: 'my-app',
  mcApiUrl: 'http://localhost:8080',
};

window.MutationObserver = MutationObserver;
global.Headers = global.Headers || Headers;

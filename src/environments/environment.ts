// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  serverBaseURL: 'https://mstatus-api.miraclesoft.com:8000/',
  appURL: 'https://mstatus-53617.firebaseapp.com',
  firebaseConfig: {
    apiKey: 'AIzaSyDKfSM6aONWSVSFEjbFfk1kFoVJ3vE2jJI',
    authDomain: 'mstatus-53617.firebaseapp.com',
    databaseURL: 'https://mstatus-53617.firebaseio.com',
    projectId: 'mstatus-53617',
    storageBucket: 'mstatus-53617.appspot.com',
    messagingSenderId: '649508735303'
  },
  fcmAuthHeader: 'AIzaSyAaMj3mG0Aijimw-iwcs3J0xSjDgEKsjlI'
};

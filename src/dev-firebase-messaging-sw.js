// import firebase from "https://www.gstatic.com/firebasejs/5.0.4/firebase.js";
 importScripts("https://www.gstatic.com/firebasejs/5.0.4/firebase.js");


  /*var script = document.createElement("script"); //Make a script DOM node
  script.src =  "https://www.gstatic.com/firebasejs/5.0.4/firebase-app.js"; //Set it's src to the provided URL
  document.head.appendChild(script); //Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
*/
const config = {
  apiKey: "AIzaSyBsnE0QDaODaARBL89DwZwTSDG9rwgCv50",
  authDomain: "mstatus-web.firebaseapp.com",
  databaseURL: "https://mstatus-web.firebaseio.com",
  projectId: "mstatus-web",
  storageBucket: "mstatus-web.appspot.com",
  messagingSenderId: "80818730375"
};

try {
  firebase.initializeApp(config);

  firebase.messaging();
} catch (e) {
  console.log('Unable to Instantiate Firebase Messaing', e);
}


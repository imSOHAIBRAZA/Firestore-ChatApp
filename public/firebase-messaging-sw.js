// importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');



// var firebaseConfig = {
//     apiKey: "AIzaSyBc06KoJ9pPlgI03vz_ykig2iOy7XSPSCE",
//     authDomain: "refferor-79247.firebaseapp.com",
//     databaseURL: "https://refferor-79247.firebaseio.com",
//     projectId: "refferor-79247",
//     storageBucket: "refferor-79247.appspot.com",
//     messagingSenderId: "160887049132",
//     appId: "1:160887049132:web:cd4f680faa114f2eae4809"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);



// const messaging = firebase.messaging();

'use strict';

console.log('... Service Worker File Running ...');

// Listner for Push Notification
self.addEventListener('push', function (event) {
  console.log('Received a push message', event);

  var notification = event.data.json().notification
  console.log(notification)
  var title = notification.title || 'Yay a message.';
  var body = notification.body || 'We have received a push message.';
  var icon = '/images/icon-192x192.png';
  // var tag = 'simple-push-demo-notification-tag';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      // tag: tag
    })
  );

});

// on Notification Click do whatever you want...
self.addEventListener('notificationclick', function (event) {
  
  console.log('On notification click: ', event.notification);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function (clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/');
    }
  }));

});
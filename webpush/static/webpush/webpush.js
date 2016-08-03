// Based On https://github.com/chrisdavidmills/push-api-demo/blob/283df97baf49a9e67705ed08354238b83ba7e9d3/main.js

var isPushEnabled = false;
var registration;


if (webpushNeedSubscribe) {
    window.addEventListener('load', function() {
          if (isPushEnabled) {
            return unsubscribe()
          }

          // Do everything if the Browser Supports Service Worker
          if ('serviceWorker' in navigator) {
            var serviceWorker = document.getElementById('service-worker-js').src;
            navigator.serviceWorker.register(serviceWorker)
              .then(
                function(reg) {
                  console.log('Loading....');
                  registration = reg;
                  initialiseState(reg);
                }
              );
          }

          // Once the service worker is registered set the initial state
          function initialiseState(reg) {
            // Are Notifications supported in the service worker?
            if (!(reg.showNotification)) {
                // Show a message and activate the button
                console.log('Showing Notification is not suppoted in your browser');
                console.log('Subscribe to Push Messaging');
                return;
            }

            // Check the current Notification permission.
            // If its denied, it's a permanent block until the
            // user changes the permission
            if (Notification.permission === 'denied') {
              // Show a message and activate the button
              console.log('The Push Notification is blocked from your browser.');
              console.log('Subscribe to Push Messaging');
              return;
            }

            // Check if push messaging is supported
            if (!('PushManager' in window)) {
              // Show a message and activate the button
              console.log('Push Notification is not available in the browser');
              console.log('Subscribe to Push Messaging');
              return;
            }

            // We need to subscribe for push notification and send the information to server
            subscribe(reg)
          }
        }
    )
}


function subscribe(reg) {
  // Get the Subscription or register one
  getSubscription(reg)
    .then(
      function(subscription) {
        postSubscribeObj('subscribe', subscription);
      }
    )
    .catch(
      function(error) {
        console.log('error')
      }
    );
}

function getSubscription(reg) {
    return reg.pushManager.getSubscription()
      .then(
        function(subscription) {
          // Check if Subscription is available
          if (subscription) {
            return subscription;
          }
          // If not, register one
          return registration.pushManager.subscribe({ userVisibleOnly: true });
        }
      )
}

function postSubscribeObj(statusType, subscription) {
  // Send the information to the server with fetch API.
  // the type of the request, the name of the user subscribing,
  // and the push subscription endpoint + key the server needs
  // to send push messages

  var element = document.getElementById('webpush-data'),
    push_url = element.dataset.url,
    browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase(),
    data = {  status_type: statusType,
              subscription: subscription.toJSON(),
              browser: browser,
              group: element.dataset.group
           };

  fetch(push_url, {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    credentials: 'include'
  })
    .then(
      function(response) {
        // Check the information is saved successfully into server
        if ((response.status == 201) && (statusType == 'subscribe')) {
          // Show unsubscribe button instead
          console.log('Unsubscribe to Push Messaging');
          console.log('Successfully subscribed for Push Notification');
        }

        // Check if the information is deleted from server
        if ((response.status == 202) && (statusType == 'unsubscribe')) {
          // Get the Subscription
          getSubscription(registration)
            .then(
              function(subscription) {
                // Remove the subscription
                subscription.unsubscribe()
                .then(
                  function(successful) {
                    console.log('Subscribe to Push Messaging');
                    console.log('Successfully unsubscribed for Push Notification');
                  }
                )
              }
            )
            .catch(
              function(error) {
                console.log('Unsubscribe to Push Messaging');
                console.log('Error during unsubscribe from Push Notification');
              }
            );
        }
      }
    )
}

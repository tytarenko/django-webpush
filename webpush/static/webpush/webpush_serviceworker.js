self.addEventListener('push', function(event) {
  var payload = event.data ? event.data.text() : {"head": "No Content", "Body": "No Content", "url": ""},
    parsed_data = JSON.parse(payload),
    notificationTitle = parsed_data.head,
    notificationOptions = {
      body: parsed_data.body,
      data: {
        url: parsed_data.url
      }
    }
  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  let clickResponsePromise = Promise.resolve();
  console.log(event.notification)
  if (event.notification.data && event.notification.data.url) {
    clickResponsePromise = clients.openWindow(event.notification.data.url);
  }

  event.waitUntil(
    Promise.all([
      clickResponsePromise
    ])
  );
});

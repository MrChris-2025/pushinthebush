// Service Worker for Push Notifications

self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  // Parse Back4App 'alert' property or standard 'body'
  const title = data.title || 'MLB Game Alert';
  const bodyText = data.body || data.alert || 'New play update on your tracked game!';

  const options = {
    body: bodyText,
    // Use PNG/JPG icons instead of SVG for iOS compatibility
    icon: '/icon-192.png', 
    badge: '/icon-192.png',
    data: {
      gamePk: data.gamePk || null,
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

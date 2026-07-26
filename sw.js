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

  const title = data.title || 'MLB Game Alert';
  const options = {
    body: data.body || 'New play update on your tracked game!',
    icon: 'https://www.mlbstatic.com/team-logos/league-on-dark/1.svg',
    badge: 'https://www.mlbstatic.com/team-logos/league-on-dark/1.svg',
    vibrate: [100, 50, 100],
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
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('push', (event) => {
  let data = {};
  if(event.data){
    try{ data = event.data.json(); }
    catch(e){ data = { body: event.data.text() }; }
  }
  const title = data.title || 'Night Before reminder';
  const options = {
    body: data.body || 'You have a reminder from Night Before.',
    icon: data.icon || undefined,
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data && event.notification.data.url || '/', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
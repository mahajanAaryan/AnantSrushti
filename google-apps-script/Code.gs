const BOOKING_RECIPIENT = 'shrushtianant@gmail.com';

function doPost(e) {
  const fields = e && e.parameter ? e.parameter : {};

  // Quietly ignore automated submissions caught by the hidden honeypot.
  if (fields.website) return ContentService.createTextOutput('OK');

  const name = clean(fields.name, 120);
  const phone = clean(fields.phone, 60);
  const checkin = clean(fields.checkin, 40);
  const checkout = clean(fields.checkout, 40);
  const packageType = clean(fields.package, 160);
  const adults = clean(fields.adults, 10);
  const children = clean(fields.children, 10) || '0';
  const email = clean(fields.email, 160);
  const requests = clean(fields.requests, 2000);
  const addons = e && e.parameters && e.parameters.addon
    ? e.parameters.addon.map(value => clean(value, 100)).join(', ')
    : 'None';

  if (!name || !phone || !checkin || !packageType || !adults) {
    return ContentService.createTextOutput('Missing required booking details');
  }

  const lines = [
    'A new booking inquiry was submitted on the Anant Srushti website.',
    '',
    'Name: ' + name,
    'Phone: ' + phone,
    'Email: ' + (email || 'Not provided'),
    'Check-in: ' + checkin,
    'Check-out: ' + (checkout || 'Not provided'),
    'Package: ' + packageType,
    'Adults: ' + adults,
    'Children: ' + children,
    'Add-ons: ' + (addons || 'None'),
    '',
    'Special requests:',
    requests || 'None'
  ];

  const message = {
    to: BOOKING_RECIPIENT,
    subject: 'Website booking inquiry — ' + name.replace(/[\r\n]/g, ' '),
    body: lines.join('\n')
  };
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    message.replyTo = email;
  }

  MailApp.sendEmail(message);
  return ContentService.createTextOutput('OK');
}

function clean(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

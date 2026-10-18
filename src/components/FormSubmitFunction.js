export const scriptURLPrimary =
  'https://script.google.com/macros/s/AKfycbyUQ_pKUyA5Orm6TZk9fkKxULa7frC0UI3pIopFoDkj3DwWajqM3F-DHsF7CA4ZrkHi/exec';

export async function submitContactToAppsScript({ name, email, subject, message },scriptURL=scriptURLPrimary) {
  const params = new URLSearchParams();
  params.set('name', name || '');
  params.set('email', email || '');
  params.set('your-number', subject || ''); 
  params.set('message', message || '');

  const response = await fetch(scriptURL, {
    method: 'POST',
    body: params,
  });

  const bodyText = await response.text();
  return { ok: response.ok, status: response.status, bodyText };
}
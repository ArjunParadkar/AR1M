import { useState } from 'react';
import { submitContactToAppsScript } from '../components/FormSubmitFunction';

const EMPTY = { name: '', email: '', subject: '', message: '' };

// Contact, in the same sky as the rest of the site. Submits to the existing Apps Script.
const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState({ busy: false, ok: '', err: '' });
  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, ok: '', err: '' });
    try {
      const r = await submitContactToAppsScript(form);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setForm(EMPTY);
      setState({ busy: false, ok: 'Sent. We read everything and usually reply within a day.', err: '' });
    } catch (err) {
      console.error(err);
      setState({ busy: false, ok: '', err: 'That did not go through. Try again in a moment.' });
    }
  };

  return (
    <div className="fd-scroll">
      <div className="ct-wrap">
        <header className="ct-head">
          <h1>Say hello.</h1>
          <p>Partnerships, research questions, press, or a student who wants in. One form reaches all of us.</p>
          <p className="ct-foot">Bentonville · Fayetteville, Arkansas</p>
        </header>

        <form className="ct-form" onSubmit={submit} noValidate={false}>
          <label className="ct-field">
            <span>Name</span>
            <input name="name" type="text" autoComplete="name" required value={form.name} onChange={set} disabled={state.busy} />
          </label>
          <label className="ct-field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required value={form.email} onChange={set} disabled={state.busy} />
          </label>
          <label className="ct-field">
            <span>What is it about</span>
            <input name="subject" type="text" required value={form.subject} onChange={set} disabled={state.busy} />
          </label>
          <label className="ct-field">
            <span>Message</span>
            <textarea name="message" rows="5" required value={form.message} onChange={set} disabled={state.busy} />
          </label>
          <div className="ct-actions">
            <button type="submit" className="ct-send" disabled={state.busy}>{state.busy ? 'Sending' : 'Send message'}</button>
            {state.ok && <p className="ct-ok" role="status">{state.ok}</p>}
            {state.err && <p className="ct-err" role="alert">{state.err}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;

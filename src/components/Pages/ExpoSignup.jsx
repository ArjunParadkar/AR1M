import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const TABS = [
  { key: 'attend',  label: 'Attend' },
  { key: 'sponsor', label: 'Sponsor Event' },
  { key: 'present', label: 'Present' },
  { key: 'vip',     label: 'VIP' },
];

// ── Shared input styles ────────────────────────────────────────────────────
const Input = ({ label, type = 'text', name, value, onChange, required, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="expo-form-label">{label}{required && <span className="text-blue-400 ml-1">*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="expo-form-input"
    />
  </div>
);

const Textarea = ({ label, name, value, onChange, required, placeholder, rows = 4 }) => (
  <div className="flex flex-col gap-1.5">
    <label className="expo-form-label">{label}{required && <span className="text-blue-400 ml-1">*</span>}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={rows}
      className="expo-form-input resize-none"
    />
  </div>
);

const Select = ({ label, name, value, onChange, required, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="expo-form-label">{label}{required && <span className="text-blue-400 ml-1">*</span>}</label>
    <select name={name} value={value} onChange={onChange} required={required} className="expo-form-input">
      <option value="">Select...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// ── Attend form ────────────────────────────────────────────────────────────
const AttendForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', how: '' });
  const [status, setStatus] = useState('idle');
  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'expo_attendees'), { ...form, createdAt: serverTimestamp() });
      setStatus('done');
      onSuccess();
    } catch { setStatus('error'); }
  };

  return (
    <form onSubmit={submit} className="expo-form-grid">
      <Input label="Full Name" name="name" value={form.name} onChange={set} required />
      <Input label="Email" type="email" name="email" value={form.email} onChange={set} required />
      <Input label="Phone (optional)" type="tel" name="phone" value={form.phone} onChange={set} />
      <Select label="How did you hear about Expo?" name="how" value={form.how} onChange={set}
        options={['Social Media', 'Friend / Colleague', 'Arenda Newsletter', 'School / University', 'Other']} />
      <SubmitBtn status={status} label="Reserve My Spot" />
    </form>
  );
};

// ── Sponsor form ───────────────────────────────────────────────────────────
const SponsorForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', company: '', level: '', message: '' });
  const [status, setStatus] = useState('idle');
  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'expo_sponsors'), { ...form, createdAt: serverTimestamp() });
      setStatus('done');
      onSuccess();
    } catch { setStatus('error'); }
  };

  return (
    <form onSubmit={submit} className="expo-form-grid">
      <Input label="Full Name" name="name" value={form.name} onChange={set} required />
      <Input label="Email" type="email" name="email" value={form.email} onChange={set} required />
      <Input label="Company / Organization" name="company" value={form.company} onChange={set} required />
      <Select label="Sponsorship Level Interest" name="level" value={form.level} onChange={set} required
        options={['Presenting Sponsor', 'Gold', 'Silver', 'Bronze', 'In-Kind / Other']} />
      <Textarea label="Message (optional)" name="message" value={form.message} onChange={set}
        placeholder="Tell us about your goals for sponsoring..." />
      <SubmitBtn status={status} label="Submit Sponsorship Interest" />
    </form>
  );
};

// ── Present form ───────────────────────────────────────────────────────────
const PresentForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', title: '', description: '', category: '', team: '' });
  const [status, setStatus] = useState('idle');
  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'expo_presenters'), { ...form, createdAt: serverTimestamp() });
      setStatus('done');
      onSuccess();
    } catch { setStatus('error'); }
  };

  return (
    <form onSubmit={submit} className="expo-form-grid">
      <Input label="Full Name" name="name" value={form.name} onChange={set} required />
      <Input label="Email" type="email" name="email" value={form.email} onChange={set} required />
      <Input label="Project / Talk Title" name="title" value={form.title} onChange={set} required />
      <Select label="Category" name="category" value={form.category} onChange={set} required
        options={['Artificial Intelligence', 'Engineering / Hardware', 'Social Impact', 'Biotech / Health', 'Research', 'Other']} />
      <Input label="Team Members (if any)" name="team" value={form.team} onChange={set}
        placeholder="e.g. Jane Smith, John Doe" />
      <Textarea label="Project / Talk Description" name="description" value={form.description} onChange={set} required
        placeholder="Brief description of what you will present..." rows={5} />
      <SubmitBtn status={status} label="Apply to Present" />
    </form>
  );
};

// ── VIP form ───────────────────────────────────────────────────────────────
const VIPForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '', email: '', role: '', company: '',
    investInterest: '', investDetails: '', how: '',
  });
  const [status, setStatus] = useState('idle');
  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'expo_vip'), { ...form, createdAt: serverTimestamp() });
      setStatus('done');
      onSuccess();
    } catch { setStatus('error'); }
  };

  return (
    <form onSubmit={submit} className="expo-form-grid">
      <Input label="Full Name" name="name" value={form.name} onChange={set} required />
      <Input label="Email" type="email" name="email" value={form.email} onChange={set} required />
      <Input label="Role / Title" name="role" value={form.role} onChange={set} required
        placeholder="e.g. Investor, CEO, Professor, Engineer" />
      <Input label="Company / Organization" name="company" value={form.company} onChange={set} />
      <Select label="Are you interested in investing in community projects?"
        name="investInterest" value={form.investInterest} onChange={set} required
        options={['Yes — actively looking', 'Yes — open to it', 'Not at this time', 'Prefer to discuss in person']} />
      {(form.investInterest === 'Yes — actively looking' || form.investInterest === 'Yes — open to it') && (
        <Textarea label="Tell us more about your investment interests"
          name="investDetails" value={form.investDetails} onChange={set}
          placeholder="Areas of interest, check size range, stage preference..." rows={4} />
      )}
      <Select label="How did you hear about Expo?" name="how" value={form.how} onChange={set}
        options={['Direct Invitation', 'Colleague / Network', 'Social Media', 'Arenda Newsletter', 'Other']} />
      <SubmitBtn status={status} label="Request VIP Access" />
    </form>
  );
};

// ── Submit button ──────────────────────────────────────────────────────────
const SubmitBtn = ({ status, label }) => (
  <div className="pt-2">
    {status === 'error' && (
      <p className="text-red-400 text-sm mb-3" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.05em' }}>
        Something went wrong. Please try again.
      </p>
    )}
    <button
      type="submit"
      disabled={status === 'loading'}
      className="expo-banner-btn w-full"
      style={{ opacity: status === 'loading' ? 0.6 : 1 }}
    >
      {status === 'loading' ? 'Submitting...' : label}
    </button>
  </div>
);

// ── Success screen ─────────────────────────────────────────────────────────
const Success = ({ tab, onReset }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
    <h2 className="expo-section-title">Submitted</h2>
    <p className="expo-body max-w-md">
      {tab === 'attend' && "You're on the list. We'll be in touch with details as June 27th approaches."}
      {tab === 'sponsor' && "Thank you for your interest in sponsoring Arenda Expo. Our team will reach out shortly."}
      {tab === 'present' && "Application received. We'll review your submission and get back to you soon."}
      {tab === 'vip' && "VIP request received. Expect a personal follow-up from the Arenda team."}
    </p>
    <button onClick={onReset} className="expo-banner-btn mt-4">Submit Another</button>
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────
const ExpoSignup = () => {
  const [params] = useSearchParams();
  const typeParam = params.get('type');
  const [tab, setTab] = useState(TABS.find(t => t.key === typeParam)?.key ?? 'attend');
  const [done, setDone] = useState(false);

  useEffect(() => { setDone(false); }, [tab]);

  const descriptions = {
    attend:  'Reserve your spot at Arenda Expo — June 27th, 2026.',
    sponsor: 'Partner with Arenda Innovations to support the next generation of student builders.',
    present: 'Apply to showcase your project, research, or demo at Expo.',
    vip:     'Request VIP access — exclusive networking, early entry, and investment opportunities.',
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="text-center pt-24 pb-12 px-6">
        <p className="expo-eyebrow">Arenda Expo — June 27th, 2026</p>
        <h1 className="expo-section-title mt-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
          {TABS.find(t => t.key === tab)?.label}
        </h1>
        <p className="expo-body mt-3 max-w-xl mx-auto">{descriptions[tab]}</p>
      </div>

      {/* Tab bar */}
      <div className="flex justify-center gap-2 flex-wrap px-4 mb-12">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`expo-tab-btn ${tab === t.key ? 'expo-tab-active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Form area */}
      <div className="max-w-xl mx-auto px-6 pb-24">
        {done ? (
          <Success tab={tab} onReset={() => setDone(false)} />
        ) : (
          <>
            {tab === 'attend'  && <AttendForm  onSuccess={() => setDone(true)} />}
            {tab === 'sponsor' && <SponsorForm onSuccess={() => setDone(true)} />}
            {tab === 'present' && <PresentForm onSuccess={() => setDone(true)} />}
            {tab === 'vip'     && <VIPForm     onSuccess={() => setDone(true)} />}
          </>
        )}
      </div>
    </div>
  );
};

export default ExpoSignup;

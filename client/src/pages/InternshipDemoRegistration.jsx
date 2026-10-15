import React, { useRef, useState } from 'react';
import { CheckCircle2, GraduationCap, LoaderCircle, Send } from 'lucide-react';

const EDUCATION_LEVELS = [
  '10th/12th',
  'Diploma',
  'B.E./B.Tech',
  'BCA/BSc CS/IT',
  'MCA/MSc',
  'Other'
];

const INTERNSHIP_DOMAINS = [
  'Web Development',
  'App Development',
  'Cyber Security',
  'Python',
  'AI/ML',
  'Data Analytics',
  'Full-Stack Development',
  'IoT',
  'Cloud/DevOps',
  'UI/UX Design'
];

const INITIAL_FORM = {
  fullName: '',
  mobileNumber: '',
  email: '',
  collegeName: '',
  educationLevel: 'Diploma',
  semesterYear: '',
  selectedDomain: 'Web Development',
  preferredDemoDay: 'Sunday',
  city: ''
};

export default function InternshipDemoRegistration() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const idempotencyKey = useRef('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm(current => ({
      ...current,
      [name]: name === 'mobileNumber' ? value.replace(/\D/g, '').slice(0, 10) : value
    }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    if (!idempotencyKey.current) {
      idempotencyKey.current = crypto.randomUUID();
    }

    try {
      const response = await fetch('/api/internship-demo/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey.current
        },
        body: JSON.stringify(form)
      });
      const result = await response.json();

      if (!response.ok || !result.success || !result.registrationId) {
        setError(result.message || 'We could not save your registration. Please try again.');
        return;
      }

      setRegistrationId(result.registrationId);
    } catch {
      setError('Unable to reach the registration service. Your details have not been confirmed as saved; please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="demo-registration-page">
      <div className="container demo-registration-layout">
        <div className="demo-registration-intro">
          <span className="badge badge-emerald">Free Internship Demo</span>
          <h1>Take the first step toward your next skill.</h1>
          <p>
            Register for a weekend demo and explore the internship domain that
            interests you. Our team will contact you with the confirmed session details.
          </p>
          <div className="demo-registration-highlight">
            <GraduationCap size={23} />
            <span>Choose Saturday or Sunday and we will follow up with your session details.</span>
          </div>
        </div>

        <div className="glass-panel demo-registration-card">
          {registrationId ? (
            <div className="demo-registration-success" role="status">
              <CheckCircle2 size={52} />
              <h2>Registration Submitted Successfully!</h2>
              <p>
                Thank you for your interest in NKSKILLEDGE Private Limited. Our team will
                contact you with the confirmed demo session details.
              </p>
              <span className="demo-registration-id">Registration ID: {registrationId}</span>
            </div>
          ) : (
            <>
              <div className="demo-registration-card-heading">
                <h2>Register for an internship demo</h2>
                <p>Required fields are marked with an asterisk.</p>
              </div>

              {error && <div className="demo-registration-error" role="alert">{error}</div>}

              <form className="demo-registration-form" onSubmit={handleSubmit}>
                <div className="demo-registration-field">
                  <label htmlFor="demo-full-name">Full Name *</label>
                  <input
                    id="demo-full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    maxLength="120"
                    value={form.fullName}
                    onChange={updateField}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="demo-registration-field">
                  <label htmlFor="demo-mobile">Indian Mobile Number *</label>
                  <div className="demo-mobile-input">
                    <span aria-hidden="true">+91</span>
                    <input
                      id="demo-mobile"
                      name="mobileNumber"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      pattern="[6-9][0-9]{9}"
                      title="Enter a valid 10-digit Indian mobile number."
                      value={form.mobileNumber}
                      onChange={updateField}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>

                <div className="demo-registration-field">
                  <label htmlFor="demo-email">Email Address *</label>
                  <input
                    id="demo-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength="254"
                    value={form.email}
                    onChange={updateField}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="demo-registration-field">
                  <label htmlFor="demo-college">College/Institute Name *</label>
                  <input
                    id="demo-college"
                    name="collegeName"
                    type="text"
                    autoComplete="organization"
                    maxLength="200"
                    value={form.collegeName}
                    onChange={updateField}
                    placeholder="Your college or institute"
                    required
                  />
                </div>

                <div className="demo-registration-field">
                  <label htmlFor="demo-education">Education Level *</label>
                  <select
                    id="demo-education"
                    name="educationLevel"
                    value={form.educationLevel}
                    onChange={updateField}
                    required
                  >
                    {EDUCATION_LEVELS.map(level => <option key={level}>{level}</option>)}
                  </select>
                </div>

                <div className="demo-registration-field">
                  <label htmlFor="demo-semester">Semester/Year <span>(optional)</span></label>
                  <input
                    id="demo-semester"
                    name="semesterYear"
                    type="text"
                    maxLength="100"
                    value={form.semesterYear}
                    onChange={updateField}
                    placeholder="e.g. 3rd year"
                  />
                </div>

                <div className="demo-registration-field">
                  <label htmlFor="demo-domain">Internship Domain *</label>
                  <select
                    id="demo-domain"
                    name="selectedDomain"
                    value={form.selectedDomain}
                    onChange={updateField}
                    required
                  >
                    {INTERNSHIP_DOMAINS.map(domain => <option key={domain}>{domain}</option>)}
                  </select>
                </div>

                <fieldset className="demo-registration-field demo-day-field">
                  <legend>Preferred Demo Day *</legend>
                  <div className="demo-day-options">
                    {['Saturday', 'Sunday'].map(day => (
                      <label key={day} className={form.preferredDemoDay === day ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="preferredDemoDay"
                          value={day}
                          checked={form.preferredDemoDay === day}
                          onChange={updateField}
                          required
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="demo-registration-field">
                  <label htmlFor="demo-city">City <span>(optional)</span></label>
                  <input
                    id="demo-city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    maxLength="100"
                    value={form.city}
                    onChange={updateField}
                    placeholder="Your city"
                  />
                </div>

                <button className="btn btn-primary demo-registration-submit" type="submit" disabled={submitting}>
                  {submitting ? <LoaderCircle className="demo-spinner" size={18} /> : <Send size={17} />}
                  {submitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

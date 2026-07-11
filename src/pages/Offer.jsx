import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

function Offer({ profile, accepted, onAccept, onOpenWork }) {
  const [checked, setChecked] = useState(false);
  const [signature, setSignature] = useState('');

  return (
    <section className="offer-page">
      <div className="offer-document">
        <div className="offer-brand"><span>SR</span><strong>SOLSTICE RETAIL GROUP</strong></div>
        <p>8 July 2026</p>
        <h1>Offer of Employment</h1>
        <p>Dear {profile.name},</p>
        <p>We are pleased to offer you the position of <strong>Junior Data Analyst</strong>, reporting to the Analytics Manager.</p>
        <dl>
          <div><dt>Start date</dt><dd>3 August 2026</dd></div>
          <div><dt>Gross salary</dt><dd>R32,000 per month</dd></div>
          <div><dt>Annual cost to company</dt><dd>R384,000</dd></div>
          <div><dt>Probation</dt><dd>3 months</dd></div>
          <div><dt>Working model</dt><dd>Hybrid · 3 office days</dd></div>
          <div><dt>Leave</dt><dd>20 working days annually</dd></div>
        </dl>
        <p>This offer is subject to identity, qualification, and reference verification. The attached employment agreement includes confidentiality, data protection, and notice terms.</p>
        {!accepted ? (
          <div className="contract-sign">
            <label>
              <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
              I have read and accept the employment agreement and offer terms.
            </label>
            <label>
              Type your full legal name as your electronic signature
              <input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder={profile.name} />
            </label>
            <button className="primary-button" disabled={!checked || signature.trim().toLowerCase() !== profile.name.trim().toLowerCase()} onClick={onAccept}>
              Sign and accept offer
            </button>
          </div>
        ) : (
          <div className="contract-success">
            <ShieldCheck size={25} />
            <div><strong>Contract signed</strong><span>A signed copy has been sent to your inbox.</span></div>
            <button className="primary-button" onClick={onOpenWork}>Open employee workspace</button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Offer;
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { BrandMark } from '../components';
import { storyContent } from '../data';

function Profile({ profile, setProfile, onContinue }) {
  const fields = storyContent.profileQuestions;
  const [step, setStep] = useState(0);
  const [value, setValue] = useState(profile[fields[step].key]);

  function next() {
    const key = fields[step].key;
    setProfile((current) => ({ ...current, [key]: value.trim() }));
    if (step === fields.length - 1) onContinue();
    else {
      setStep((current) => current + 1);
      setValue(profile[fields[step + 1].key]);
    }
  }

  return (
    <main className="question-screen">
      <BrandMark />
      <section key={step} className="question-content">
        <p className="overline">Before results day · {step + 1} of {fields.length}</p>
        <h1>{fields[step].question}</h1>
        <input
          autoFocus
          value={value}
          placeholder={fields[step].placeholder}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && value.trim() && next()}
        />
        <button className="primary-button" disabled={!value.trim()} onClick={next}>
          Continue <ChevronRight size={18} />
        </button>
      </section>
      <div className="step-line"><span style={{ width: `${((step + 1) / fields.length) * 100}%` }} /></div>
    </main>
  );
}

export default Profile;

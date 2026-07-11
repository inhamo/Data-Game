import React from 'react';
import { ShieldCheck, FileText, Check } from 'lucide-react';

function ProjectEvaluation({ evaluation, notebook, report, onBack, onContinue }) {
  const passed = evaluation.score >= 70;

  return (
    <div className={`project-evaluation ${passed ? 'passed' : 'revise'}`}>
      <div className="result-emblem">
        {passed ? <ShieldCheck size={40} /> : <FileText size={40} />}
      </div>
      <p className="overline">Project review complete</p>
      <h1>{passed ? 'Submission accepted' : 'Revision requested'}</h1>
      <strong>{evaluation.score}%</strong>
      <p>
        {passed
          ? 'The prototype has accepted your work. It has been added to your résumé while the final evaluator design is still being decided.'
          : 'The evidence or deliverables are incomplete. Improve the executive finding and resubmit.'}
      </p>
      <div>
        <span>{notebook?.name}</span><Check size={17} />
        <span>{report?.name}</span><Check size={17} />
      </div>
      {passed ? (
        <button className="primary-button" onClick={onContinue}>Return to work dashboard</button>
      ) : (
        <button className="primary-button" onClick={onBack}>Return to submission</button>
      )}
    </div>
  );
}

export default ProjectEvaluation;
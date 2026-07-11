import React from 'react';
import { ChevronRight } from 'lucide-react';

function InterviewIntermission({ details, onContinue }) {
  return (
    <main className="interview-intermission">
      <div>
        <span>ROUND COMPLETE · {details.company.toUpperCase()}</span>
        <h1>This pause is part of the process.</h1>
        <p>
          Real hiring rarely moves in one clean line. People compare notes, calendars delay decisions, and every round tests something different. You are still here because your skill earned another conversation.
        </p>
        <blockquote>
          Nothing about waiting can separate you from what you have learned. Rest, prepare, and return.
        </blockquote>
        <button className="primary-button" onClick={onContinue}>
          Continue to round {details.nextRound} of {details.totalRounds} <ChevronRight size={18} />
        </button>
      </div>
    </main>
  );
}

export default InterviewIntermission;
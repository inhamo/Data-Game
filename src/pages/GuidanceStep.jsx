import React from 'react';

function GuidanceStep({ step }) {
  const content = {
    1: [
      ['Create a virtual environment and notebook', 'Keep the work reproducible.'],
      ['Load with pandas and inspect shape, dtypes, and samples', 'Do not start charting yet.'],
      ['Test customer_id uniqueness and referential integrity', 'Document unmatched records.']
    ],
    2: [
      ['Define churn and the comparison period', 'Write the metric before calculating it.'],
      ['Compare migrated and native loyalty customers', 'Control for tenure and region.'],
      ['Connect points variance, failed redemption, tickets, and churn', 'Look for convergence, not one convenient correlation.']
    ],
    3: [
      ['Create a customer-level analytical table', 'One row per customer with behavioural features.'],
      ['Export a clean model for Power BI', 'Use clear names and documented calculations.'],
      ['Keep raw data separate from transformed outputs', 'Your reviewer should be able to trace every number.']
    ],
    4: [
      ['Page 1: Executive answer', 'Lead with the finding and business impact.'],
      ['Page 2: Who is affected', 'Segment by migration cohort, region, and tenure.'],
      ['Page 3: Why it is happening', 'Connect loyalty errors, complaints, and customer loss.'],
      ['Page 4: Recommendation', 'Show immediate containment and long-term repair.']
    ]
  };

  const items = content[step] || [];
  return (
    <div className="guidance-list">
      {items.map((item, index) => (
        <div key={item[0]}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <strong>{item[0]}</strong>
            <p>{item[1]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GuidanceStep;
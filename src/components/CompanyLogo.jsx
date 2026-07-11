import React from 'react';

function CompanyLogo({ job, large }) {
  return <span className={`company-logo ${large ? "large" : ""}`}>{job.logo}</span>;
}

export default CompanyLogo;
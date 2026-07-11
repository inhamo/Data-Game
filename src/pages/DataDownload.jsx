import React from 'react';
import { FileText, Download } from 'lucide-react';
import { appPath } from '../utils';

function DataDownload() {
  const files = [
    ['customers.csv', '12,000 rows', 'Customer profile, loyalty source, points balance, and status'],
    ['orders.csv', '50,000 rows', 'Order value, redemptions, checkout errors, and outcomes'],
    ['support_tickets.csv', '15,000 rows', 'Complaint reasons, resolution time, and satisfaction']
  ];

  return (
    <div className="data-package">
      <div className="data-readme">
        <FileText size={24} />
        <div><strong>Project brief</strong><span>Three tables · 77,000 rows · January–July 2026</span></div>
        <a href={appPath('data/loyalty-project/README.txt')} download>Download README</a>
      </div>
      {files.map((file) => (
        <div className="data-file" key={file[0]}>
          <span>CSV</span>
          <div><strong>{file[0]}</strong><small>{file[2]}</small></div>
          <b>{file[1]}</b>
          <a className="icon-button" href={appPath(`data/loyalty-project/${file[0]}`)} download aria-label={`Download ${file[0]}`}>
            <Download size={18} />
          </a>
        </div>
      ))}
    </div>
  );
}

export default DataDownload;
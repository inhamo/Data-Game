import React, { useState, useEffect } from 'react';
import { Database, AlertTriangle } from 'lucide-react';
import { executeSQL } from '../utils/sqlExecutor';

function CompanyDataLab({ granted }) {
  const [query, setQuery] = useState(
    `SELECT region, COUNT(*) AS customers\nFROM customers\nGROUP BY region\nORDER BY customers DESC;`
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Load data from /data/tables.json – no fallback
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const response = await fetch('/data/tables.json');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        if (!cancelled) {
          // Validate required tables
          const required = ['customers', 'orders', 'support_tickets'];
          const missing = required.filter(t => !json[t]);
          if (missing.length) {
            throw new Error(`Missing tables: ${missing.join(', ')}`);
          }
          setTables(json);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message);
          setLoading(false);
        }
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, []);

  if (!granted) {
    return (
      <div className="data-locked">
        <Database size={34} />
        <h1>Company data access pending</h1>
        <p>Attend the three senior meetings and send Tom a scoped request. Access is granted only when the grain, fields, and period are clear.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading data tables from /data/tables.json …</div>;
  }

  if (loadError) {
    return (
      <div className="data-locked error">
        <AlertTriangle size={34} style={{ color: '#dc3545' }} />
        <h1>Data unavailable</h1>
        <p>Could not load tables from <code>/data/tables.json</code>.</p>
        <p style={{ color: '#dc3545', fontSize: '0.9rem' }}>Error: {loadError}</p>
        <p style={{ marginTop: '1rem' }}>
          Please run the Python data generator (<code>data_generator.py</code>) to create the JSON file.
        </p>
      </div>
    );
  }

  const runQuery = () => {
    setError(null);
    setResult(null);
    try {
      const { columns, rows } = executeSQL(query, tables);
      setResult({ columns, rows });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="company-data-lab">
      <div className="employee-heading">
        <p className="overline">Read‑only company data</p>
        <h1>Customer Insights SQL</h1>
        <p>Your access includes approved customer, order, and support extracts. Production writes remain blocked.</p>
      </div>
      <div className="company-schema">
        <span><strong>customers</strong> {tables.customers.length} rows</span>
        <span><strong>orders</strong> {tables.orders.length} rows</span>
        <span><strong>support_tickets</strong> {tables.support_tickets.length} rows</span>
      </div>
      <div className="query-console">
        <header><span>solstice_customer_insights</span><b>READ ONLY</b></header>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck="false"
          rows={6}
        />
        <button onClick={runQuery}>Run query</button>
      </div>
      {error && <div className="query-error">{error}</div>}
      {result && (
        <table className="query-results">
          <thead>
            <tr>{result.columns.map(col => <th key={col}>{col}</th>)}</tr>
          </thead>
          <tbody>
            {result.rows.map((row, idx) => (
              <tr key={idx}>
                {result.columns.map(col => <td key={col}>{row[col] !== undefined ? row[col] : 'NULL'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CompanyDataLab;
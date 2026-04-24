import { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [inputVal, setInputVal] = useState('[\n  "A->B",\n  "A->C",\n  "B->D"\n]');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      let parsedData;
      try {
        parsedData = JSON.parse(inputVal);
      } catch (e) {
        throw new Error('Invalid JSON format. Please provide a valid JSON array of strings.');
      }

      if (!Array.isArray(parsedData)) {
        throw new Error('Input must be a JSON array.');
      }

      const response = await axios.post('http://localhost:3000/bfhl', {
        data: parsedData
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const loadTestCycle = () => setInputVal('[\n  "X->Y",\n  "Y->Z",\n  "Z->X"\n]');
  const loadTestDuplicate = () => setInputVal('[\n  "A->B",\n  "A->B",\n  "A->B"\n]');
  const loadTestInvalid = () => setInputVal('[\n  "hello",\n  "1->2",\n  "A->"\n]');
  const loadTestMultiParent = () => setInputVal('[\n  "A->D",\n  "B->D"\n]');

  return (
    <>
      <header className="mb-8 text-center fade-in">
        <h1 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Hierarchical Node Processor</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Bajaj Finserv Health technical evaluation</p>
      </header>

      <main>
        <section className="glass-panel mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="section-title">
            <h2>Input Data</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Provide a JSON array of string relationships (e.g., <code>"A-&gt;B"</code>)
          </p>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button className="badge" onClick={loadTestCycle} style={{ cursor: 'pointer' }}>Test Cycle</button>
            <button className="badge" onClick={loadTestDuplicate} style={{ cursor: 'pointer' }}>Test Duplicates</button>
            <button className="badge" onClick={loadTestInvalid} style={{ cursor: 'pointer' }}>Test Invalid</button>
            <button className="badge" onClick={loadTestMultiParent} style={{ cursor: 'pointer' }}>Test Multi-Parent</button>
          </div>

          <textarea 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            spellCheck="false"
          />
          <button 
            className="primary-btn" 
            onClick={handleSubmit} 
            disabled={loading || !inputVal.trim()}
          >
            {loading ? (
              <><span className="spinner"></span> Processing...</>
            ) : (
              'Process Hierarchies'
            )}
          </button>

          {error && (
            <div className="alert alert-danger mt-8 fade-in">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {result && (
          <div className="fade-in" style={{ animationDelay: '0.2s' }}>
            
            <div className="api-info mb-6">
              <div className="api-info-item">
                <span>User ID</span>
                <span>{result.user_id}</span>
              </div>
              <div className="api-info-item">
                <span>Email ID</span>
                <span>{result.email_id}</span>
              </div>
              <div className="api-info-item">
                <span>College Roll</span>
                <span>{result.college_roll_number}</span>
              </div>
            </div>

            <div className="grid-cols-3 mb-6">
              <div className="glass-panel stat-card">
                <h3>Total Trees</h3>
                <p>{result.summary.total_trees}</p>
              </div>
              <div className="glass-panel stat-card">
                <h3>Total Cycles</h3>
                <p>{result.summary.total_cycles}</p>
              </div>
              <div className="glass-panel stat-card">
                <h3>Largest Tree Root</h3>
                <p>{result.summary.largest_tree_root || "N/A"}</p>
              </div>
            </div>

            <div className="grid-cols-2 mb-6">
               <div className="glass-panel">
                 <div className="section-title">
                   <h3>Invalid Entries</h3>
                   <span className="badge danger">{result.invalid_entries.length} items</span>
                 </div>
                 <div>
                   {result.invalid_entries.length === 0 ? (
                     <span style={{ color: 'var(--text-secondary)' }}>None</span>
                   ) : (
                     result.invalid_entries.map((item, idx) => (
                       <span key={idx} className="badge danger">{item}</span>
                     ))
                   )}
                 </div>
               </div>

               <div className="glass-panel">
                 <div className="section-title">
                   <h3>Duplicate Edges</h3>
                   <span className="badge warning">{result.duplicate_edges.length} items</span>
                 </div>
                 <div>
                   {result.duplicate_edges.length === 0 ? (
                     <span style={{ color: 'var(--text-secondary)' }}>None</span>
                   ) : (
                     result.duplicate_edges.map((item, idx) => (
                       <span key={idx} className="badge warning">{item}</span>
                     ))
                   )}
                 </div>
               </div>
            </div>

            <div className="glass-panel">
               <div className="section-title">
                 <h2>Full API Response</h2>
                 <button className="copy-btn" onClick={copyToClipboard}>
                   {copied ? 'Copied!' : 'Copy JSON'}
                 </button>
               </div>
               <div className="json-view">
                 {JSON.stringify(result, null, 2)}
               </div>
            </div>

          </div>
        )}
      </main>
    </>
  )
}

export default App

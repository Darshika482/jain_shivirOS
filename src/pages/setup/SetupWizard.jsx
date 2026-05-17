import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useConfigStore } from '../../store/useConfigStore.js';
import schemaSQL from '../../../supabase/schema.sql?raw';

const REQUIRED_TABLES = [
  'students', 'volunteers', 'transactions',
  'attendance', 'attendance_submissions',
  'coin_distributions', 'coin_returns',
];

export default function SetupWizard() {
  const { saveSupabaseConfig, saveCampConfig, completeSetup } = useConfigStore();

  const [step, setStep] = useState(1);

  // Step 1
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connError, setConnError] = useState('');

  // Step 2
  const [verifying, setVerifying] = useState(false);
  const [tableStatus, setTableStatus] = useState({});
  const [copied, setCopied] = useState(false);

  // Step 3
  const [campName, setCampName] = useState('');
  const [campCity, setCampCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adminPwd, setAdminPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [coinPin, setCoinPin] = useState('');

  const allTablesOk = REQUIRED_TABLES.every(t => tableStatus[t] === true);
  const step3Valid = campName.trim() && startDate && endDate && adminPwd.length >= 6 && /^\d{4}$/.test(coinPin);

  const testConnection = async () => {
    setTesting(true);
    setConnError('');
    try {
      const client = createClient(url.trim(), anonKey.trim());
      const { error } = await client.from('students').select('id').limit(1);
      // If error is about table not existing, connection still works
      if (error && error.message && !error.message.includes('does not exist') && !error.message.includes('PGRST')) {
        throw new Error(error.message);
      }
      setConnected(true);
      saveSupabaseConfig({ supabaseUrl: url.trim(), supabaseAnonKey: anonKey.trim() });
    } catch (err) {
      setConnError(err.message || 'Could not connect. Check your URL and key.');
    }
    setTesting(false);
  };

  const verifyTables = async () => {
    setVerifying(true);
    const client = createClient(url.trim(), anonKey.trim());
    const status = {};
    for (const table of REQUIRED_TABLES) {
      try {
        const { error } = await client.from(table).select('id').limit(1);
        status[table] = !error;
      } catch {
        status[table] = false;
      }
    }
    setTableStatus(status);
    setVerifying(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaSQL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunch = () => {
    const days = startDate && endDate
      ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
      : 7;
    saveCampConfig({
      campName: campName.trim(),
      campCity: campCity.trim(),
      campStartDate: startDate,
      campEndDate: endDate,
      campTotalDays: days,
      adminPassword: adminPwd,
      coinkeeperPin: coinPin,
    });
    completeSetup();
    window.location.href = '/';
  };

  const STEPS = ['Connect', 'Database', 'Configure', 'Launch'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-800 to-forest-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-forest-700 px-6 pt-6 pb-4">
          <div className="text-white text-xl font-bold mb-1">jain-shivirOS</div>
          <div className="text-forest-200 text-sm mb-4">Camp Management Platform</div>
          {/* Step indicators */}
          <div className="flex gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${step === i + 1 ? 'bg-saffron-500 text-white' : step > i + 1 ? 'bg-green-400 text-white' : 'bg-forest-500 text-forest-200'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <div className={`text-[10px] ${step === i + 1 ? 'text-white' : 'text-forest-300'}`}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <div className="text-lg font-bold text-gray-900">Connect your Supabase project</div>
                <div className="text-sm text-gray-500 mt-1">
                  Go to <span className="font-medium">supabase.com</span> → your project → <span className="font-medium">Settings → API</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Project URL</label>
                <input
                  className="mt-1 w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-forest-500"
                  placeholder="https://your-project.supabase.co"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setConnected(false); }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Anon / Public Key</label>
                <input
                  className="mt-1 w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-forest-500 font-mono"
                  placeholder="eyJ..."
                  value={anonKey}
                  onChange={e => { setAnonKey(e.target.value); setConnected(false); }}
                />
              </div>
              {connError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-700">{connError}</div>
              )}
              {connected && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm text-green-700 flex items-center gap-2">
                  <span>✓</span> Connected successfully
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={testConnection}
                  disabled={testing || !url.trim() || !anonKey.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-forest-700 text-white text-sm font-semibold disabled:opacity-40"
                >
                  {testing ? 'Testing…' : 'Test Connection'}
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!connected}
                  className="flex-1 py-2.5 rounded-xl bg-saffron-500 text-white text-sm font-semibold disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="text-lg font-bold text-gray-900">Set up your database</div>
                <div className="text-sm text-gray-500 mt-1">Run the SQL schema in your Supabase project.</div>
              </div>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Copy the SQL below</li>
                <li>Open Supabase → <span className="font-medium">SQL Editor → New query</span></li>
                <li>Paste and click <span className="font-medium">Run</span></li>
                <li>Come back and click <span className="font-medium">Verify Tables</span></li>
              </ol>
              <div className="relative">
                <pre className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-[11px] font-mono overflow-y-auto max-h-40 text-gray-700 whitespace-pre-wrap">{schemaSQL.slice(0, 400)}…</pre>
                <button
                  onClick={handleCopy}
                  className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-xs font-semibold transition-all
                    ${copied ? 'bg-green-500 text-white' : 'bg-forest-700 text-white'}`}
                >
                  {copied ? 'Copied!' : 'Copy SQL'}
                </button>
              </div>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="block text-center text-sm text-forest-700 font-medium underline"
              >
                Open Supabase Dashboard ↗
              </a>
              <button
                onClick={verifyTables}
                disabled={verifying}
                className="w-full py-2.5 rounded-xl bg-forest-700 text-white text-sm font-semibold disabled:opacity-40"
              >
                {verifying ? 'Verifying…' : 'Verify Tables'}
              </button>
              {Object.keys(tableStatus).length > 0 && (
                <div className="border border-gray-200 rounded-xl divide-y">
                  {REQUIRED_TABLES.map(table => (
                    <div key={table} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span className="font-mono text-gray-700">{table}</span>
                      <span>{tableStatus[table] ? '✅' : '❌'}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600">← Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!allTablesOk}
                  className="flex-1 py-2.5 rounded-xl bg-saffron-500 text-white text-sm font-semibold disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div className="text-lg font-bold text-gray-900">Configure your camp</div>
                <div className="text-sm text-gray-500 mt-1">You can change these later in Admin settings.</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Camp Name</label>
                  <input className="mt-1 w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-forest-500"
                    placeholder="Jain Shivir 2026" value={campName} onChange={e => setCampName(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">City <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input className="mt-1 w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-forest-500"
                    placeholder="Your City" value={campCity} onChange={e => setCampCity(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" className="mt-1 w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-forest-500"
                    value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">End Date</label>
                  <input type="date" className="mt-1 w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-forest-500"
                    value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Admin Password</label>
                  <div className="relative mt-1">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-forest-500 pr-16"
                      placeholder="Min 6 characters"
                      value={adminPwd} onChange={e => setAdminPwd(e.target.value)} />
                    <button onClick={() => setShowPwd(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      {showPwd ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Coinkeeper PIN <span className="text-gray-400 font-normal">(4 digits)</span></label>
                  <input
                    className="mt-1 w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-forest-500 font-mono tracking-widest"
                    placeholder="1234" maxLength={4}
                    value={coinPin} onChange={e => setCoinPin(e.target.value.replace(/\D/g, '').slice(0, 4))} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep(2)} className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600">← Back</button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!step3Valid}
                  className="flex-1 py-2.5 rounded-xl bg-saffron-500 text-white text-sm font-semibold disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <div className="text-lg font-bold text-gray-900">You're all set!</div>
                <div className="text-sm text-gray-500 mt-1">Review your configuration before launching.</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Camp</span><span className="font-semibold text-gray-900">{campName}{campCity ? `, ${campCity}` : ''}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Dates</span><span className="font-semibold text-gray-900">{startDate} → {endDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Admin password</span><span className="font-semibold text-gray-900">{'•'.repeat(adminPwd.length)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Coinkeeper PIN</span><span className="font-semibold text-gray-900">••••</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Supabase</span><span className="font-semibold text-green-600">Connected ✓</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Database</span><span className="font-semibold text-green-600">Ready ✓</span></div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
                After launching, go to <strong>Admin → Volunteers</strong> to add your team, and <strong>Admin → Operations</strong> to import students.
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(3)} className="px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600">← Back</button>
                <button
                  onClick={handleLaunch}
                  className="flex-1 py-3 rounded-xl bg-forest-700 text-white font-bold text-base"
                >
                  Launch App →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

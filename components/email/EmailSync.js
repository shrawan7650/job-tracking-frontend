'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  getGmailAuthUrl, 
  connectGmail, 
  syncEmails, 
  getEmailAccounts, 
  getPendingConfirmations,
  confirmParsedEmail,
  disconnectEmail
} from '../../lib/email-api';

export function EmailSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState([]);
  const [pending, setPending] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (code && state) {
      handleConnect(code);
    } else {
      loadAccounts();
      loadPending();
    }
  }, [searchParams]);

  async function loadAccounts() {
    try {
      const { data } = await getEmailAccounts();
      setAccounts(data);
    } catch (e) { console.error(e); }
  }

  async function loadPending() {
    try {
      const { data } = await getPendingConfirmations();
      setPending(data);
    } catch (e) { console.error(e); }
  }

  async function handleGmailConnect() {
    setConnecting(true);
    try {
      const { data } = await getGmailAuthUrl();
      window.location.href = data.authUrl;
    } catch (e) {
      setMessage('Failed to start Gmail connection');
      setConnecting(false);
    }
  }

  async function handleConnect(code) {
    try {
      await connectGmail(code);
      setMessage('Gmail connected successfully!');
      router.push('/email-sync');
    } catch (e) {
      setMessage('Failed to connect Gmail');
    } finally {
      setConnecting(false);
    }
  }

  async function handleSync(accountId) {
    setSyncing(true);
    setMessage('Syncing emails...');
    try {
      const { data } = await syncEmails(accountId);
      setMessage(`Synced: ${data.newApplications} new, ${data.duplicates} duplicates, ${data.pendingConfirmations} need review`);
      loadAccounts();
      loadPending();
    } catch (e) {
      setMessage('Sync failed: ' + e.message);
    } finally {
      setSyncing(false);
    }
  }

  async function handleConfirm(parsedEmailId, action, applicationData) {
    try {
      await confirmParsedEmail(parsedEmailId, action, applicationData);
      setMessage(action === 'reject' ? 'Email rejected' : 'Application created!');
      loadPending();
    } catch (e) {
      setMessage('Action failed: ' + e.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Email Sync</h1>

      {message && <div className="p-4 bg-blue-50 text-blue-700 rounded">{message}</div>}

      {!accounts.length ? (
        <div className="p-6 border rounded-lg text-center">
          <p className="text-gray-600 mb-4">Connect your Gmail to auto-import job applications</p>
          <button 
            onClick={handleGmailConnect}
            disabled={connecting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {connecting ? 'Connecting...' : 'Connect Gmail'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Connected Accounts</h2>
            {accounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{acc.email}</p>
                  <p className="text-sm text-gray-500">Last synced: {acc.lastSyncedAt ? new Date(acc.lastSyncedAt).toLocaleString() : 'Never'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSync(acc.id)} disabled={syncing} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    {syncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                  <button onClick={() => disconnectEmail(acc.id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Disconnect</button>
                </div>
              </div>
            ))}
          </div>

          {pending.length > 0 && (
            <div className="p-4 border rounded-lg">
              <h2 className="font-semibold mb-3">{pending.length} emails need your review</h2>
              {pending.map(pe => (
                <div key={pe._id} className="mb-4 p-3 border rounded bg-gray-50">
                  <div className="mb-2">
                    <p className="font-medium">{pe.extractedData?.company || 'Unknown Company'}</p>
                    <p className="text-sm text-gray-600">{pe.extractedData?.role || 'Unknown Role'}</p>
                    <p className="text-xs text-gray-500">{pe.sender} • {new Date(pe.receivedAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">Confidence: {pe.confidenceScore}%</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleConfirm(pe._id, 'create', pe.extractedData)} className="px-3 py-1 bg-green-600 text-white text-sm rounded">Create</button>
                    <button onClick={() => handleConfirm(pe._id, 'reject')} className="px-3 py-1 bg-gray-600 text-white text-sm rounded">Not a job</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
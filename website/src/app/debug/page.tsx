'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SessionDebug() {
  const { data: session, status } = useSession();
  const [conversationsTest, setConversationsTest] = useState<any>(null);

  useEffect(() => {
    // Test the conversations API when session is available
    if (session) {
      fetch('/api/conversations?limit=5', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(r => r.json())
      .then(data => setConversationsTest(data))
      .catch(err => setConversationsTest({ error: err.message }));
    }
  }, [session]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold">Session Status: {status}</h2>
        <pre className="mt-2 text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="bg-blue-100 p-4 rounded">
        <h2 className="font-bold">Conversations API Test:</h2>
        <pre className="mt-2 text-sm overflow-auto">
          {JSON.stringify(conversationsTest, null, 2)}
        </pre>
      </div>
    </div>
  );
}

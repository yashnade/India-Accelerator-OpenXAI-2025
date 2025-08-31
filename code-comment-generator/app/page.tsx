'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [code, setCode] = useState('');
  const [commentedCode, setCommentedCode] = useState('');
  const [loading, setLoading] = useState(false);

 const generateComments = async () => {
  try {
    setLoading(true);
    setCommentedCode('');

    const res = await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    // Check if response is JSON
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Server did not return JSON. Response was:\n${text}`);
    }

    if (res.ok) {
      setCommentedCode(data.commentedCode);
    } else {
      setCommentedCode(`⚠️ Error: ${data.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    setCommentedCode(`⚠️ Unexpected Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};



  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold">📝 Code Comment Generator</h1>

      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        className="w-full max-w-2xl mb-4 h-60"
      />

      <Button onClick={generateComments} disabled={loading}>
        {loading ? 'Generating...' : 'Add Comments'}
      </Button>

      {commentedCode && (
        <pre className="w-full max-w-2xl p-4 mt-6 overflow-x-auto text-green-300 whitespace-pre-wrap bg-black rounded-xl">
          {commentedCode}
        </pre>
      )}
    </main>
  );
}

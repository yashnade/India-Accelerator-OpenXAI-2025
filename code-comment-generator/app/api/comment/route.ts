import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const prompt = `Add clear, helpful comments to the following code. Return the code with comments included.\n\n${code}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const commentedCode = response.choices[0].message?.content || '';

    return NextResponse.json({ commentedCode });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: 'Something went wrong', details: err.message },
      { status: 500 }
    );
  }
}

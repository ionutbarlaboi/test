import { parseDocxTextToQuestions } from '../../creare/utils/convertDocxToQuestions';
import mammoth from 'mammoth';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;
  const questions = parseDocxTextToQuestions(text);

  return new Response(JSON.stringify({ questions }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

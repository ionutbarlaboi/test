function parseTestFromText(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

  const questions = [];
  let i = 0;

  while (i < lines.length) {
    if (!lines[i].endsWith(':')) {
      i++;
      continue;
    }
    const questionText = lines[i];
    i++;

    const options = [];
    for (let j = 0; j < 4 && i < lines.length; j++, i++) {
      options.push(lines[i]);
    }

    const answerLine = lines[i];
    i++;

    const answerMatch = answerLine.match(/Răspuns corect:\s*([a-d])\./i);
    const correctAnswer = answerMatch[1].toLowerCase();

    let explanationLines = [];
    while (i < lines.length && !lines[i].endsWith(':')) {
      explanationLines.push(lines[i]);
      i++;
    }

    const explanation = explanationLines.join(' ');

    questions.push({
      question: questionText,
      options,
      correctAnswer,
      explanation,
    });
  }

  return questions;
}

// Test
const text = `
Rezultatul calculului 15-3•5 este numărul:
0
10
15
60
Răspuns corect: a.
Explicație: Trebuie respectată ordinea efectuării operațiilor.
Numărul care reprezintă 1/4 din 100 este:
4
10
25
50
Răspuns corect: c.
Explicație: 1/4•100=1/4•100/1=100/4=25
`;

console.log(parseTestFromText(text));

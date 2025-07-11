export async function rewriteClause(clauseText: string): Promise<string> {
  const prompt = `Write a professional legal contract clause covering the topic described below, written in precise, business-grade legal language.

✅ The clause must be:

- Legally enforceable
- Grammatically flawless  
- Clear and unambiguous
- Suitable for use between a contractor and a corporate client
- Free from logical or legal risk, vagueness, or overbroad obligations

✅ Include:

- Realistic structure (numbered or bulleted where appropriate)
- Fair language for both parties
- Any necessary legal safeguards or definitions
- Compliance with common law standards (e.g., U.S./U.K./Canadian commercial law)

✨ Make it sound like it was drafted by a top-tier commercial contracts attorney.

Original clause or topic: ${clauseText}

Only produce the clause — no explanations, no summaries. Quality must be 100% professional and client-ready.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a senior commercial contracts attorney with 20+ years of experience drafting high-stakes business agreements. You specialize in creating legally bulletproof, professionally worded contract clauses that protect both parties while maintaining clarity and enforceability. Your writing style is precise, authoritative, and immediately usable in real-world commercial contracts."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.1,
    }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to rewrite clause");
  }
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
} 
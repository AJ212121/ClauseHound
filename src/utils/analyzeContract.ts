import type { Clause } from '../context/AppContext';

export async function analyzeContract(
  text: string,
  contractType: string,
  jurisdiction: string,
  contractorType: string,
  projectType: string,
  userRole: string
): Promise<{ markdown: string; riskCount: number; clauses?: Clause[]; summary?: Record<string, unknown> }> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OpenAI API key. Please set VITE_OPENAI_API_KEY in your environment variables.");
  
  const prompt = `You are a senior commercial contracts attorney with 25+ years of experience. Analyze the following contract line by line, examining each sentence and clause for risk, clarity, and fairness.

## STRICT ANALYSIS REQUIREMENTS:

### For Each Line/Sentence:
1. **Quote the exact contract line** (display the actual words)
2. **Risk Assessment**: Rate as High Risk, Moderate Risk, Needs Review, or Safe
3. **Detailed Analysis** based on risk level:

#### For HIGH RISK and MODERATE RISK lines:
- **Description**: Clear explanation of why this line is risky
- **Better Alternative**: Professionally drafted, legally bulletproof replacement
- **Financial Impact**: Specific monetary/liability implications with dollar amounts where possible
- **Risk if Unchanged**: Concrete consequences of leaving this line as-is
- **Legal Words Explained**: Define any complex legal terminology

#### For NEEDS REVIEW and SAFE lines:
- **Description**: Brief explanation of why this line is acceptable or needs minor review
- **Legal Words Explained**: Define any complex legal terminology

## OUTPUT FORMAT:
Use this exact structure for each line with proper spacing:

### Line [Number]: [Brief Description]

**Original Text:** [Exact quote of the line]

**Risk Level:** [High Risk/Moderate Risk/Needs Review/Safe]

**Description:** [Clear explanation of the risk or acceptability]

**Better Alternative:** [ONLY for High/Moderate Risk - professionally drafted replacement]

**Financial Impact:** [ONLY for High/Moderate Risk - specific monetary implications]

**Risk if Unchanged:** [ONLY for High/Moderate Risk - concrete consequences]

**Legal Words Explained:** [Definitions of complex terms]

## EXECUTIVE SUMMARY:
Provide a comprehensive summary at the end with:
- Risk level counts (High Risk: X, Moderate Risk: Y, Needs Review: Z, Safe: W)
- Total lines analyzed
- Overall contract assessment
- Critical issues requiring immediate attention
- Recommended negotiation priorities
- Legal compliance status

## CONTRACT CONTEXT:
- Contractor Type: ${contractorType}
- Project Type: ${projectType}
- User Role: ${userRole}
- Jurisdiction: ${jurisdiction}
- Contract Type: ${contractType}

## CONTRACT TEXT:
---
${text}
---

Analyze this contract line by line with strict precision. Go through each sentence systematically and provide detailed analysis for each. Be extremely thorough and professional. Count each line accurately for the executive summary. Ensure each subheading is properly separated with clear formatting.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a senior commercial contracts attorney with 25+ years of experience at a top-tier law firm. You specialize in strict line-by-line contract analysis, risk assessment, and legal strategy for high-stakes business agreements. Your analysis is precise, authoritative, and immediately actionable. You provide insights that would be suitable for presentation to senior executives, legal counsel, or board members. You go through contracts systematically, line by line, providing detailed analysis for each sentence. You are extremely thorough and professional in your risk assessment. Always format your output with proper spacing between each subheading for clarity."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 4000,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    throw new Error("OpenAI API error");
  }
  const data = await response.json();
  let content = data.choices[0].message.content;

  // --- EXECUTIVE SUMMARY PARSING ---
  // Find the EXECUTIVE SUMMARY block
  let summaryBlock = '';
  let summaryStart = content.search(/## EXECUTIVE SUMMARY/i);
  if (summaryStart !== -1) {
    // Find the next heading or end of string
    let summaryEnd = content.slice(summaryStart + 1).search(/\n## /i);
    if (summaryEnd === -1) summaryEnd = content.length;
    else summaryEnd = summaryStart + 1 + summaryEnd;
    summaryBlock = content.slice(summaryStart, summaryEnd);
  }

  // Robustly extract risk counts (handles bullets, colons, dashes, spaces, and case)
  function extractRiskCount(label: string) {
    const match = summaryBlock.match(new RegExp(`${label}[^\d\n]*[:\-]?\s*(\d+)`, 'i'));
    return match ? parseInt(match[1], 10) : 0;
  }
  const high = extractRiskCount('High Risk');
  const moderate = extractRiskCount('Moderate Risk');
  const review = extractRiskCount('Needs Review');
  const safe = extractRiskCount('Safe');
  const total = extractRiskCount('Total lines analyzed');

  // Remove the risk count lines from the EXECUTIVE SUMMARY in the markdown
  if (summaryBlock) {
    const cleanedSummary = summaryBlock
      .replace(/(^|\n)[ \t]*[-*•]?[ \t]*(High Risk|Moderate Risk|Needs Review|Safe|Total lines analyzed)[^\d\n]*[:\-]?\s*\d+\.?/gi, '')
      .replace(/\n{3,}/g, '\n\n'); // Remove extra newlines
    // Replace the EXECUTIVE SUMMARY block in the markdown
    content = content.replace(summaryBlock, cleanedSummary);
  }

  // --- CLAUSE EXTRACTION (unchanged) ---
  const clauses: Clause[] = [];
  
  // Strict regex pattern for line-by-line clause extraction with proper spacing
  const clauseRegex = /### Line \d+:?\s*(.*?)\n\n\*\*Original Text:\*\*\s*([\s\S]*?)(?=\n\n\*\*Risk Level:\*\*|\*\*Description:\*\*)\n\n\*\*Risk Level:\*\*\s*(.*?)\n\n\*\*Description:\*\*\s*([\s\S]*?)(?=\n\n\*\*Better Alternative:\*\*|\*\*Legal Words Explained:\*\*)\n\n\*\*Better Alternative:\*\*\s*([\s\S]*?)(?=\n\n\*\*Financial Impact:\*\*|\*\*Risk if Unchanged:\*\*)\n\n\*\*Financial Impact:\*\*\s*([\s\S]*?)(?=\n\n\*\*Risk if Unchanged:\*\*|\*\*Legal Words Explained:\*\*)\n\n\*\*Risk if Unchanged:\*\*\s*([\s\S]*?)(?=\n\n\*\*Legal Words Explained:\*\*|\n###|\n##|\n#|\nExecutive Summary|$)\n\n\*\*Legal Words Explained:\*\*\s*([\s\S]*?)(?=\n###|\n##|\n#|\nExecutive Summary|$)/gi;
  
  let match;
  while ((match = clauseRegex.exec(content)) !== null) {
    const [, title, text, risk, description, betterAlternative, financialImpact, riskIfUnchanged, legalWords] = match;
    let riskKey: 'high' | 'moderate' | 'review' | 'safe' = 'safe';
    if (/high/i.test(risk)) riskKey = 'high';
    else if (/moderate/i.test(risk)) riskKey = 'moderate';
    else if (/review/i.test(risk)) riskKey = 'review';
    else if (/safe/i.test(risk)) riskKey = 'safe';
    
    clauses.push({
      title: title.trim(),
      text: text.trim(),
      risk: riskKey,
      explanation: description.trim(),
      saferClause: betterAlternative?.trim() || '',
      negotiationTips: '', // Not included in this format
      financialImpact: financialImpact?.trim() || '',
      legalTerms: legalWords?.trim() || '',
      riskIfUnchanged: riskIfUnchanged?.trim() || '',
      recommendation: '', // Not included in this format
    });
  }
  
  // --- RETURN ---
  return {
    markdown: content,
    riskCount: high + moderate + review,
    clauses,
    summary: {
      high: Number.isFinite(high) ? high : 0,
      moderate: Number.isFinite(moderate) ? moderate : 0,
      review: Number.isFinite(review) ? review : 0,
      safe: Number.isFinite(safe) ? safe : 0,
      total: Number.isFinite(total) ? total : 0,
    },
  };
} 
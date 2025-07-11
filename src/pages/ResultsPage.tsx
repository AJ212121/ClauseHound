import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { rewriteClause } from "../utils/rewriteClause";
import logo from '../../logo.jpg';

// Define Clause interface
interface Clause {
  title?: string;
  text: string;
  risk?: string;
  explanation?: string;
  saferClause?: string;
  negotiationTips?: string;
  financialImpact?: string;
  legalTerms?: string;
  riskIfUnchanged?: string;
  recommendation?: string;
  [key: string]: unknown;
}

const riskLabels: Record<string, string> = {
  high: "High Risk",
  moderate: "Moderate Risk",
  review: "Needs Review",
  safe: "Safe",
};

// Simple glossary for demo
const glossary: Record<string, string> = {
  indemnify:
    "To compensate for harm or loss. In contracts, it means one party agrees to cover the losses of another.",
  liability:
    "Legal responsibility for one's acts or omissions.",
  jurisdiction:
    "The legal authority of a court or region to govern or enforce laws.",
  breach:
    "A violation of a law, duty, or contractual obligation.",
  waiver:
    "The voluntary relinquishment of a known right.",
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const { analysis, setAnalysis, setContractText } = useAppContext();
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [rewriteResult, setRewriteResult] = useState<string | null>(null);
  const [rewrittenContract, setRewrittenContract] = useState<string | null>(null);
  // Add ref for rewritten clause PDF
  const clausePdfRef = useRef<HTMLDivElement>(null);

  // Sticky PDF export button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close modals with Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGlossaryTerm(null);
        setRewriteResult(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Copy to clipboard helpers
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  if (!analysis) {
    navigate("/");
    return null;
  }

  const clauses: Clause[] = analysis.clauses || [];
  // Use summary object from analysis for risk counts
  // const { summary } = analysis || {};

  // Export to PDF handler
  async function handleExportPDF() {
    if (!pdfRef.current) return;
    const html2pdf = (await import("html2pdf.js"))?.default || (await import("html2pdf.js"));
    html2pdf()
      .from(pdfRef.current)
      .set({ margin: 0.5, filename: "ClauseHound-Analysis.pdf", html2canvas: { scale: 1.2 } })
      .save();
  }

  async function handleRewriteAllClauses() {
    setRewrittenContract("Rewriting contract with AI, please wait...");
    try {
      // Only call rewriteClause if analysis is not null
      const rewritten = await rewriteClause(analysis?.markdown || "");
      setRewrittenContract(rewritten);
    } catch {
      setRewrittenContract("Failed to rewrite contract. Please try again.");
    }
  }

  // Handler to export rewritten clause as PDF
  async function handleExportClausePDF() {
    if (!clausePdfRef.current) return;
    const html2pdf = (await import("html2pdf.js"))?.default || (await import("html2pdf.js"));
    html2pdf()
      .from(clausePdfRef.current)
      .set({ margin: 0.5, filename: "ClauseHound-Rewritten-Clause.pdf", html2canvas: { scale: 1.2 } })
      .save();
  }

  // Extract final recommendation from markdown (simple heuristic)
  let finalRecommendation = "";
  let recMatch: RegExpMatchArray | null = null;
  if (analysis && analysis.markdown) {
    recMatch = analysis.markdown.match(/Final Recommendation:?([\s\S]*)/i);
    if (recMatch) {
      finalRecommendation = recMatch[1].split('\n')[0].trim();
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1f36] to-[#232946] text-white px-4 py-8">
      {/* Professional Header */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={logo} alt="ClauseHound logo" className="w-12 h-12 rounded-xl shadow-lg" />
          <h1 className="text-3xl font-bold text-emerald-400">Contract Analysis Report</h1>
        </div>
        <div className="bg-yellow-100/90 dark:bg-yellow-900/50 border-l-4 border-yellow-400 rounded-lg p-4 text-yellow-900 dark:text-yellow-100 text-sm font-medium shadow-lg">
          ⚠️ ClauseHound provides AI-powered analysis but is not a substitute for legal advice. For critical matters, consult a qualified lawyer.
        </div>
      </div>

      {/* Back to Upload Button */}
      <div className="w-full max-w-4xl flex justify-start mb-2">
        <button
          className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg font-semibold shadow hover:bg-emerald-200 dark:hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          onClick={() => navigate('/upload')}
          aria-label="Back to Upload"
        >
          ← Back to Upload
        </button>
      </div>

      {/* Main Content Container */}
      <div className="bg-white/95 dark:bg-[#232946]/95 shadow-2xl rounded-3xl p-8 mb-8 w-full max-w-4xl flex flex-col gap-8 animate-fadeInUp" ref={pdfRef}>
        
        {/* Executive Summary Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-emerald-500">📊</span>
            Executive Summary
          </h2>
          {/* Remove the risk count table here, keep only the heading and summary narrative */}
        </div>

        {/* AI Rewrite Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-emerald-500">🤖</span>
            AI Contract Rewrite
          </h3>
          <button
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300 transform hover:scale-[1.02]"
            onClick={handleRewriteAllClauses}
            disabled={false}
            aria-label="Rewrite all clauses with AI"
          >
            {false ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Rewriting Contract...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>🔄</span>
                <span>Rewrite All Clauses (AI Version)</span>
              </div>
            )}
          </button>
          {/* Copy to Clipboard for rewritten contract */}
          {rewrittenContract && (
            <div className="mt-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">AI-Rewritten Contract</h4>
                {/* Removed 10/10 Safe badge */}
                <button
                  className="ml-4 px-3 py-1 bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-semibold hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-all"
                  onClick={() => copyToClipboard(rewrittenContract)}
                  aria-label="Copy rewritten contract to clipboard"
                >
                  📋 Copy
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-sm leading-relaxed">{rewrittenContract}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            className="flex-1 group relative px-6 py-4 bg-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:bg-emerald-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            onClick={() => {
              setAnalysis(null);
              setContractText("");
              navigate("/");
            }}
            aria-label="Analyze another contract"
            tabIndex={0}
          >
            <span>🔁</span>
            <span>Analyze Another Contract</span>
          </button>
          
          <button
            className="flex-1 group relative px-6 py-4 bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            onClick={handleExportPDF}
            aria-label="Export report as PDF"
            tabIndex={0}
          >
            <span>📄</span>
            <span>Export Report PDF</span>
          </button>
        </div>

        {/* Final Recommendation */}
        {finalRecommendation && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-xl p-6 mt-6">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg mb-2 flex items-center gap-2">
              <span>💡</span>
              Final Recommendation
            </h4>
            <p className="text-blue-800 dark:text-blue-200">{finalRecommendation}</p>
          </div>
        )}

        {/* Full Analysis */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
            <span className="text-emerald-400">📖</span>
            Full Contract Analysis
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg text-gray-900 dark:text-gray-100 text-lg leading-relaxed prose prose-lg dark:prose-invert max-w-none">
            {analysis?.markdown ? (
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 text-emerald-700" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-emerald-600" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-emerald-500" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  a: ({node, ...props}) => <a className="text-emerald-600 underline hover:text-emerald-800" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-gray-700 dark:text-gray-300" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-400 pl-4 italic text-gray-600 dark:text-gray-300 my-4" {...props} />,
                  code: ({node, ...props}) => <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono" {...props} />,
                }}
              >
                {analysis.markdown.replace(/(^|\n)[ \t]*[-*•] *(High Risk|Moderate Risk|Needs Review|Safe|Total lines analyzed):? *\d+\.?/gi, "")}
              </ReactMarkdown>
            ) : null}
          </div>
        </div>

        {/* Divider for clarity */}
        <div className="my-10 border-t border-dashed border-emerald-200 dark:border-emerald-700 w-full"></div>

        {/* Risk List at the Bottom */}
        {clauses.length > 0 && (
          <div className="mt-8 bg-white/80 dark:bg-gray-900/80 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h4 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-emerald-500">📝</span>
              Clause Risk Overview
            </h4>
            <ul className="space-y-2">
              {clauses.map((clause, idx) => {
                let riskIcon = '🔍';
                let riskColor = 'text-gray-600 dark:text-gray-400';
                if ((clause.risk || '').toLowerCase().includes('high')) {
                  riskIcon = '🔴';
                  riskColor = 'text-red-600 dark:text-red-400';
                } else if ((clause.risk || '').toLowerCase().includes('moderate')) {
                  riskIcon = '🟠';
                  riskColor = 'text-orange-600 dark:text-orange-400';
                } else if ((clause.risk || '').toLowerCase().includes('review')) {
                  riskIcon = '🟡';
                  riskColor = 'text-yellow-600 dark:text-yellow-400';
                } else if ((clause.risk || '').toLowerCase().includes('safe')) {
                  riskIcon = '🟢';
                  riskColor = 'text-emerald-600 dark:text-emerald-400';
                }
                return (
                  <li
                    key={idx}
                    className={`flex items-center gap-3 ${riskColor} transition-colors rounded-lg px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900 focus-within:ring-2 focus-within:ring-emerald-400 animate-fadeInUp`}
                    tabIndex={0}
                    aria-label={`Clause ${clause.title ? clause.title : idx + 1}, ${riskLabels[(clause.risk || '').toLowerCase() || 'safe']}`}
                  >
                    <span className="text-xl">{riskIcon}</span>
                    <span className="font-semibold">
                      {clause.title ? `Clause: ${clause.title}` : `Clause ${idx + 1}`}
                    </span>
                    <span className="ml-2 text-sm font-medium">{riskLabels[(clause.risk || '').toLowerCase() || 'safe']}</span>
                    {/* Copy to Clipboard for clause text */}
                    <button
                      className="ml-auto px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all"
                      onClick={() => copyToClipboard(clause.text)}
                      aria-label={`Copy clause ${clause.title ? clause.title : idx + 1} to clipboard`}
                    >
                      📋 Copy
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Enhanced Modals */}
      {/* Glossary Popup */}
      {glossaryTerm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-modalPop" role="dialog" aria-modal="true" aria-label="Glossary term explanation">
          <div className="bg-white dark:bg-[#232946] rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onClick={() => setGlossaryTerm(null)}
              aria-label="Close glossary popup"
              tabIndex={0}
            >
              ×
            </button>
            <div className="text-xl font-bold mb-4 capitalize text-emerald-500">{glossaryTerm}</div>
            <div className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">{glossary[glossaryTerm]}</div>
          </div>
        </div>
      )}

      {/* Rewrite Clause Popup */}
      {rewriteResult !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-modalPop" role="dialog" aria-modal="true" aria-label="AI rewritten clause">
          <div className="bg-white dark:bg-[#232946] rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onClick={() => setRewriteResult(null)}
              aria-label="Close rewritten clause popup"
              tabIndex={0}
            >
              ×
            </button>
            <div ref={clausePdfRef}>
              <div className="text-xl font-bold mb-4 text-emerald-500">AI Rewritten Clause</div>
              {false ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">Rewriting clause...</span>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border">
                  <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-lg leading-relaxed">{rewriteResult}</pre>
                </div>
              )}
            </div>
            {/* Download as PDF button */}
            {!false && (
              <button
                className="mt-6 w-full px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-300"
                onClick={handleExportClausePDF}
                aria-label="Download rewritten clause as PDF"
                tabIndex={0}
              >
                📄 Download as PDF
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sticky PDF Export Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-full shadow-2xl text-lg font-bold flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all animate-fadeInUp"
        onClick={handleExportPDF}
        aria-label="Export report as PDF"
        style={{ boxShadow: '0 8px 32px 0 rgba(16,24,40,0.18)' }}
      >
        <span>📄</span>
        <span>Export PDF</span>
      </button>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className="fixed bottom-28 right-8 z-50 bg-gray-800 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg text-lg font-bold flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all animate-fadeInUp"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          ⬆️ Top
        </button>
      )}
    </main>
  );
} 
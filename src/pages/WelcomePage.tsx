import { useNavigate } from "react-router-dom";
import logo from '../../logo.jpg';

export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1f36] to-[#232946] text-white px-4 py-8">
      {/* Professional Header */}
      <div className="text-center mb-12">
        <h1 className="sr-only">ClauseHound: AI-powered contract risk analysis</h1>
        
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <img src={logo} alt="ClauseHound logo" className="w-16 h-16 animate-fadeInUp rounded-xl shadow-lg" />
          <h1 className="text-6xl md:text-7xl font-extrabold font-sans tracking-tight bg-gradient-to-r from-emerald-400 via-white to-emerald-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer animate-fadeInUp">
            ClauseHound
          </h1>
        </div>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl font-light mb-4 text-gray-200 animate-fadeInUp delay-100 text-center max-w-2xl leading-relaxed">
          AI-powered contract risk analysis for freelancers & agencies
        </p>
        
        {/* Value Proposition */}
        <div className="text-lg text-gray-300 animate-fadeInUp delay-200 text-center max-w-3xl leading-relaxed">
          <p className="mb-2">
            Get professional legal insights in minutes, not weeks
          </p>
          <p className="text-base text-gray-400">
            Upload your contract and receive comprehensive risk analysis, safer alternatives, and negotiation strategies
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full animate-fadeInUp delay-300">
        <div className="bg-white/10 dark:bg-gray-800/50 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/20 transition-shadow duration-200 hover:shadow-emerald-400/30 focus-within:shadow-emerald-400/40 outline-none animate-fadeInUp delay-300" tabIndex={0} role="region" aria-label="Risk Analysis feature card">
          <div className="text-3xl mb-3" aria-label="Risk Analysis" role="img">🔍</div>
          <h3 className="text-lg font-semibold mb-2 text-emerald-300">Risk Analysis</h3>
          <p className="text-sm text-gray-300">
            Identify high-risk clauses and understand their legal implications
          </p>
        </div>
        
        <div className="bg-white/10 dark:bg-gray-800/50 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/20 transition-shadow duration-200 hover:shadow-emerald-400/30 focus-within:shadow-emerald-400/40 outline-none animate-fadeInUp delay-400" tabIndex={0} role="region" aria-label="Safer Alternatives feature card">
          <div className="text-3xl mb-3" aria-label="Safer Alternatives" role="img">✍️</div>
          <h3 className="text-lg font-semibold mb-2 text-emerald-300">Safer Alternatives</h3>
          <p className="text-sm text-gray-300">
            Get professionally drafted replacement clauses that protect your interests
          </p>
        </div>
        
        <div className="bg-white/10 dark:bg-gray-800/50 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/20 transition-shadow duration-200 hover:shadow-emerald-400/30 focus-within:shadow-emerald-400/40 outline-none animate-fadeInUp delay-500" tabIndex={0} role="region" aria-label="Negotiation Strategy feature card">
          <div className="text-3xl mb-3" aria-label="Negotiation Strategy" role="img">💼</div>
          <h3 className="text-lg font-semibold mb-2 text-emerald-300">Negotiation Strategy</h3>
          <p className="text-sm text-gray-300">
            Receive actionable advice for contract negotiations and legal safeguards
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="animate-fadeInUp delay-400">
        <button
          className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-2xl shadow-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 transform hover:scale-105 text-xl flex items-center gap-3 focus:shadow-emerald-400/40 focus:ring-2"
          aria-label="Upload contract for analysis"
          onClick={() => navigate("/upload")}
        >
          <span role="img" aria-label="Upload">📄</span>
          <span>Upload Contract for Analysis</span>
          <span className="inline-block group-hover:animate-pulseArrow">➔</span>
          <span className="absolute left-0 right-0 bottom-0 h-1 bg-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></span>
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 text-center animate-fadeInUp delay-500">
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>Instant Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📱</span>
            <span>Mobile Friendly</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 text-center text-xs text-gray-500 max-w-2xl animate-fadeInUp delay-600">
        <p>
          ⚖️ ClauseHound provides AI-powered analysis for educational purposes. 
          For critical legal matters, always consult with a qualified attorney.
        </p>
      </div>
    </div>
  );
} 
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-1 mt-2" role="status" aria-label="Loading">
      <span className="inline-block w-3 h-3 bg-emerald-400 rounded-full animate-dotPulse"></span>
      <span className="inline-block w-3 h-3 bg-emerald-300 rounded-full animate-dotPulse delay-150"></span>
      <span className="inline-block w-3 h-3 bg-emerald-200 rounded-full animate-dotPulse delay-300"></span>
    </div>
  );
} 
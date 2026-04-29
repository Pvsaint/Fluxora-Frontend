import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import RecipientStreams from "../components/recipient/RecipientStreams";
import RecipientLoading from "../components/RecipientLoading";
import ZeroAccrualBanner from "../components/ZeroAccrualBanner";

export default function Recipient() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const balance: number = 22600.0;
  const activeStreams = 2;
  const totalAccrued = 43250.0;
  const totalWithdrawn = 20650.0;
  const walletConnected = true;
  const hasStreams = activeStreams > 0;

  // Zero-accrual: connected + streams exist + no withdrawable balance yet
  const isZeroAccrual = walletConnected && hasStreams && balance === 0;
  const disabled = !walletConnected || balance === 0;

  if (loading) return <RecipientLoading />;

  if (!walletConnected || !hasStreams) {
    return (
      <main aria-labelledby="recipient-page-title">
        <h1
          id="recipient-page-title"
          style={{ marginTop: 0, fontSize: "2rem", fontWeight: 700 }}
        >
          Your streams
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
          View your incoming streams and withdraw accrued USDC at any time.
        </p>
        <EmptyState variant="recipient" walletConnected={walletConnected} />
      </main>
    );
  }

  return (
    <main
      className="flex flex-col gap-10 max-w-7xl mx-auto px-4 py-8 animate-fade-in"
      aria-labelledby="recipient-page-title"
    >
      {/* ── Page Header ── */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h1
            id="recipient-page-title"
            className="text-4xl font-extrabold text-white tracking-tight"
          >
            Recipient Portal
          </h1>
          <p className="text-slate-500 font-medium max-w-md">
            Manage your incoming streams, track accrued balances, and withdraw
            USDC in real-time.
          </p>
        </div>

        {/* ── Overview Metrics ── */}
        <section aria-labelledby="overview-metrics-title">
          <h2 id="overview-metrics-title" className="sr-only">
            Overview metrics
          </h2>
          <dl
            className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 rounded-[2rem] bg-slate-900/50 border border-slate-800 backdrop-blur-sm"
            aria-label="Stream summary"
          >
            <div className="flex flex-col">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                Active Streams
              </dt>
              <dd className="text-xl font-black text-white" aria-label={`${activeStreams} active streams`}>
                {activeStreams}
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                Total Accrued
              </dt>
              <dd
                className="text-xl font-black text-emerald-500"
                aria-label={`${totalAccrued.toLocaleString()} USDC total accrued`}
              >
                {totalAccrued.toLocaleString()} USDC
              </dd>
            </div>
            <div className="flex flex-col hidden md:flex">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                Withdrawn
              </dt>
              <dd
                className="text-xl font-black text-slate-400"
                aria-label={`${totalWithdrawn.toLocaleString()} USDC withdrawn`}
              >
                {totalWithdrawn.toLocaleString()} USDC
              </dd>
            </div>
          </dl>
        </section>
      </header>

      {/* ── Withdrawable Balance Card ── */}
      <section
        aria-labelledby="balance-section-title"
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-slate-800 p-8 md:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
      >
        <h2 id="balance-section-title" className="sr-only">
          Withdrawable balance
        </h2>

        {/* Decorative background glow – hidden from AT */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -mr-32 -mt-32"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-4 text-center md:text-left">
            {/* Live-region badge */}
            <div
              className="inline-flex items-center gap-2 self-center md:self-start rounded-full bg-cyan-500/10 px-4 py-1.5 border border-cyan-500/20"
              aria-hidden="true"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                Available to Claim
              </span>
            </div>

            {/* Balance figure */}
            <div className="flex items-baseline gap-3 mb-2">
              <span
                className="text-6xl md:text-7xl font-black text-white tabular-nums tracking-tighter"
                aria-label={`${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC available to withdraw`}
              >
                {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span
                className="text-2xl font-bold text-slate-500 tracking-tight uppercase"
                aria-hidden="true"
              >
                USDC
              </span>
            </div>

            <p className="text-slate-400 font-medium max-w-sm">
              Your accumulated balance from all active streams across all DAOs.
              Funds are available for instant withdrawal to your connected
              wallet.
            </p>
          </div>

          {/* ── Zero-accrual banner (streams live, balance = 0) ── */}
          {isZeroAccrual && (
            <div style={{ marginBottom: "1.5rem" }}>
              <ZeroAccrualBanner
                reason="cliff"
                onAction={() => {
                  /* Navigate to streams page for cliff details */
                  window.location.href = "/app/streams";
                }}
                actionLabel="View stream details"
              />
            </div>
          )}

          {/* ── Withdraw Action ── */}
          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
            <button
              disabled={disabled}
              aria-disabled={disabled}
              aria-label={
                disabled
                  ? "Withdraw USDC – unavailable"
                  : `Withdraw ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC`
              }
              className={`
                group relative w-full md:w-[280px] py-6 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-black text-lg uppercase tracking-wider
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                ${
                  disabled
                    ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                    : "bg-cyan-500 text-white hover:scale-[1.03] hover:bg-cyan-400 shadow-[0_20px_40px_-10px_rgba(6,182,212,0.5)] active:scale-95 border-none"
                }
              `}
            >
              <span>Withdraw USDC</span>
              {!disabled && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="m11 5 7 7-7 7" />
                  <path d="M4 12h14" />
                </svg>
              )}
            </button>

            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secure On-Chain Transaction
            </p>
          </div>
        </div>
      </section>

      {/* ── Streams List ── */}
      <section aria-labelledby="streams-section-title" className="mt-4">
        <h2 id="streams-section-title" className="sr-only">
          Incoming streams
        </h2>
        <RecipientStreams />
      </section>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}

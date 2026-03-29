import type { VisualKind } from '../types/lesson'

type Props = { kind: VisualKind }

export function TeachVisual({ kind }: Props) {
  if (kind === 'none') return null

  return (
    <div className="teach-visual" aria-hidden>
      {kind === 'candle' && <CandleSimple />}
      {kind === 'candle-bull-bear' && <CandleBullBear />}
      {kind === 'option-contract' && <OptionContract />}
      {kind === 'call-payoff' && <CallPayoff />}
      {kind === 'put-payoff' && <PutPayoff />}
    </div>
  )
}

function CandleSimple() {
  return (
    <svg viewBox="0 0 120 140" className="teach-visual__svg">
      <text x="60" y="16" textAnchor="middle" className="teach-visual__label">
        One time slice
      </text>
      <line x1="60" y1="28" x2="60" y2="38" stroke="currentColor" strokeWidth="2" />
      <rect x="48" y="38" width="24" height="44" rx="2" fill="var(--viz-bull)" stroke="currentColor" />
      <line x1="60" y1="82" x2="60" y2="108" stroke="currentColor" strokeWidth="2" />
      <text x="8" y="52" className="teach-visual__tiny">
        High
      </text>
      <text x="8" y="78" className="teach-visual__tiny">
        Open / Close
      </text>
      <text x="8" y="112" className="teach-visual__tiny">
        Low
      </text>
    </svg>
  )
}

function CandleBullBear() {
  return (
    <svg viewBox="0 0 200 120" className="teach-visual__svg">
      <text x="50" y="16" textAnchor="middle" className="teach-visual__label">
        Bullish
      </text>
      <text x="150" y="16" textAnchor="middle" className="teach-visual__label">
        Bearish
      </text>
      <line x1="50" y1="28" x2="50" y2="40" stroke="currentColor" strokeWidth="2" />
      <rect x="40" y="40" width="20" height="50" rx="2" fill="var(--viz-bull)" stroke="currentColor" />
      <line x1="50" y1="90" x2="50" y2="100" stroke="currentColor" strokeWidth="2" />
      <line x1="150" y1="28" x2="150" y2="48" stroke="currentColor" strokeWidth="2" />
      <rect x="140" y="48" width="20" height="40" rx="2" fill="var(--viz-bear)" stroke="currentColor" />
      <line x1="150" y1="88" x2="150" y2="100" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function OptionContract() {
  return (
    <svg viewBox="0 0 220 100" className="teach-visual__svg">
      <rect x="20" y="24" width="180" height="52" rx="8" fill="var(--viz-card)" stroke="currentColor" strokeWidth="2" />
      <text x="110" y="48" textAnchor="middle" className="teach-visual__mid">
        Underlying · Strike · Expiry
      </text>
      <text x="110" y="68" textAnchor="middle" className="teach-visual__tiny">
        Premium in · Rights out
      </text>
    </svg>
  )
}

function CallPayoff() {
  return (
    <svg viewBox="0 0 220 120" className="teach-visual__svg">
      <text x="8" y="14" className="teach-visual__tiny">
        Long call (idea)
      </text>
      <line x1="30" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="20" x2="30" y2="100" stroke="currentColor" strokeWidth="1" />
      <polyline
        points="30,95 80,90 120,70 180,30"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
      />
      <text x="140" y="24" className="teach-visual__tiny">
        Upside (not to scale)
      </text>
    </svg>
  )
}

function PutPayoff() {
  return (
    <svg viewBox="0 0 220 120" className="teach-visual__svg">
      <text x="8" y="14" className="teach-visual__tiny">
        Long put (idea)
      </text>
      <line x1="30" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="20" x2="30" y2="100" stroke="currentColor" strokeWidth="1" />
      <polyline
        points="40,30 90,55 130,85 180,95"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
      />
      <text x="120" y="24" className="teach-visual__tiny">
        Downside protection idea
      </text>
    </svg>
  )
}

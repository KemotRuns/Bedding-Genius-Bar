import GlassCard from '../ui/GlassCard'
import type { SheetProduct, PillowProduct } from '../../lib/types'

interface BundleCardProps {
  suggestion: string
  sheet: SheetProduct
  pillow: PillowProduct
}

function BundleItem({ icon, label, detail }: { icon: React.ReactNode; label: string; detail: string }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-charcoal/6 last:border-0">
      <div className="w-8 h-8 rounded-full bg-sage/15 flex items-center justify-center flex-shrink-0 mt-0.5 text-sage-dark">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-charcoal font-medium">{detail}</p>
      </div>
    </div>
  )
}

const SheetsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 7H14" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const PillowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="5" width="14" height="6" rx="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const DuvetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="5" y="5" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
    <rect x="9" y="5" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
    <rect x="5" y="9" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
    <rect x="9" y="9" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
  </svg>
)

export default function BundleCard({ suggestion, sheet, pillow }: BundleCardProps) {
  return (
    <GlassCard className="p-7 bg-sage/5">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-charcoal/40">Your Complete Setup</h3>
      </div>
      <p className="text-sm text-charcoal/50 mb-4">Everything you need for the perfect night, curated together.</p>

      <div className="divide-y divide-charcoal/6">
        <BundleItem
          icon={<SheetsIcon />}
          label="Sheets"
          detail={`${sheet.name} — ${sheet.material}`}
        />
        <BundleItem
          icon={<PillowIcon />}
          label="Pillow"
          detail={`${pillow.name} — ${pillow.attributes.loft} Loft · ${pillow.attributes.firmness}`}
        />
        <BundleItem
          icon={<DuvetIcon />}
          label="Duvet Cover"
          detail={suggestion}
        />
      </div>

      <div className="mt-6 pt-4 border-t border-charcoal/8">
        <button
          disabled
          className="w-full py-3 rounded-xl text-sm font-medium bg-charcoal/8 text-charcoal/30 cursor-not-allowed"
          title="Coming soon"
        >
          Save This Prescription — Coming Soon
        </button>
        <p className="text-xs text-center text-charcoal/25 mt-2">Email delivery of your results is in development</p>
      </div>
    </GlassCard>
  )
}

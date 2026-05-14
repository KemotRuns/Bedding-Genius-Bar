import { useState, useRef } from 'react'
import GlassCard from '../ui/GlassCard'
import type { SheetProduct } from '../../lib/types'

interface FabricSimulatorProps {
  product: SheetProduct
}

function WeavePattern({ weave, material }: { weave: string; material: string }) {
  if (weave === 'Percale') {
    return (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="percale" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#e8e0d4"/>
            <rect x="0" y="0" width="4" height="4" fill="#d4c9bb" opacity="0.8"/>
            <rect x="4" y="4" width="4" height="4" fill="#d4c9bb" opacity="0.8"/>
            <rect x="1" y="0" width="2" height="4" fill="#c8bfb2" opacity="0.5"/>
            <rect x="5" y="4" width="2" height="4" fill="#c8bfb2" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#percale)"/>
      </svg>
    )
  }

  if (weave === 'Sateen') {
    return (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="sateen" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#ede5da"/>
            <ellipse cx="5" cy="5" rx="4" ry="1.5" fill="#d6ccc0" opacity="0.6"/>
            <ellipse cx="5" cy="5" rx="1.5" ry="4" fill="#cac0b4" opacity="0.4"/>
            <rect x="0" y="4" width="10" height="2" fill="#ddd5ca" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sateen)"/>
      </svg>
    )
  }

  if (material === 'Linen' || material === 'Flannel') {
    return (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="linen" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#dfd4c0"/>
            <line x1="0" y1="3" x2="6" y2="3" stroke="#c8bba8" strokeWidth="1.5"/>
            <line x1="3" y1="0" x2="3" y2="6" stroke="#c8bba8" strokeWidth="1.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#linen)"/>
      </svg>
    )
  }

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="plain" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="#e8e2d8"/>
          <rect x="0" y="0" width="2.5" height="2.5" fill="#ddd7cc" opacity="0.7"/>
          <rect x="2.5" y="2.5" width="2.5" height="2.5" fill="#ddd7cc" opacity="0.7"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#plain)"/>
    </svg>
  )
}

export default function FabricSimulator({ product }: FabricSimulatorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current!.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const LENS = 130

  return (
    <GlassCard className="p-7">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-charcoal/40">Fabric Feel Simulator</h3>
      </div>

      <p className="text-sm text-charcoal/50 mb-4 leading-relaxed">
        Hover over the weave to explore the {product.weave === 'N/A' ? product.material : product.weave} texture up close.
      </p>

      {/* Desktop magnifier */}
      <div
        ref={containerRef}
        className="hidden md:block relative rounded-xl overflow-hidden cursor-none h-48 select-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <div className="absolute inset-0">
          <WeavePattern weave={product.weave} material={product.material} />
        </div>

        <div className="absolute bottom-3 right-3 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-xs text-charcoal/60 font-medium">
            {product.material} · {product.weave === 'N/A' ? 'Plain' : product.weave} Weave
          </span>
        </div>

        {visible && (
          <div
            className="absolute pointer-events-none rounded-full border-2 border-white/80 shadow-glass overflow-hidden"
            style={{
              width: LENS,
              height: LENS,
              left: pos.x - LENS / 2,
              top: pos.y - LENS / 2,
            }}
          >
            {/* Zoomed weave — position so the cursor point maps to center of lens */}
            <div
              className="absolute"
              style={{
                width: '280%',
                height: '280%',
                left: `${50 - (pos.x / (containerRef.current?.offsetWidth ?? 200)) * 280}%`,
                top: `${50 - (pos.y / (containerRef.current?.offsetHeight ?? 192)) * 280}%`,
              }}
            >
              <WeavePattern weave={product.weave} material={product.material} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile: static */}
      <div className="md:hidden rounded-xl overflow-hidden h-28 relative">
        <div className="absolute inset-0">
          <WeavePattern weave={product.weave} material={product.material} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-charcoal/50 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
            {product.material} · {product.weave === 'N/A' ? 'Plain' : product.weave} Weave
          </span>
        </div>
      </div>

      <p className="text-xs text-charcoal/30 mt-3 text-center hidden md:block">Hover to explore weave at 2.8× zoom</p>
    </GlassCard>
  )
}

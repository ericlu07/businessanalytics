import { Activity } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — form */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-semibold text-lg">Pulse</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right panel — visual */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-sidebar relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-12 max-w-md">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
            <span className="text-sm text-primary font-medium">Live dashboard preview</span>
          </div>

          {/* Mini dashboard mockup */}
          <div className="bg-card/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 mb-8 text-left">
            <p className="text-xs text-white/50 mb-4 uppercase tracking-wider">Business Overview</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Revenue", value: "$8,240", change: "+12%" },
                { label: "Clients", value: "18", change: "+2" },
                { label: "Hours", value: "124h", change: "this month" },
                { label: "Margin", value: "34%", change: "✓ healthy" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-white/40 mb-1">{stat.label}</p>
                  <p className="font-heading font-600 text-white text-base">{stat.value}</p>
                  <p className="text-xs text-primary/80">{stat.change}</p>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-0.5 h-12">
              {[40, 55, 45, 70, 60, 85, 75, 90, 72, 88, 95, 82].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-primary/30 hover:bg-primary/50 transition-colors" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <blockquote className="text-sm text-white/60 italic">
            &ldquo;Finally replaced my 8-tab spreadsheet with something beautiful.&rdquo;
          </blockquote>
          <p className="text-xs text-white/40 mt-2">— Sarah K., Freelance Designer</p>
        </div>
      </div>
    </div>
  );
}

import { Info } from "lucide-react";

export function WalletCard({ label, value, tooltip }) {
  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1 ">
          <p className="text-sm text-secondary-foreground mb-1">{label}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
        <button
          className="p-1 hover:bg-muted rounded transition-colors shrink-0 ml-2"
          aria-label={tooltip || "More info"}
        >
          <Info className="size-4 text-secondary-foreground" />
        </button>
      </div>
    </div>
  );
}

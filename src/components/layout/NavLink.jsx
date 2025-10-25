import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NavLink({ to, children, icon: Icon, isAppsOpen = false, selectedApp = null }) {
  const location = useLocation();
  const isActive = location.pathname === to && !isAppsOpen && !selectedApp;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full transition-all text-xs sm:text-sm",
        isActive
          ? "bg-accent text-accent-foreground shadow-custom"
          : "bg-transparent text-foreground hover:bg-muted",
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded transition-all",
            isActive
              ? "bg-primary text-accent p-0.5 sm:p-1"
              : "text-secondary-foreground",
          )}
        >
          {typeof Icon === "string" ? (
            <img
              src={Icon}
              alt={children}
              className={cn(
                "size-3 sm:size-4 transition-all",
                isActive
                  ? "[filter:brightness(0)_saturate(100%)]"
                  : "[filter:brightness(0)_saturate(100%)_opacity(0.6)]"
              )}
            />
          ) : (
            <Icon className="size-3 sm:size-4" />
          )}
        </div>
      )}
      <span className="hidden sm:inline">{children}</span>
      <span className="inline sm:hidden text-[10px]">{children}</span>
    </Link>
  );
}

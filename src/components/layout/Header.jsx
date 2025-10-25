import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Home,
  BarChart3,
  DollarSign,
  Users,
  LayoutGrid,
  Bell,
  MessageSquare,
  Menu,
  Settings,
  ShoppingBag,
  Gift,
  Grid3x3,
  Bug,
  RefreshCw,
  LogOut,
  BookOpen,
  FileText,
  Image,
  DollarSign as Invoice,
  Calendar,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";

export function Header({
  userName = "John Doe",
  email = "john.doe@example.com",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const [showAllNav, setShowAllNav] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const location = useLocation();

  // Define all nav items including Apps
  const allNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: DollarSign, label: "Revenue", href: "/revenue" },
    { icon: Users, label: "CRM", href: "/crm" },
    { icon: LayoutGrid, label: "Apps", href: "#apps", isApps: true },
  ];

  const [navItemsOrder, setNavItemsOrder] = useState(allNavItems);

  useEffect(() => {
    setIsAppsOpen(false);
    setSelectedApp(null);
  }, [location.pathname]);

  const getInitials = (name) => {
    const words = name
      .trim()
      .split(" ")
      .filter((word) => word.length > 0);
    if (words.length === 0) return "";
    if (words.length === 1) return words[0][0].toUpperCase();

    // Always take first and last word, regardless of how many names
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const handleDropdownItemClick = (clickedItem) => {
    // Only perform swap on mobile/tablet (screen width < 1024px which is lg breakpoint)
    const isMobileOrTablet = window.innerWidth < 1024;

    if (isMobileOrTablet) {
      const clickedIndex = navItemsOrder.findIndex(
        (item) => item.href === clickedItem.href,
      );

      if (clickedIndex > 2) {
        // Swap with the last visible item (index 2)
        const newOrder = [...navItemsOrder];
        const temp = newOrder[2];
        newOrder[2] = newOrder[clickedIndex];
        newOrder[clickedIndex] = temp;
        setNavItemsOrder(newOrder);
      }
    }

    setShowAllNav(false);

    if (clickedItem.isApps) {
      setIsAppsOpen(!isAppsOpen);
    }
  };

  const mainNavItems = navItemsOrder;

  const appsOptions = [
    {
      icon: "./icons/app-bar-list.svg",
      label: "Link in Bio",
      description: "Manage your Link in Bio",
    },
    {
      icon: "./icons/store.svg",
      label: "Store",
      description: "Manage your Store activities",
    },
    {
      icon: "./icons/medkit.svg",
      label: "Media Kit",
      description: "Manage your Media Kit",
    },
    {
      icon: "./icons/invoice.svg",
      label: "Invoicing",
      description: "Manage your Invoices",
    },
    { icon: Calendar, label: "Bookings", description: "Manage your Bookings" },
  ];

  const menuItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: ShoppingBag, label: "Purchase History", href: "/purchase-history" },
    { icon: Gift, label: "Refer and Earn", href: "/refer" },
    { icon: Grid3x3, label: "Integrations", href: "/integrations" },
    { icon: Bug, label: "Report Bug", href: "/report-bug" },
    { icon: RefreshCw, label: "Switch Account", href: "/switch-account" },
    { icon: LogOut, label: "Sign Out", href: "/signout" },
  ];

  return (
    <header className="rounded-[100px] bg-background shadow-custom">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 shrink-0">
          <img src="/mainstack-logo.png" alt="Logo" />
        </div>

        <div className="flex items-center gap-0.5 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-2 2xl:gap-2 flex-1 justify-center">
          <div className="flex items-center gap-0.5 sm:gap-2 md:gap-2 lg:gap-2">
            {mainNavItems.slice(0, 3).map((item) => {
              if (item.isApps) {
                return (
                  <button
                    key={item.label}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAppsOpen(!isAppsOpen);
                    }}
                    className={cn(
                      "flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full transition-all text-xs sm:text-sm",
                      isAppsOpen || selectedApp
                        ? "bg-accent text-accent-foreground shadow-custom"
                        : "bg-transparent text-foreground hover:bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center rounded transition-all",
                        isAppsOpen || selectedApp
                          ? "bg-primary text-accent p-0.5 sm:p-1"
                          : "text-secondary-foreground",
                      )}
                    >
                      <item.icon className="size-3 sm:size-4" />
                    </div>
                    <span className="hidden sm:inline">
                      {selectedApp
                        ? `${item.label} | ${selectedApp}`
                        : item.label}
                    </span>
                    <span className="inline sm:hidden text-[10px]">
                      {selectedApp
                        ? `${item.label} | ${selectedApp}`
                        : item.label}
                    </span>
                    <ChevronDown className="size-3 sm:size-4 ml-0.5" />
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.href}
                  icon={item.icon}
                  isAppsOpen={isAppsOpen}
                  selectedApp={selectedApp}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {mainNavItems.length > 3 && (
            <div className="relative lg:hidden">
              <button
                onClick={() => setShowAllNav(!showAllNav)}
                className="flex items-center justify-center p-1 rounded-full bg-transparent text-foreground hover:bg-muted transition-all"
                aria-label="Show more navigation"
                title="Show more"
              >
                <ChevronRight
                  className={cn(
                    "size-4 transition-transform",
                    showAllNav && "rotate-90",
                  )}
                />
              </button>

              {showAllNav && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-popover rounded-lg shadow-custom border py-2 z-50">
                  {mainNavItems
                    .slice(3)
                    .filter((item) => !item.isApps)
                    .map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => handleDropdownItemClick(item)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <item.icon className="size-4 text-secondary-foreground" />
                        {item.label}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="hidden lg:flex items-center gap-2">
            {mainNavItems.slice(3).map((item) => {
              if (item.isApps) {
                return (
                  <button
                    key={item.label}
                    onClick={() => setIsAppsOpen(!isAppsOpen)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm",
                      isAppsOpen || selectedApp
                        ? "bg-accent text-accent-foreground shadow-custom"
                        : "bg-transparent text-foreground hover:bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center rounded transition-all",
                        isAppsOpen || selectedApp
                          ? "bg-primary text-accent p-1"
                          : "text-secondary-foreground",
                      )}
                    >
                      <item.icon className="size-4" />
                    </div>
                    <span>
                      {selectedApp
                        ? `${item.label} | ${selectedApp}`
                        : item.label}
                    </span>
                    <ChevronDown className="size-4 ml-0.5" />
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.href}
                  icon={item.icon}
                  isAppsOpen={isAppsOpen}
                  selectedApp={selectedApp}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {isAppsOpen && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-popover rounded-lg shadow-custom border py-4 px-4 z-50">
              <div className="space-y-3">
                {appsOptions.map((app) => (
                  <div
                    key={app.label}
                    onClick={() => {
                      setSelectedApp(app.label);
                      setIsAppsOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:shadow-app hover:border-border  transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-center rounded bg-primary p-2 shrink-0">
                      {typeof app.icon === "string" ? (
                        <img
                          src={app.icon}
                          alt={app.label}
                          className="size-5"
                        />
                      ) : (
                        <app.icon className="size-5 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 hover:-ml-1
                      ">
                      <p className="font-medium text-sm text-popover-foreground">
                        {app.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.description}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-popover-foreground transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            className="hidden sm:flex p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Notifications"
          >
            <Bell className="size-5 text-secondary-foreground" />
          </button>

          <button
            className="hidden sm:flex p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Messages"
          >
            <MessageSquare className="size-5 text-secondary-foreground" />
          </button>

          {/* User Initials */}
          <div className="flex items-center gap-1 sm:gap-2   bg-secondary-foreground/8 border-accent rounded-[100px]">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] sm:text-sm font-medium">
              {getInitials(userName)}
            </div>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 sm:p-2 hover:bg-muted rounded-md transition-colors relative"
              aria-label="Menu"
            >
              <Menu className="size-4 sm:size-5 text-secondary-foreground" />

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-6 w-56 sm:w-64 bg-popover rounded-lg shadow-custom border py-2 z-50 ">
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                        {getInitials(userName)}
                      </div>
                      <div className="flex flex-col text-start">
                        <span className="font-semibold text-sm text-popover-foreground">
                          {userName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    {menuItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                          item.label === "Sign Out" && "border-t mt-2",
                        )}
                      >
                        <item.icon className="size-4 text-secondary-foreground" />
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

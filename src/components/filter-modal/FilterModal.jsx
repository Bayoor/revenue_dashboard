import { useState } from "react";
import { format, subDays, startOfMonth, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

const FilterModal = ({ onApplyFilter, filteredCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState({
    successful: false,
    failed: false,
    pending: false,
  });

  const dateRangeOptions = [
    "Today",
    "Last 7 days",
    "This month",
    "Last 3 months",
  ];

  const statusOptions = [
    { id: "successful", label: "Successful" },
    { id: "failed", label: "Failed" },
    { id: "pending", label: "Pending" },
  ];

  const handleDateRangeClick = (option) => {
    setSelectedDateRange(option);
    const today = new Date();

    if (option === "Today") {
      setStartDate(today);
      setEndDate(today);
    } else if (option === "Last 7 days") {
      setStartDate(subDays(today, 6));
      setEndDate(today);
    } else if (option === "This month") {
      setStartDate(startOfMonth(today));
      setEndDate(today);
    } else if (option === "Last 3 months") {
      setStartDate(subMonths(today, 3));
      setEndDate(today);
    }
  };

  const handleStatusToggle = (id) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClear = () => {
    setSelectedDateRange("");
    setStartDate(null);
    setEndDate(null);
    setSelectedStatuses({
      successful: false,
      failed: false,
      pending: false,
    });

    if (onApplyFilter) {
      onApplyFilter({ startDate: null, endDate: null, statuses: [] });
    }
  };

  const handleApply = () => {
    const selectedStatusArray = Object.entries(selectedStatuses)
      .filter(([_, isSelected]) => isSelected)
      .map(([status]) => status);

    if (onApplyFilter) {
      onApplyFilter({ startDate, endDate, statuses: selectedStatusArray });
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsTypeDropdownOpen(false);
    setIsStartDateOpen(false);
    setIsEndDateOpen(false);
  };

  const getSelectedStatusesText = () => {
    const selected = Object.entries(selectedStatuses)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => statusOptions.find((s) => s.id === key)?.label)
      .join(", ");

    if (selected.length === 0) return "Select an option";
    return selected.length > 50 ? selected.substring(0, 50) + "..." : selected;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 rounded-full px-6 h-10 font-semibold hover:bg-secondary-foreground hover:text-foreground"
        >
          Filter
          {filteredCount !== null && (
            <span className="ml-1">{filteredCount}</span>
          )}
          <ChevronDown className="size-4 text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn("sm:max-w-[425px] flex flex-col max-h-[85vh]")}
      >
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 -mx-6 px-6 space-y-6">
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {dateRangeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleDateRangeClick(option)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-[100px] transition-colors border border-primary",
                    selectedDateRange === option
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground hover:bg-secondary-foreground/10",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-semibold text-foreground">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <button
                  onClick={() => {
                    setIsStartDateOpen(!isStartDateOpen);
                    setIsEndDateOpen(false);
                  }}
                  className={cn(
                    "relative w-full px-3 py-2.5 border border-border rounded-md bg-background text-sm text-left hover:bg-secondary/50 transition-[color,box-shadow] outline-none focus-visible:border-foreground focus-visible:ring-foreground/90 focus-visible:ring-[3px]",
                    !startDate && "text-secondary-foreground",
                  )}
                >
                  {startDate
                    ? format(startDate, "dd MMM yyyy")
                    : "Select a date"}
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-secondary-foreground" />
                </button>
                {isStartDateOpen && (
                  <div className="absolute top-full left-0 mt-2 z-50 bg-popover border border-border rounded-md shadow-lg">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date);
                          setIsStartDateOpen(false);
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      captionLayout="dropdown"
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear()}
                      initialFocus
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setIsEndDateOpen(!isEndDateOpen);
                    setIsStartDateOpen(false);
                  }}
                  className={cn(
                    "relative w-full px-3 py-2.5 border border-border rounded-md bg-background text-sm text-left hover:bg-secondary/50 transition-[color,box-shadow] outline-none focus-visible:border-foreground focus-visible:ring-foreground/90 focus-visible:ring-[3px]",
                    !endDate && "text-secondary-foreground",
                  )}
                >
                  {endDate ? format(endDate, "dd MMM yyyy") : "Select a date"}
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-secondary-foreground" />
                </button>
                {isEndDateOpen && (
                  <div className="absolute top-full right-0 mt-2 z-50 bg-popover border border-border rounded-md shadow-lg">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        if (date) {
                          setEndDate(date);
                          setIsEndDateOpen(false);
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      captionLayout="dropdown"
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear()}
                      initialFocus
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Transaction Status
            </label>

            <button
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-border rounded-md bg-background hover:bg-secondary/50 transition-[color,box-shadow] outline-none focus-visible:border-foreground focus-visible:ring-foreground/90 focus-visible:ring-[3px]"
            >
              <span className="text-sm text-foreground truncate">
                {getSelectedStatusesText()}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-secondary-foreground transition-transform",
                  isTypeDropdownOpen && "rotate-180",
                )}
              />
            </button>

            {isTypeDropdownOpen && (
              <div className="space-y-2.5 pt-2">
                {statusOptions.map((status) => (
                  <label
                    key={status.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedStatuses[status.id]}
                      onCheckedChange={() => handleStatusToggle(status.id)}
                      className="bg-background text-foreground"
                    />
                    <span className="text-sm text-foreground">
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4 border-t mt-0">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex-1 rounded-[100px] hover:bg-secondary hover:text-foreground"
          >
            Clear
          </Button>
          <Button
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="flex-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;

import { useState } from "react";
import { TransactionItem } from "./TransactionItem";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import FilterModal from "../filter-modal/FilterModal";
import { useFetch } from "../../hooks/useFetch";
import { getAllTransactions } from "../../services/user";

export function TransactionList() {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    statuses: []
  });

  const {
    data: transactions,
    loading,
    error,
  } = useFetch(() => getAllTransactions(), true);

  if (loading) {
    return <div className="mt-8 text-center">Loading transactions...</div>;
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">Error: {error}</div>;
  }

  // Simple filter function
  const filterTransactions = (transactions) => {
    let filtered = transactions;

    // Step 1: Filter by date if date range is selected
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);

        // Set time to start of day for comparison
        transactionDate.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return transactionDate >= start && transactionDate <= end;
      });
    }

    // Step 2: Filter by status if any status is selected
    if (filters.statuses.length > 0) {
      filtered = filtered.filter((transaction) => {
        return filters.statuses.includes(transaction.status);
      });
    }

    return filtered;
  };

  const filteredTransactions = filterTransactions(transactions || []);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6 border-b  border-primary pb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {filteredTransactions?.length || 0} Transactions
          </h2>
          <p className="text-sm text-secondary-foreground mt-1 ">
            Your transactions {filters.startDate ? "for the selected date range" : "for the last 7 days"}
          </p>
        </div>

        {/* Filter and Export buttons */}
        <div className="flex items-center gap-3">
          <FilterModal
            onApplyFilter={setFilters}
            filteredCount={filters.startDate || filters.statuses.length > 0 ? filteredTransactions?.length : null}
          />
          <Button variant="outline" className="gap-2 hover:text-foreground rounded-[100px] w-[139px] h-12 font-semibold">
            Export list
            <Download className="size-4" />
          </Button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-1">
        {filteredTransactions?.map((transaction, index) => {
          if (transaction.type === "withdrawal") {
            return (
              <TransactionItem
                key={transaction.payment_reference || index}
                title="Cash withdrawal"
                recipient=""
                amount={`USD ${transaction.amount}`}
                date={transaction.date}
                status={transaction.status}
                type={transaction.type}
              />
            );
          }

          // Handle deposit transactions (has metadata)
          return (
            <TransactionItem
              key={transaction.payment_reference}
              title={transaction.metadata?.product_name || transaction.metadata?.type || "Payment"}
              recipient={transaction.metadata?.name || ""}
              amount={`USD ${transaction.amount}`}
              date={transaction.date}
              status={transaction.status}
              type={transaction.type}
            />
          );
        })}
      </div>
    </div>
  );
}

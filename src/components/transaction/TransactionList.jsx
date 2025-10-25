import { useState } from "react";
import { TransactionItem } from "./TransactionItem";
import { Button } from "@/components/ui/button";
import { NotFound } from "@/components/ui/not-found";
import { Download, Receipt } from "lucide-react";
import FilterModal from "../filter-modal/FilterModal";
import { useFetch } from "../../hooks/useFetch";
import { getAllTransactions } from "../../services/user";

export function TransactionList() {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    statuses: [],
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

  const filterTransactions = (transactions) => {
    let filtered = transactions;

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

    if (filters.statuses.length > 0) {
      filtered = filtered.filter((transaction) => {
        return filters.statuses.includes(transaction.status);
      });
    }

    return filtered;
  };

  const filteredTransactions = filterTransactions(transactions || []);

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 border-b border-primary pb-4 sm:pb-6 gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {filteredTransactions?.length || 0} Transactions
          </h2>
          <p className="text-xs sm:text-sm text-secondary-foreground mt-0.5 sm:mt-1">
            Your transactions{" "}
            {filters.startDate
              ? "for the selected date range"
              : "for the last 7 days"}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <FilterModal
            onApplyFilter={setFilters}
            filteredCount={
              filters.startDate || filters.statuses.length > 0
                ? filteredTransactions?.length
                : null
            }
          />
          <Button
            variant="outline"
            className="gap-1.5 sm:gap-2 hover:text-foreground rounded-[100px] px-4 sm:px-6 h-10 sm:h-12 text-xs sm:text-sm font-semibold whitespace-nowrap"
          >
            Export list
            <Download className="size-3 sm:size-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-0.5 sm:space-y-1">
        {filteredTransactions?.length === 0 ? (
          <NotFound
            title="No transactions found"
            message={
              filters.startDate || filters.statuses.length > 0
                ? "No transactions match your current filters. Try adjusting your date range or status filters."
                : "You don't have any transactions yet. Transactions will appear here once you start receiving payments."
            }
            icon={Receipt}
          />
        ) : (
          filteredTransactions?.map((transaction, index) => {
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

            return (
              <TransactionItem
                key={transaction.payment_reference}
                title={
                  transaction.metadata?.product_name ||
                  transaction.metadata?.type ||
                  "Payment"
                }
                recipient={transaction.metadata?.name || ""}
                amount={`USD ${transaction.amount}`}
                date={transaction.date}
                status={transaction.status}
                type={transaction.type}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

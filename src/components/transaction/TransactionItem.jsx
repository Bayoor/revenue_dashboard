import { MoveUpRight, MoveDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function TransactionItem({
  title,
  recipient,
  amount,
  date,
  status = "completed",
  type = "payment",
}) {
  const isWithdrawal = type === "withdrawal";
  const isPending = status === "pending";
  const isSuccessful = status === "successful";

  return (
    <div className="flex items-center justify-between py-2.5 sm:py-3 md:py-4 hover:bg-secondary-foreground/5 hover:px-2 sm:hover:px-3 transition-colors rounded-lg">
      <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
        <div
          className={cn(
            "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0",
            isWithdrawal && isPending && "bg-orange-100",
            isWithdrawal && isSuccessful && "bg-orange-100",
            !isWithdrawal && "bg-green-100",
          )}
        >
          {isWithdrawal ? (
            <MoveUpRight className="size-4 sm:size-5 text-[#961100]" strokeWidth={1}/>
          ) : (
            <MoveDownLeft className="size-4 sm:size-5 text-[#075132]" strokeWidth={1} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm sm:text-base font-medium text-foreground truncate">{title}</p>
          <p
            className={cn(
              "text-xs sm:text-sm mt-0.5",
              isPending && "text-orange-600",
              isSuccessful && "text-green-600",
              !isPending && !isSuccessful && "text-secondary-foreground",
            )}
          >
            {isPending ? "Pending" : isSuccessful ? "Successful" : recipient}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0 ml-2">
        <p className="text-sm sm:text-base font-bold text-foreground">{amount}</p>
        <p className="text-xs sm:text-sm text-secondary-foreground mt-0.5 sm:mt-1">{date}</p>
      </div>
    </div>
  );
}

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
    <div className="flex items-center justify-between py-4  hover:bg-secondary-foreground/5
     hover:px-3 transition-colors rounded-lg">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isWithdrawal && isPending && "bg-orange-100",
            isWithdrawal && isSuccessful && "bg-orange-100",
            !isWithdrawal && "bg-green-100",
          )}
        >
          {isWithdrawal ? (
            <MoveUpRight className="size-5 text-[#961100]" strokeWidth={1}/>
          ) : (
            <MoveDownLeft className="size-5 text-[#075132]" strokeWidth={1} />
          )}
        </div>

        <div>
          <p className="text-base font-medium text-foreground">{title}</p>
          <p
            className={cn(
              "text-sm mt-0.5",
              isPending && "text-orange-600",
              isSuccessful && "text-green-600",
              !isPending && !isSuccessful && "text-secondary-foreground",
            )}
          >
            {isPending ? "Pending" : isSuccessful ? "Successful" : recipient}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-base font-bold text-foreground">{amount}</p>
        <p className="text-sm text-secondary-foreground mt-1">{date}</p>
      </div>
    </div>
  );
}

import { FileX2 } from "lucide-react";

export function NotFound({
  title = "No data found",
  message = "There are no items to display at the moment.",
  icon: Icon = FileX2
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="size-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-secondary-foreground text-center max-w-md">
        {message}
      </p>
    </div>
  );
}

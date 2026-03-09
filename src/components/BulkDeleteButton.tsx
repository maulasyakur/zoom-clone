import { Trash } from "lucide-react";
import { useState } from "react";
import type { Table } from "@tanstack/react-table";

import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useMeetings } from "@/lib/hooks";

interface BulkDeleteButtonProps<TData> {
  table: Table<TData>;
}

export function BulkDeleteButton<TData>({
  table,
}: BulkDeleteButtonProps<TData>) {
  const [open, setOpen] = useState(false);
  const { removeMeetings } = useMeetings();

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  // no rows selected -> don't render anything (parent may also guard)
  if (selectedRows.length === 0) {
    return null;
  }

  function handleDelete() {
    const ids = selectedRows.map((row) => (row.original as any).id);
    removeMeetings(ids);

    // clear selection after deleting
    table.resetRowSelection();
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="h-4 w-4" /> Delete ({selectedRows.length})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {selectedRows.length}{" "}
            {selectedRows.length === 1 ? "meeting" : "meetings"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

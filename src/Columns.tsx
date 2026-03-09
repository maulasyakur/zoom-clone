"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Button } from "./components/ui/button";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Checkbox } from "./components/ui/checkbox";
import { DataTableColumnHeader } from "./components/DataTableColumnHeader";
import { Badge } from "./components/ui/badge";
import { Check, Clock, Cross, FilterIcon } from "lucide-react";
import { toast } from "sonner";
import DeleteMeetingAlertDialog from "./components/DeleteMeetingAlertDialog";
import { useState } from "react";
import EditMeetingDialog from "./components/EditMeetingDialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Meeting = {
  id: string;
  name: string;
  status: "scheduled" | "finished" | "canceled";
  scheduled_at: string;
};

export const columns: ColumnDef<Meeting>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Name"
          className="text-left"
        />
      );
    },
  },
  {
    accessorKey: "status",
    // the header now renders a dropdown button so users can filter by status
    header: ({ column }) => {
      // clicking each item will set the column filter to that value;
      // the default filter function is `includesString` so this works fine
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="-ml-3 h-8">
              Status <FilterIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => column.setFilterValue("scheduled")}
            >
              <Badge>
                <Clock />
                Scheduled
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.setFilterValue("finished")}>
              <Badge variant={"success"}>
                <Check />
                Finished
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.setFilterValue("canceled")}>
              <Badge variant={"destructive"}>
                <Cross />
                Canceled
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.setFilterValue("")}>
              Clear
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ row }) => {
      const badgeMap: Record<
        string,
        {
          text: string;
          variant: "default" | "success" | "destructive";
          icon: React.ReactNode;
        }
      > = {
        scheduled: { text: "Scheduled", variant: "default", icon: <Clock /> },
        finished: { text: "Finished", variant: "success", icon: <Check /> },
        canceled: { text: "Canceled", variant: "destructive", icon: <Cross /> },
      };

      return (
        <Badge
          className="flex items-center gap-1"
          variant={badgeMap[row.original.status].variant}
        >
          {badgeMap[row.original.status].icon}
          {badgeMap[row.original.status].text}
        </Badge>
      );
    },
  },
  {
    accessorKey: "scheduled_at",
    header: ({ column }) => (
      <div className="flex justify-end items-center">
        <DataTableColumnHeader column={column} title="Scheduled At" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-1">
              <FilterIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => column.setFilterValue("today")}>
              Today
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.setFilterValue("tomorrow")}>
              Tomorrow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.setFilterValue("upcoming")}>
              Upcoming (all)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.setFilterValue("past")}>
              Past (all)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.setFilterValue("")}>
              Clear
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    cell: ({ row }) => {
      const scheduledAt = row.getValue("scheduled_at") as string;
      return (
        <div className="text-right">
          {new Date(scheduledAt).toLocaleString()}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const scheduledAt = new Date(row.getValue(columnId));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);
      switch (filterValue) {
        case "today":
          return scheduledAt >= today && scheduledAt < tomorrow;
        case "tomorrow":
          return scheduledAt >= tomorrow && scheduledAt < endOfTomorrow;
        case "upcoming":
          return scheduledAt >= endOfTomorrow;
        case "past":
          return scheduledAt < today;
        default:
          return true;
      }
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = new Date(rowA.getValue(columnId));
      const b = new Date(rowB.getValue(columnId));
      return a.getTime() - b.getTime();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [openDelete, setOpenDeleteChange] = useState(false);
      const [openEdit, setOpenEditChange] = useState(false);

      const payment = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <HugeiconsIcon icon={MoreHorizontalIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(payment.id.toString());
                  toast.success("Meeting ID copied to clipboard");
                }}
              >
                Copy meeting ID
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`https://meet.jit.si/${payment.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Meeting
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenEditChange(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setOpenDeleteChange(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteMeetingAlertDialog
            open={openDelete}
            onOpenChange={setOpenDeleteChange}
            meetingId={payment.id}
          />
          <EditMeetingDialog
            open={openEdit}
            setOpenChange={setOpenEditChange}
            meetingId={payment.id}
            initialName={payment.name}
            initialScheduledAt={payment.scheduled_at}
            initialStatus={payment.status}
          />
        </>
      );
    },
  },
];

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMeetings } from "@/lib/hooks";
import { toast } from "sonner";

type DeleteMeetingAlertDialogProps = {
  meetingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteMeetingAlertDialog({
  meetingId,
  open,
  onOpenChange,
}: DeleteMeetingAlertDialogProps) {
  const { removeMeeting } = useMeetings();
  async function handleDelete() {
    removeMeeting(meetingId);
    toast.success("Meeting deleted successfully");
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this meeting?
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

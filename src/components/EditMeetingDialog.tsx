import EditMeetingForm from "./EditMeetingForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type EditMeetingDialogProps = {
  open: boolean;
  setOpenChange: (open: boolean) => void;
  meetingId: string;
  initialName: string;
  initialScheduledAt: string;
  initialStatus: "scheduled" | "finished" | "canceled";
};

export default function EditMeetingDialog({
  open,
  setOpenChange,
  meetingId,
  initialName,
  initialScheduledAt,
  initialStatus,
}: EditMeetingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit meeting: {initialName}</DialogTitle>
          <DialogDescription>
            Make changes to your meeting details below.
          </DialogDescription>
        </DialogHeader>
        <EditMeetingForm
          meetingId={meetingId}
          initialName={initialName}
          initialScheduledAt={initialScheduledAt}
          initialStatus={initialStatus}
        />
      </DialogContent>
    </Dialog>
  );
}

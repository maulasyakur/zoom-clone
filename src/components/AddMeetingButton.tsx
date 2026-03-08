import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import AddMeetingForm from "./AddMeetingForm";

export default function AddMeetingButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Meeting
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <AddMeetingForm />
      </DialogContent>
    </Dialog>
  );
}

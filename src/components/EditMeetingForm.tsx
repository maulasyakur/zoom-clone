import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useMeetings } from "@/lib/hooks";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { formatDateForInput, parseLocalDateTimeString } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  scheduled_at: z
    .date("Scheduled date is required")
    .refine(
      (date) => date > new Date(),
      "Scheduled date must be in the future",
    ),
  status: z.enum(["scheduled", "finished", "canceled"]),
});

type EditMeetingFormProps = {
  meetingId: string;
  initialName: string;
  initialScheduledAt: string;
  initialStatus: "scheduled" | "finished" | "canceled";
};

export default function EditMeetingForm({
  meetingId,
  initialName,
  initialScheduledAt,
  initialStatus,
}: EditMeetingFormProps) {
  const { updateMeeting } = useMeetings();
  const form = useForm({
    defaultValues: {
      name: initialName,
      scheduled_at: new Date(initialScheduledAt),
      status: initialStatus,
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Meeting updated successfully");
      updateMeeting(meetingId, {
        name: value.name,
        status: value.status,
        scheduled_at: value.scheduled_at.toISOString(),
      });
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Meeting Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Business Strategy 1"
                  autoComplete="off"
                />
                <FieldDescription>
                  Provide a name for your meeting.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="scheduled_at"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Scheduled At</FieldLabel>
                <Input
                  type="datetime-local"
                  id={field.name}
                  name={field.name}
                  value={formatDateForInput(field.state.value)}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      parseLocalDateTimeString(e.target.value) || new Date(),
                    )
                  }
                  aria-invalid={isInvalid}
                />
                <FieldDescription>
                  Set a date and time for your meeting.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="status"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(
                      value as "scheduled" | "finished" | "canceled",
                    )
                  }
                >
                  <SelectTrigger aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Field>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? <Spinner /> : "Edit Meeting"}
              </Button>
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}

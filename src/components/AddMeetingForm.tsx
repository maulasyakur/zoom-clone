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

// Helper function to convert datetime-local string to local Date object
function parseLocalDateTimeString(dateTimeString: string): Date | null {
  if (!dateTimeString) return null;

  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Create date with local timezone
  return new Date(year, month - 1, day, hour, minute);
}

// Helper function to format Date object for datetime-local input
function formatDateForInput(date: Date | null): string {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  scheduled_at: z
    .date("Scheduled date is required")
    .refine(
      (date) => date > new Date(),
      "Scheduled date must be in the future",
    ),
});

export default function AddMeetingForm() {
  const { addMeeting } = useMeetings();
  const form = useForm({
    defaultValues: {
      name: "",
      scheduled_at: new Date(),
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Meeting added successfully");
      addMeeting({
        id: crypto.randomUUID(),
        name: value.name,
        status: "scheduled",
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
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Field>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? <Spinner /> : "Schedule Meeting"}
              </Button>
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}

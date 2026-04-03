import { columns } from "./Columns";
import { DataTable } from "./components/DataTable";
import { useMeetings } from "./lib/hooks";

export default function Home() {
  const { meetings } = useMeetings();

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Hi!👋 Let's schedule a meeting for today!
        </h1>
        <p className="text-muted-foreground">
          Add a meeting by clicking the "Add Meeting" button on the right.
        </p>
      </div>
      <DataTable columns={columns} data={meetings} />
    </div>
  );
}

import { columns, type Payment } from "./Columns";
import { DataTable } from "./DataTable";
import data from "@/data.json";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data as Payment[]} />
    </div>
  );
}

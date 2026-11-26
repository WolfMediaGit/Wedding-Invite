import Invitation from "@/components/Invitation";
import { wedding } from "@/lib/config";

export default function Page() {
  return (
    <main>
      <h1 className="sr-only">
        {wedding.groom} weds {wedding.bride}
      </h1>
      <Invitation />
    </main>
  );
}

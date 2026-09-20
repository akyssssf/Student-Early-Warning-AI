import { Card } from "@/components/ui/Card";
import InterventionList from "./InterventionList";
import InterventionForm from "./InterventionForm";

export default function InterventionPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Catatan Tindak Lanjut</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola catatan, rekomendasi, dan rencana tindak lanjut mahasiswa berisiko.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <Card>
          <h2 className="mb-4 text-lg font-bold">Riwayat Catatan</h2>
          <InterventionList />
        </Card>
        <InterventionForm />
      </div>
    </section>
  );
}
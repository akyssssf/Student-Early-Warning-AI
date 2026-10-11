import type { Metadata } from "next";
import InterventionPage from "@/components/intervention/InterventionPage";

export const metadata: Metadata = {
  title: "Tindak Lanjut | Student Early Warning AI",
};

export default function IntervensiPage() {
  return <InterventionPage />;
}
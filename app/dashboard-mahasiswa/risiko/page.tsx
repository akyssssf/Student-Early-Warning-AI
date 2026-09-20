import type { Metadata } from "next";
import StudentRisk from "@/components/student/StudentRisk";

export const metadata: Metadata = { title: "Status Risiko | Student Early Warning AI" };

export default function StudentRiskPage() {
  return <StudentRisk />;
}

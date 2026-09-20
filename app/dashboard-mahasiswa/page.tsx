import type { Metadata } from "next";
import StudentDashboard from "@/components/student/StudentDashboard";

export const metadata: Metadata = {
  title: "Dashboard Mahasiswa | Student Early Warning AI",
  description: "Dashboard mahasiswa untuk melihat kondisi akademik dan status risiko.",
};

export default function StudentDashboardPage() {
  return <StudentDashboard />;
}

import type { Metadata } from "next";
import StudentRecommendations from "@/components/student/StudentRecommendations";

export const metadata: Metadata = { title: "Rekomendasi | Student Early Warning AI" };

export default function StudentRecommendationsPage() {
  return <StudentRecommendations />;
}

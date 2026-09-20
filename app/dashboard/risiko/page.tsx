import type { Metadata } from "next";
import RiskPage from "@/components/risk/RiskPage";

export const metadata: Metadata = {
  title: "Risk Score | Student Early Warning AI",
};

export default function RisikoPage() {
  return <RiskPage />;
}
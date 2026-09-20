import StudentShell from "@/components/layout/StudentShell";

export default function StudentDashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <StudentShell>{children}</StudentShell>;
}

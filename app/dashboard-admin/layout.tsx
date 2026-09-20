import RoleShell from "@/components/layout/RoleShell";
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <RoleShell role="admin">{children}</RoleShell>; }

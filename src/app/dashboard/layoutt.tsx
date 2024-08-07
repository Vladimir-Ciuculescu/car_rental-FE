// src/app/dashboard/layout.tsx
import ProtectedLayout from "@/app/protected-layout";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedLayout>{children}</ProtectedLayout>
);

export default DashboardLayout;

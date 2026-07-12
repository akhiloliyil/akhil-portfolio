import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "AK Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AkAdminPage() {
  return <AdminApp />;
}

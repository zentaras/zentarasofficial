import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

const ADMIN_IDS = (process.env.ADMIN_CLERK_IDS ?? "").split(",").map(s => s.trim());

export default async function AdminPage() {
  const user = await currentUser();

  if (!user || !ADMIN_IDS.includes(user.id)) {
    redirect("/");
  }

  return <AdminDashboardClient />;
}
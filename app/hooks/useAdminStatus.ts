// app/hooks/useAdminStatus.ts
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function useAdminStatus() {
  const { user } = useUser();
  const userId = user?.id;

  const isAdmin = userId ? useQuery(api.admins.checkAdmin, { userId }) : undefined;

  return isAdmin;
}

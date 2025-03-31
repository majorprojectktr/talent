"use client";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

const Admin = () => {
  const store = useMutation(api.users.store);
  useEffect(() => {
    const storeUser = async () => {
      await store({ role: "freelancer" });
    };
    storeUser();
  }, [store]);

  return <div>Admin</div>;
};

export default Admin;

"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast"; // Importing toast for notifications

interface FormData {
  userId: string;
  email: string;
}

const AdminFormPage = () => {
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    email: "",
  });

  // Initialize the mutation
  const makeAdmin = useMutation(api.admins.makeAdmin);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !formData.email) {
      toast.error("Both userId and email are required");
      return;
    }

    try {
      await makeAdmin(formData);
      toast.success("Admin added successfully");

      setFormData({
        userId: "",
        email: "",
      });
    } catch (error) {
      toast.error("Failed to add admin");
      console.error("Add admin error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 max-w-md w-full">
        <h1 className="mb-5 text-3xl font-bold text-blue-600">Make Admin Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
              User ID
            </label>
            <input type="text" name="userId" value={formData.userId} required onChange={handleChange} id="userId" placeholder="Enter user ID" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" autoComplete="off" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input type="email" name="email" value={formData.email} required onChange={handleChange} id="email" placeholder="Enter email" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" autoComplete="off" />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Make Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFormPage;

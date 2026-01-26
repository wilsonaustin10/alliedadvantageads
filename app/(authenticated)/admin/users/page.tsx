"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import Link from "next/link";

interface UserRecord {
  uid: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  accessLevel: string;
  emailVerified: boolean | null;
  emailVerifiedAt: string | null;
  onboardingCompleted: boolean;
  inviteCodeUsed: string | null;
  createdAt: string | null;
  isActive: boolean;
}

export default function AdminUsersPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();

  // Check admin access
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
        return;
      }

      setCurrentUser(user);

      // Verify admin access
      try {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.accessLevel !== "admin") {
            router.push("/home-portal");
            return;
          }
        } else {
          router.push("/home-portal");
          return;
        }
      } catch (err) {
        console.error("Error checking admin access:", err);
        router.push("/home-portal");
        return;
      }

      // Load users
      await fetchUsers(user);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUsers = async (user: User) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to load users");
        setLoading(false);
        return;
      }

      setUsers(data.users);
      setLoading(false);
    } catch (err) {
      setError("Failed to load users");
      setLoading(false);
    }
  };

  const updateUser = async (
    uid: string,
    updates: { accessLevel?: string; emailVerified?: boolean; isActive?: boolean }
  ) => {
    if (!currentUser) return;

    setUpdating(uid);
    setError("");
    setSuccess("");

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, ...updates }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to update user");
        setUpdating(null);
        return;
      }

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === uid
            ? {
                ...u,
                ...updates,
                emailVerified: updates.emailVerified ?? u.emailVerified,
              }
            : u
        )
      );

      setSuccess("User updated successfully");
      setUpdating(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update user");
      setUpdating(null);
    }
  };

  const deactivateUser = async (uid: string) => {
    if (!currentUser) return;
    if (!confirm("Are you sure you want to deactivate this user?")) return;

    setUpdating(uid);
    setError("");

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`/api/admin/users?uid=${uid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to deactivate user");
        setUpdating(null);
        return;
      }

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, isActive: false } : u))
      );

      setSuccess("User deactivated successfully");
      setUpdating(null);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to deactivate user");
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "verified") return user.emailVerified === true;
    if (filter === "unverified") return user.emailVerified === false;
    if (filter === "active") return user.isActive !== false;
    if (filter === "inactive") return user.isActive === false;
    return user.accessLevel === filter;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">
              Manage user access levels and account status
            </p>
          </div>
          <Link
            href="/home-portal"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 self-center mr-2">Filter:</span>
          {[
            { value: "all", label: "All Users" },
            { value: "verified", label: "Verified" },
            { value: "unverified", label: "Unverified" },
            { value: "standard", label: "Standard" },
            { value: "premium", label: "Premium" },
            { value: "admin", label: "Admin" },
            { value: "inactive", label: "Inactive" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.emailVerified === true).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Pending Verification</p>
            <p className="text-2xl font-bold text-yellow-600">
              {users.filter((u) => u.emailVerified === false).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Premium/Admin</p>
            <p className="text-2xl font-bold text-purple-600">
              {
                users.filter(
                  (u) => u.accessLevel === "premium" || u.accessLevel === "admin"
                ).length
              }
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Access Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.uid}
                      className={user.isActive === false ? "bg-gray-50 opacity-60" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || "No name"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="text-xs text-gray-400">
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {user.emailVerified === true ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Email Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending Verification
                            </span>
                          )}
                          {user.isActive === false && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Deactivated
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.accessLevel}
                          onChange={(e) =>
                            updateUser(user.uid, { accessLevel: e.target.value })
                          }
                          disabled={
                            updating === user.uid || user.uid === currentUser?.uid
                          }
                          className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="standard">Standard</option>
                          <option value="premium">Premium</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                        {user.inviteCodeUsed && (
                          <div className="text-xs text-gray-400">
                            Code: {user.inviteCodeUsed}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col gap-2">
                          {user.emailVerified === false && (
                            <button
                              onClick={() =>
                                updateUser(user.uid, { emailVerified: true })
                              }
                              disabled={updating === user.uid}
                              className="text-blue-600 hover:text-blue-800 disabled:opacity-50 text-left"
                            >
                              Verify Email
                            </button>
                          )}
                          {user.isActive !== false &&
                            user.uid !== currentUser?.uid && (
                              <button
                                onClick={() => deactivateUser(user.uid)}
                                disabled={updating === user.uid}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50 text-left"
                              >
                                Deactivate
                              </button>
                            )}
                          {user.isActive === false && (
                            <button
                              onClick={() =>
                                updateUser(user.uid, { isActive: true })
                              }
                              disabled={updating === user.uid}
                              className="text-green-600 hover:text-green-800 disabled:opacity-50 text-left"
                            >
                              Reactivate
                            </button>
                          )}
                          {updating === user.uid && (
                            <span className="text-gray-400">Updating...</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Access Levels Explained
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              <strong>Standard:</strong> Basic access to home portal and onboarding
            </li>
            <li>
              <strong>Premium:</strong> Access to MidPrint Dashboard and Google Ads features
            </li>
            <li>
              <strong>Admin:</strong> Full access including user management and invite codes
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

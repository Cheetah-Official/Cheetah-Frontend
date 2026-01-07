"use client";

import Image from "next/image";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

type User = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string | null;
  address?: string;
}

type AccountSettingsProps = {
  user: User | null;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setError("");
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await changePasswordAPI({ currentPassword, newPassword });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
      alert("Password changed successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#F2F2F2] rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="space-y-0">
          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-300 hover:bg-[#F5F0F0] transition-colors cursor-pointer gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image src="/Mail.png" alt="Email" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-gray-600 font-medium text-sm sm:text-base">Email</span>
            </div>
            <span className="text-gray-500 text-xs sm:text-sm break-words sm:text-right">{user?.email || "Not provided"}</span>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-300 hover:bg-[#F5F0F0] transition-colors cursor-pointer gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image src="/Phone.png" alt="Phone" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-gray-600 font-medium text-sm sm:text-base">Phone Number</span>
            </div>
            <span className="text-gray-500 text-xs sm:text-sm break-words sm:text-right">{user?.phone || "Not provided"}</span>
          </div>

          {/* Home Address */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-b border-gray-300 hover:bg-[#F5F0F0] transition-colors cursor-pointer gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image src="/Address.png" alt="Address" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-gray-600 font-medium text-sm sm:text-base">Home Address</span>
            </div>
            <span className="text-gray-500 text-xs sm:text-sm break-words sm:text-right">{user?.address || "Not provided"}</span>
          </div>

          {/* Change Password */}
          <div 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 cursor-pointer hover:bg-[#F5F0F0] transition-colors rounded-b-lg gap-2 sm:gap-0"
            onClick={() => setShowChangePassword(true)}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <Image src="/Password-icon.png" alt="Password" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-gray-600 font-medium text-sm sm:text-base">Change Password</span>
            </div>
            <span className="text-gray-500 text-xs sm:text-sm sm:text-right">********</span>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setError("");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B2323] focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setError("");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#8B2323] text-white rounded-lg hover:bg-[#7A1F1F] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

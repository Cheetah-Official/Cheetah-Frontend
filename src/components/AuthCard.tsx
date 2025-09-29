"use client";

import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  showSocial?: boolean;
  socialButtons?: ReactNode;
};

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
  showSocial = true,
  socialButtons,
}: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2384]">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md flex flex-col items-center">
        <div className="mb-4 flex flex-col items-center">
          <img src="/Logo.png" alt="Cheetah Logo" className="h-10 mb-1" />
          <h2 className="text-2xl font-bold mb-0.5 text-[#1A1A1A]">{title}</h2>
          {subtitle && (
            <p className="text-gray-500 text-center text-sm max-w-xs mb-1">{subtitle}</p>
          )}
        </div>

        {/* Form content */}
        <div className="w-full">{children}</div>

        {/* Footer (e.g., link to other auth page) */}
        {footer && <div className="text-sm text-gray-600 mt-1 mb-2">{footer}</div>}

        {/* Divider */}
        {showSocial && (
          <>
            <div className="flex items-center w-full my-2">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="mx-2 text-gray-400 text-xs">or continue with</span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>
            <div className="flex justify-center gap-6 w-full mt-1">
              {socialButtons}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMenu, FiX, FiBell, FiLogIn, FiUser } from "react-icons/fi";
import { useTokenStore } from "../../stores/token";

interface MenuItem {
  name: string;
  href: string;
  requireAuth?: boolean;
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { accessToken, clearTokens } = useTokenStore();

  const menuItems: MenuItem[] = [
    { name: "동아리 찾기", href: "/clubs" },
    { name: "지원현황", href: "/applications", requireAuth: true },
    { name: "공지사항", href: "/notices" },
  ];

  const handleAuthRequired = (href: string, requireAuth: boolean = false) => {
    if (requireAuth && !accessToken) {
      router.push("/login");
      return;
    }
    router.push(href);
  };

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo with subtle hover effect */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-blue-600"
          >
            MOA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleAuthRequired(item.href, item.requireAuth)}
                className="text-gray-600 hover:text-blue-600 
                           transition-colors duration-300 
                           px-2 py-1 rounded-md 
                           text-sm font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Side Icons and Actions */}
          <div className="flex items-center space-x-4">
            {accessToken ? (
              <div className="flex items-center space-x-4">
                {/* Notification Icon with subtle hover */}
                <button
                  className="text-gray-500 hover:text-blue-600 
                                   transition-colors duration-300"
                >
                  <FiBell className="w-5 h-5" />
                </button>

                {/* Profile Dropdown with clean styling */}
                <div className="relative group">
                  <button
                    className="text-gray-500 hover:text-blue-600 
                                     transition-colors duration-300"
                  >
                    <FiUser className="w-5 h-5" />
                  </button>
                  <div
                    className="absolute right-0 mt-3 w-48 py-1 
                              origin-top-right transform 
                              transition-all duration-200 ease-out
                              opacity-0 invisible 
                              group-hover:opacity-100 group-hover:visible
                              bg-white rounded-lg shadow-lg 
                              border border-gray-100"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 
                                 hover:bg-gray-50 
                                 transition-colors duration-300"
                    >
                      프로필
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm 
                                 text-red-500 hover:bg-gray-50 
                                 transition-colors duration-300"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="text-gray-600 hover:text-blue-600 
                           transition-colors duration-300 
                           flex items-center gap-2"
              >
                <FiLogIn className="w-5 h-5 md:w-4 md:h-4" />
                <span className="hidden md:inline text-sm font-medium">
                  로그인
                </span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-600 hover:text-blue-600 
                         transition-colors duration-300 p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95">
            <div className="max-w-7xl mx-auto py-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleAuthRequired(item.href, item.requireAuth);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 
                             text-gray-600 hover:text-blue-600 
                             hover:bg-gray-50 text-sm 
                             transition-colors duration-300"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

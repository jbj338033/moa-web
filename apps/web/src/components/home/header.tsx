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
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gray-900/90 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            MOA
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleAuthRequired(item.href, item.requireAuth)}
                className="text-gray-300 hover:text-white transition-colors px-2 py-1 text-sm"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex items-center">
            {accessToken ? (
              <div className="flex items-center gap-4">
                <button className="text-gray-300 hover:text-white">
                  <FiBell className="w-5 h-5" />
                </button>
                <div className="relative group">
                  <button className="text-gray-300 hover:text-white">
                    <FiUser className="w-5 h-5" />
                  </button>
                  <div
                    className="absolute right-0 mt-4 w-40 py-2 invisible group-hover:visible 
                              opacity-0 group-hover:opacity-100 transform 
                              bg-gray-800 rounded-lg shadow-lg
                              transition-all duration-200 ease-in-out"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      프로필
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="text-gray-300 hover:text-white transition-colors p-2"
              >
                <FiLogIn className="w-5 h-5 md:hidden" />
                <span className="hidden md:inline-flex items-center gap-2">
                  <FiLogIn className="w-4 h-4" />
                  <span className="text-sm">로그인</span>
                </span>
              </button>
            )}

            <button
              className="md:hidden text-gray-300 hover:text-white p-2 ml-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {isOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900/95">
            <div className="max-w-7xl mx-auto py-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleAuthRequired(item.href, item.requireAuth);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 text-sm transition-colors"
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

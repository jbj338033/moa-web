"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMenu, FiX, FiBell, FiLogIn, FiUser } from "react-icons/fi";
import { useTokenStore } from "../../stores/token";

type MenuItem = {
  name: string;
  href: string;
  requireAuth?: boolean;
};

const menuItems: MenuItem[] = [
  { name: "동아리 찾기", href: "/clubs" },
  { name: "지원현황", href: "/applications", requireAuth: true },
  { name: "공지사항", href: "/notices" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { accessToken, clearTokens } = useTokenStore();

  const handleNavigation = (href: string, requireAuth = false) => {
    if (requireAuth && !accessToken) {
      router.push("/login");
      return;
    }
    router.push(href);
    setIsOpen(false);
  };

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            MOA
          </Link>

          {/* Desktop Navigation */}
          <NavigationItems
            items={menuItems}
            onItemClick={handleNavigation}
            className="hidden md:flex items-center gap-6"
          />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {accessToken ? (
              <AuthenticatedActions onLogout={handleLogout} />
            ) : (
              <LoginButton onClick={() => router.push("/login")} />
            )}

            {/* Mobile Menu Toggle */}
            <MobileMenuButton
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <NavigationItems
            items={menuItems}
            onItemClick={handleNavigation}
            className="md:hidden border-t border-gray-100 bg-white/95"
            isMobile
          />
        )}
      </div>
    </header>
  );
}

function NavigationItems({
  items,
  onItemClick,
  className,
  isMobile,
}: {
  items: MenuItem[];
  onItemClick: (href: string, requireAuth?: boolean) => void;
  className: string;
  isMobile?: boolean;
}) {
  const baseItemStyles =
    "text-gray-600 hover:text-blue-600 transition-colors duration-300 text-sm font-medium";
  const mobileItemStyles = "block w-full text-left px-4 py-3 hover:bg-gray-50";
  const desktopItemStyles = "px-2 py-1 rounded-md";

  return (
    <div className={className}>
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => onItemClick(item.href, item.requireAuth)}
          className={`${baseItemStyles} ${
            isMobile ? mobileItemStyles : desktopItemStyles
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

function AuthenticatedActions({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex items-center space-x-4">
      <button className="text-gray-500 hover:text-blue-600 transition-colors">
        <FiBell className="w-5 h-5" />
      </button>

      <div className="relative group">
        <button className="text-gray-500 hover:text-blue-600 transition-colors">
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
                     hover:bg-gray-50 transition-colors"
          >
            프로필
          </Link>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm 
                     text-red-500 hover:bg-gray-50 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-gray-600 hover:text-blue-600 
                transition-colors flex items-center gap-2"
    >
      <FiLogIn className="w-5 h-5 md:w-4 md:h-4" />
      <span className="hidden md:inline text-sm font-medium">로그인</span>
    </button>
  );
}

function MobileMenuButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="md:hidden text-gray-600 hover:text-blue-600 
               transition-colors p-2"
      onClick={onClick}
    >
      {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
    </button>
  );
}

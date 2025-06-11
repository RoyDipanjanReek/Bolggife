"use client";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Home, Menu, Upload } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "../component/ThemeSwitcher";

const sideBarItem = [
  { href: "/Home", icon: Home, lebel: "Home" },
  { href: "/Create-Blog", icon: Upload, lebel: "Create Blog" },
  { href: "/add-blodd", icon: Upload, lebel: "add-blogss" },
];

export default function Layout({ children }) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  const handleNavigation = (path) => {
    router.push(path);
    setIsDrawerOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Top Navbar */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex items-center justify-between">
        <h1 className="text-xl font-bold">Bolggife</h1>
         {/**<ThemeSwitcher />*/}
        <div className="">
          <button
            onClick={handleLogout}
            className="bg-red-500 flex gap-2 py-3 px-3 rounded-2xl hover:bg-red-400 hover:cursor-pointer"
          >
            Logout
          </button>
        </div>
        <button
          className="md:hidden text-white"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Main content with sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-16 left-0 z-50 h-screen md:h-auto w-60 bg-gray-100 border-r p-4 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="space-y-2 w-full">
            <ul className="menu p-4 w-full text-base-content flex-grow">
              {sideBarItem.map((item) => (
                <li key={item.href} className="mb-2 py-2">
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${
                      pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "bg-gray-500 hover:bg-blue-200 hover:text-black"
                    }`}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <item.icon className="w-6 h-6" />
                    <span>{item.lebel}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto mt-16 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}

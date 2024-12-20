"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const navigation = [
  { name: "Exercises", href: "/exercise" },
  { name: "Recipes", href: "/nutrition" },
  { name: "Profile", href: "/profile" },
  { name: "Workouts", href: "/workout" },
  { name: "Progress", href: "/progress" },
  { name: "Community", href: "/community" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { logout, isLoggedIn, isAdmin }: any = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
  };

  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="flex max-w-7xl items-center justify-between gap-x-6 "
      >
        <div className="flex">
          <Link href="/" className="px-1.5 ml-12 pt-2">
            <img alt="FitFrenzy Logo" src="/F.png" className="w-28 h-24" />
          </Link>
        </div>
        <div className="flex items-center justify-end gap-x-6">
          {!isLoggedIn ? (
            <>
              <a
                href="/login"
                className="hidden text-lg font-semibold text-gray-900 lg:block"
              >
                Log in
              </a>
              <a
                href="/register"
                className="rounded-md bg-neutral-800 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600"
              >
                Sign up
              </a>
            </>
          ) : (
            <>
              <div className="hidden lg:flex lg:gap-x-12 justify-end">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-lg font-semibold text-gray-900"
                  >
                    {item.name}
                  </a>
                ))}
                {isAdmin ? (
                  <a
                    href="/admin"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Admin
                  </a>
                ) : null}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-md bg-neutral-800 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center gap-x-6">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">FitFrenzy</span>
              <img alt="FitFrenzy Logo" src="/F.png" className="w-20 h-18" />
            </Link>
            {!isLoggedIn ? (
              <a
                href="/register"
                className="ml-auto rounded-md bg-neutral-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600"
              >
                Sign up
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-800/10">
              <div className="py-6">
                {!isLoggedIn ? (
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-lg font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                ) : (
                  <>
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-lg font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

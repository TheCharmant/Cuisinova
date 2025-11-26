import { useRouter } from "next/router";
import Link from "next/link";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

const userNavigation = [
  { name: "Your Profile", route: "./Profile" },
  { name: "Sign out", route: "/auth/signout" },
];

const navigation = [
  {
    name: "Home",
    route: "/Home",
    icon: HomeIcon,
  },
  {
    name: "Create Recipes",
    route: "/CreateRecipe",
    icon: PlusCircleIcon,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({ user }: any) {
  const router = useRouter();

  const handleNavigation = (item: any) => {
    if (item.name === "Sign out") return signOut();
    router.push(item.route);
  };

  if (!user) return null;

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-header bg-gradient-to-r from-coquette-cream via-coquette-softPink to-coquette-lavender backdrop-blur-xl shadow-delicate border-b border-coquette-blush/30"
    >
      {({ open }) => (
        <>
          {/* Desktop Header */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              {/* Logo + Nav */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-full p-1 shadow-lg"
                >
                  <Image
                    src="/cuisinova-logo.png"
                    alt="Cuisinova Logo"
                    width={50}
                    height={50}
                    className="rounded-full border-4 border-coquette-blush/50 shadow-delicate"
                    priority
                  />
                </motion.div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-4 ml-6">
                  {navigation.map((item) => {
                    const isActive = router.pathname === item.route;
                    return (
                      <Link
                        key={item.name}
                        href={item.route}
                        className={classNames(
                          "flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-base transition-all duration-300 shadow-delicate",
                          isActive
                            ? "bg-white/95 text-coquette-rose ring-2 ring-coquette-blush/50 backdrop-blur-sm"
                            : "bg-coquette-cream/80 text-coquette-rose hover:bg-coquette-softPink hover:text-coquette-lavender"
                        )}
                      >
                        <item.icon className="h-5 w-5 opacity-70" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Desktop User Menu */}
              <div className="hidden md:flex items-center gap-4">
                <Menu as="div" className="relative">
                  <MenuButton className="rounded-full border-2 border-coquette-blush/40 bg-white shadow-delicate hover:shadow-glow transition-all">
                    <Image
                      src={user?.image || ""}
                      alt="profile"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 mt-2 w-48 rounded-xl bg-white/95 shadow-delicate border border-coquette-blush/20 backdrop-blur-sm p-2">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        {({ focus }) => (
                          <button
                            onClick={() => handleNavigation(item)}
                            className={classNames(
                              "w-full text-left px-4 py-2 rounded-lg font-medium transition-all",
                              focus && "bg-coquette-softPink/40"
                            )}
                          >
                            {item.name}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <DisclosureButton className="rounded-full p-3 bg-white/20 text-white backdrop-blur-sm shadow-lg">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <DisclosurePanel className="md:hidden px-4 pb-4">
            {/* Mobile Nav */}
            <div className="mt-3 space-y-3 bg-gradient-to-r from-coquette-cream/90 via-coquette-softPink/70 to-coquette-lavender/70 backdrop-blur-lg p-4 rounded-2xl shadow-delicate border border-coquette-blush/30">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.route}
                  className={classNames(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all",
                    router.pathname === item.route
                      ? "bg-white/95 text-coquette-rose shadow-delicate ring-2 ring-coquette-blush/50"
                      : "bg-coquette-cream/80 text-coquette-rose hover:bg-coquette-softPink hover:text-coquette-lavender"
                  )}
                >
                  <item.icon className="h-5 w-5 opacity-70" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile User Section */}
            <div className="mt-3 p-4 bg-gradient-to-r from-coquette-cream/90 via-coquette-softPink/70 to-coquette-lavender/70 rounded-2xl backdrop-blur-lg shadow-delicate border border-coquette-blush/30">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={user?.image || ""}
                  alt="profile"
                  width={45}
                  height={45}
                  className="rounded-full border-2 border-coquette-blush/50 shadow-md"
                />
                <div>
                  <p className="font-bold text-coquette-rose">{user?.name}</p>
                  <p className="text-sm text-coquette-rose/70">{user?.email}</p>
                </div>
              </div>

              {userNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className="w-full text-left px-4 py-3 rounded-lg font-semibold text-coquette-rose hover:bg-coquette-softPink/60 hover:text-coquette-lavender transition-all"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}

import { useRouter } from 'next/router';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, HomeIcon, PlusCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { signOut } from 'next-auth/react';
import Notifications from './Notifications';
import { motion } from 'framer-motion';

const userNavigation = [
    { name: 'Your Profile', route: '/Profile' },
    { name: 'Sign out', route: '/auth/signout' },
]

const navigation = [
    { 
        name: 'Home', 
        route: '/Home', 
        icon: HomeIcon,
        style: 'bg-coquette-cream/80 text-coquette-rose hover:bg-coquette-softPink hover:text-coquette-lavender shadow-delicate backdrop-blur-sm',
    },
    { 
        name: 'Create Recipes', 
        route: '/CreateRecipe', 
        icon: PlusCircleIcon,
        style: 'bg-gradient-to-r from-coquette-blush to-coquette-lavender text-white px-4 py-2 rounded-full shadow-delicate hover:shadow-glow',
    },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface HeaderProps {
    user: {
        name?: string | null | undefined
        image?: string | null | undefined
        email?: string | null | undefined
    } | undefined
}

function Header({ user }: HeaderProps) {

    const router = useRouter();

    const handleNavigation = (menu: { name: string, route: string }) => {
        if (menu.name === 'Sign out') {
            signOut()
            return
        }
        router.push(menu.route)
    }

    if (!user) return null;
    return (
    <Disclosure as="nav" className="sticky top-0 z-header bg-gradient-to-r from-coquette-cream via-coquette-softPink to-coquette-lavender shadow-delicate backdrop-blur-md bg-opacity-95 border-b-2 border-coquette-blush/30" style={{ scrollbarGutter: 'stable', fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}>
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <div className="flex items-center">
                                <motion.div 
                                    className="flex-shrink-0 bg-white rounded-full p-1 shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
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
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-6">
                                        {navigation.map((item) => (
                                            <motion.button
                                                key={item.name}
                                                className={classNames(
                                                    item.route === router.pathname
                                                        ? 'bg-white/95 text-coquette-rose font-bold shadow-delicate ring-2 ring-coquette-blush/50 backdrop-blur-sm'
                                                        : item.style,
                                                    'rounded-full px-5 py-2.5 text-base font-bold flex items-center gap-2 transition-all duration-300 kawaii-nav',
                                                )}
                                                aria-current={item.route === router.pathname ? 'page' : undefined}
                                                onClick={() => handleNavigation(item)}
                                                whileHover={{ scale: 1.08, rotate: 2 }}
                                                whileTap={{ scale: 0.96 }}
                                                style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
                                            >
                                                <item.icon className="h-5 w-5 opacity-70" />
                                                {item.name}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6 space-x-4">
                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative">
                                        <div>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white/95 border-2 border-coquette-blush/40 text-sm focus:outline-none focus:ring-2 focus:ring-coquette-lavender focus:ring-offset-2 focus:ring-offset-coquette-softPink shadow-delicate hover:shadow-glow transition-all duration-300 backdrop-blur-sm">
                                                    <span className="absolute -inset-1.5" />
                                                    <span className="sr-only">Open user menu</span>
                                                    <Image
                                                        src={user?.image || ''}
                                                        alt=""
                                                        width={75}
                                                        height={75}
                                                        className="h-10 w-10 rounded-full"
                                                    />
                                                </MenuButton>
                                            </motion.div>
                                        </div>
                                        <MenuItems
                                            className="absolute right-0 z-overlay mt-2 w-48 origin-top-right rounded-2xl bg-white/95 py-2 shadow-delicate ring-1 ring-coquette-blush/30 border border-coquette-blush/20 backdrop-blur-sm transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                        >
                                            {userNavigation.map((item) => (
                                                <MenuItem key={item.name}>
                                                    {({ focus }) => (
                                                        <motion.button
                                                            className={classNames(
                                                                focus ? 'bg-coquette-softPink/50' : '',
                                                                'block px-4 py-3 text-sm text-coquette-lavender w-full text-left hover:bg-gradient-to-r hover:from-coquette-softPink/30 hover:to-coquette-lavender/30 transition-all duration-300 coquette-body',
                                                            )}
                                                            onClick={() => handleNavigation(item)}
                                                            whileHover={{ x: 5 }}
                                                        >
                                                            {item.name}
                                                        </motion.button>
                                                    )}
                                                </MenuItem>
                                            ))}
                                        </MenuItems>
                                    </Menu>
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                {/* Mobile menu button */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <DisclosureButton className="relative inline-flex items-center justify-center rounded-full bg-white/20 p-3 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-800 backdrop-blur-sm shadow-lg">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </DisclosureButton>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="md:hidden">
                        <div className="space-y-3 px-4 pb-4 pt-4 sm:px-5 bg-white/5 backdrop-blur-sm mt-2 rounded-2xl mx-2 shadow-lg">
                            {navigation.map((item) => (
                                <motion.div key={item.name} whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                                    <DisclosureButton
                                        className={classNames(
                                            item.route === router.pathname
                                                ? 'bg-white/95 text-coquette-rose shadow-delicate ring-2 ring-coquette-blush/50 backdrop-blur-sm'
                                                : 'bg-coquette-cream/80 text-coquette-lavender hover:bg-coquette-softPink',
                                            'flex items-center gap-3 w-full rounded-xl px-4 py-3 text-base font-bold transition-all duration-300 kawaii-nav',
                                        )}
                                        aria-current={item.route === router.pathname ? 'page' : undefined}
                                        onClick={() => handleNavigation(item)}
                                        style={{ fontFamily: 'Baloo 2, Fredoka One, Montserrat, cursive, sans-serif' }}
                                    >
                                        <item.icon className="h-5 w-5 opacity-70" />
                                        {item.name}
                                    </DisclosureButton>
                                </motion.div>
                            ))}
                        </div>
                        <div className="border-t border-white/10 mx-2 mt-2 pb-3 pt-4">
                            <div className="flex items-center px-5 bg-white/5 backdrop-blur-sm rounded-xl p-4 shadow-md">
                                <div className="flex-shrink-0">
                                    <Image
                                        src={user?.image || ''}
                                        alt=""
                                        width={75}
                                        height={75}
                                        className="h-12 w-12 rounded-full border-2 border-white/70 shadow-md"
                                    />
                                </div>
                                <div className="ml-4">
                                    <div className="text-base font-bold leading-none text-white">{user?.name}</div>
                                    <div className="text-sm font-medium leading-none text-gray-200 mt-1.5">{user?.email}</div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2 px-2 bg-white/5 backdrop-blur-sm rounded-xl p-2 mx-2 shadow-md">
                                {userNavigation.map((item) => (
                                    <motion.div key={item.name} whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                                        <DisclosureButton
                                            className="block w-full rounded-xl px-4 py-3 text-base font-medium text-white hover:bg-white/10 transition-all duration-300 text-left"
                                            onClick={() => handleNavigation(item)}
                                        >
                                            {item.name}
                                        </DisclosureButton>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    )
}

export default Header

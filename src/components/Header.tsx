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
        style: 'text-white hover:bg-white/10 hover:text-white' 
    },
    { 
        name: 'Create Recipes', 
        route: '/CreateRecipe', 
        icon: PlusCircleIcon,
        style: 'bg-white/90 text-brand-600 px-4 py-2 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all' 
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
        <Disclosure as="nav" className="sticky top-0 z-header bg-gradient-to-r from-brand-700 to-violet-700 shadow-xl backdrop-blur-sm bg-opacity-90" style={{ scrollbarGutter: 'stable' }}>
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
                                        src="/favicon.ico"
                                        alt="logo"
                                        width={50}
                                        height={50}
                                        className="rounded-full"
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
                                                        ? 'bg-white/90 text-brand-600 font-bold shadow-lg'
                                                        : item.style,
                                                    'rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-2 transition-all duration-300',
                                                )}
                                                aria-current={item.route === router.pathname ? 'page' : undefined}
                                                onClick={() => handleNavigation(item)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <item.icon className="h-5 w-5" />
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
                                                <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white border-2 border-brand-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-violet-700 shadow-md hover:shadow-lg transition-all duration-300">
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
                                            className="absolute right-0 z-overlay mt-2 w-48 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-violet-100 border border-violet-100 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                        >
                                            {userNavigation.map((item) => (
                                                <MenuItem key={item.name}>
                                                    {({ focus }) => (
                                                        <motion.button
                                                            className={classNames(
                                                                focus ? 'bg-brand-50' : '',
                                                                'block px-4 py-3 text-sm text-gray-700 w-full text-left hover:bg-gradient-to-r hover:from-brand-50 hover:to-violet-50 transition-all duration-300',
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
                                                ? 'bg-white/90 text-brand-600 shadow-md' 
                                                : 'text-white hover:bg-white/10',
                                            'flex items-center gap-3 w-full rounded-xl px-4 py-3 text-base font-medium transition-all duration-300',
                                        )}
                                        aria-current={item.route === router.pathname ? 'page' : undefined}
                                        onClick={() => handleNavigation(item)}
                                    >
                                        <item.icon className="h-5 w-5" />
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

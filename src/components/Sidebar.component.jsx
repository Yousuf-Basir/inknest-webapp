// change later
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { BookOpenIcon, FolderDownloadIcon, FolderIcon, XIcon } from '@heroicons/react/outline'
import {
    SearchIcon,
    SelectorIcon,
} from '@heroicons/react/solid'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toggle } from '../redux/menuSlice';
import { useLocation, useHistory } from 'react-router-dom';
import getCurrentUser from '../tools/getCurrentUser';
import inknestLogo from "../assets/inknest-logo.svg";
import { reactLocalStorage } from 'reactjs-localstorage';


const navigation = [
    { name: 'My books', href: '/mybooks', icon: BookOpenIcon },
    { name: 'Shelfs', href: '/shelfs', icon: FolderIcon },
    { name: 'Shared shelfs', href: '/sharedshelfs', icon: FolderDownloadIcon },
    { name: 'Explore', href: '/explore', icon: SearchIcon },
]



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Sidebar = () => {
    const menuState = useSelector((state)=>state.menuState.isOpen);
    const dispatch = useDispatch();
    const history = useHistory();

    const closeSideBar = () => {
        dispatch(toggle());
    }
    const location = useLocation();
    
    // Hide the this component if the route location is signin or signup
    if(location.pathname == "/signin" || location.pathname == "/signup"){
        return(null)
    }

    const logOut = () => {
        reactLocalStorage.remove(("accessToken"));
        history.push("/signin");
    }

    const currentUser = getCurrentUser();

    return (
        <div className="relative h-screen flex overflow-hidden bg-white">
            {/* Sidebar for mobile view */}
            <Transition.Root show={menuState} as={Fragment}>
                <Dialog as="div" static className="fixed inset-0 flex z-40 lg:hidden" open={menuState} onClose={closeSideBar} >
                    <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0" >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>
                    <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full" >
                        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                            <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0" >
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        onClick={() => closeSideBar()}
                                    >
                                        <span className="sr-only">Close sidebar</span>
                                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </Transition.Child>
                            <div className="flex-shrink-0 flex items-center px-4">
                                <img className="h-10 w-auto"
                                    src={inknestLogo} alt="Inknest"
                                />
                            </div>
                            <div className="mt-5 flex-1 h-0 overflow-y-auto">
                                <nav className="px-2">
                                    <div className="space-y-1">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    location.pathname == item.href
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                                                    'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md'
                                                )}
                                                aria-current={location.pathname == item.href ? 'page' : undefined}
                                            >
                                                <item.icon className={classNames(
                                                    location.pathname == item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                                    'mr-3 flex-shrink-0 h-6 w-6'
                                                )}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                    
                                </nav>
                            </div>
                        </div>
                    </Transition.Child>
                    <div className="flex-shrink-0 w-14" aria-hidden="true">
                        {/* Dummy element to force sidebar to shrink to fit close icon */}
                    </div>
                </Dialog>
            </Transition.Root>


            {/* Static sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64 border-r border-gray-200 pt-5 pb-4 bg-gray-100">
                    <div className="flex items-center justify-center flex-shrink-0 px-6">
                        <img
                            className="h-12 w-auto"
                            src={inknestLogo}
                            alt="Workflow"
                        />
                    </div>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="h-0 flex-1 flex flex-col overflow-y-auto">
                        {/* User account dropdown */}
                        <Menu as="div" className="px-3 mt-6 relative inline-block text-left">
                            {({ open }) => (
                                <>
                                    <div>
                                        <Menu.Button className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500">
                                            <span className="flex w-full justify-between items-center">
                                                <span className="flex min-w-0 items-center justify-between space-x-3">
                                                    <span className="flex-1 flex flex-col min-w-0">
                                                        <span className="text-gray-900 text-sm font-medium truncate">{currentUser?(currentUser.firstName + " " + currentUser.lastName):""}</span>
                                                        <span className="text-gray-500 text-sm truncate">{currentUser?currentUser.email:""}</span>
                                                    </span>
                                                </span>
                                                <SelectorIcon
                                                    className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items
                                            static
                                            className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                                        >
                                            <div className="py-1">
                                            </div>
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            Send feedback
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            onClick={()=>logOut()}
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm cursor-pointer'
                                                            )}
                                                        >
                                                            Logout
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </>
                            )}
                        </Menu>

                        {/* Navigation */}
                        <nav className="px-3 mt-6">
                            <div className="space-y-1">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            location.pathname == item.href ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                        )}
                                        aria-current={location.pathname == item.href ? 'page' : undefined}
                                    >
                                        <item.icon
                                            className={classNames(
                                                location.pathname == item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                                                'mr-3 flex-shrink-0 h-6 w-6'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
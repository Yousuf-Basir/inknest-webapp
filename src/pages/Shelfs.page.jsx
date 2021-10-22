import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { TrashIcon, FolderOpenIcon, ShareIcon } from '@heroicons/react/solid'
import axios from 'axios';
import jwt_decode from "jwt-decode";
// import UserList from './UserList.Component';
import { reactLocalStorage } from 'reactjs-localstorage';
import UserList from '../components/UserList.component';
import { XCircleIcon } from '@heroicons/react/outline';
import SidebarToggleButton from '../components/SidebarToggleButton.component';



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const sortShelf = (arrayOfObjects) => {
    var byDate = arrayOfObjects.slice(0);
    byDate.sort(function (a, b) {
        return b.dateCreated - a.dateCreated;
    });
    return byDate;
}

const Shelfs = () => {
    const accessToken = reactLocalStorage.get("accessToken");

    const [shelfList, setShelfList] = useState([])

    const [shelfNameValue, setShelfNameValue] = useState("");
    const [shelfDescriptionValue, setShelfDescriptionValue] = useState("");
    const [enabled, setEnabled] = useState(true);
    const [shelfToShare, setShelfToShare] = useState({});

    // user list modal open state
    const [openState, setOpenState] = useState(false);

    // Create new shelf panel toggle state for mobile view
    const [openCreateNew, setOpenCreateNew] = useState(false);

    // Handle share shelf
    const setSelectedUser = ({ selectedUserUid, selectedUserName }) => {
        var currentUser = jwt_decode(accessToken);
        axios.post(`${process.env.REACT_APP_SERVER_URL}/share`, {
            "shelfUid": shelfToShare.shelfUid,
            "sharedByUid": currentUser.userUid,
            "sharedWithUid": selectedUserUid,
            "shelfName": shelfToShare.shelfName,
            "sharedBy": currentUser.firstName + " " + currentUser.lastName,
            "sharedWith": selectedUserName
        }, {
            headers: { "token": accessToken }
        }).then(response => {
            console.log(response.data);
            alert("Shelf has been shared successfully with " + selectedUserName);
        }).catch(err => console.log(err));
    }

    const getUserShelf = () => {
        setShelfList([]);
        axios.get(`${process.env.REACT_APP_SERVER_URL}/shelf`, {
            headers: {
                "token": accessToken
            },
        }).then((response) => {
            const usersShelfs = response.data.userShelfs;
            console.log(usersShelfs);
            if (usersShelfs.length > 0) {
                usersShelfs.forEach((shelf) => {
                    setShelfList(oldArray => [
                        ...oldArray,
                        {
                            name: shelf.Shelf_Name,
                            initials: shelf.Is_Open == 1 ? "GlobeIcon" : "LockClosedIcon",
                            href: `${process.env.REACT_APP_APP_URL}/mybooks?shelfUidTab=${shelf.Shelf_UID}`,
                            shelfDescription: shelf.Shelf_Description,
                            bgColor: shelf.Is_Open == 1 ? "bg-green-500" : "bg-purple-600",
                            shelfUid: shelf.Shelf_UID,
                            dateCreated: shelf.Shelf_Created_Date
                        }
                    ]);
                })
            }

        }).catch(err => console.log(err))
    }

    const resetInputs = () => {
        setShelfNameValue("");
        setShelfDescriptionValue("");
        setEnabled(true);
    }

    const handleCreateNewShelf = (e) => {
        e.preventDefault();
        axios.put(`${process.env.REACT_APP_SERVER_URL}/shelf`, {
            "shelfName": shelfNameValue,
            "isOpen": enabled ? 1 : 0,
            "shelfDescription": shelfDescriptionValue
        }, {
            headers: { "token": accessToken }
        }).then(response => {
            console.log(response);
            resetInputs();
            alert("New shelf created");
            getUserShelf();
        }).catch(err => console.log(err));
    }

    const handleDeleteShelf = (shelfUid) => {
        let deleteConfirmation = window.confirm("By deleting this shelf all books of this shelf will be deleted. Delete anyway?");
        if (deleteConfirmation) {
            axios.delete(`${process.env.REACT_APP_SERVER_URL}/shelf?shelfUid=${shelfUid}`, {
                headers: { "token": accessToken }
            }).then(response => {
                getUserShelf();
            }).catch(err => console.log(err));
            getUserShelf();
        }
    }

    useEffect(() => {
        getUserShelf();
        var currentUser = jwt_decode(accessToken);
        console.log(currentUser)
    }, []);

    return (
        <div>
            <div className="bg-gray-800 pb-32 ">
                <header className="py-6">
                    <div className="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex">
                            <SidebarToggleButton />
                            <h1 className="text-2xl font-bold text-white">

                                Shelfs
                            </h1>
                        </div>
                        <button
                            onClick={() => setOpenCreateNew(!openCreateNew)}
                            type="button"
                            className="inline-flex lg:hidden space-x-2 items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {openCreateNew ? <XCircleIcon className="h-6" /> : null}
                            <span>{openCreateNew ? "Close" : "Create new shelf"}</span>
                        </button>
                    </div>


                </header>
            </div>

            <main className="-mt-32">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
                        {/* Main 2 column grid */}
                        <div className="grid grid-cols-1 gap-2 items-start lg:grid-cols-3 lg:gap-2">
                            {/* Left column */}
                            <div className={
                                openCreateNew ? "hidden lg:block grid-cols-1 gap-4 lg:col-span-2"
                                    : "grid grid-cols-1 gap-4 lg:col-span-2"
                            }>
                                <section aria-labelledby="section-1-title">
                                    <div className="rounded-lg bg-white overflow-x-auto shadow" style={{ height: "calc(100vh - 100px)" }}>
                                        {/* Grid list */}
                                        <div>
                                            <ul className="m-6 mt-8 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2">
                                                {sortShelf(shelfList).map((shelf) => (
                                                    <li key={shelf.shelfUid} className="col-span-1 flex shadow-sm rounded-md">
                                                        <div
                                                            className={classNames(
                                                                shelf.bgColor,
                                                                'flex-shrink-0 flex items-center justify-center w-12 text-white text-sm font-medium rounded-l-md'
                                                            )}
                                                        >
                                                            <FolderOpenIcon className="w-5 h-5" aria-hidden="true" />
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                                            <div className="flex-1 px-4 py-2 text-sm truncate">
                                                                <a href={shelf.href} className="text-gray-900 font-medium hover:text-gray-600">
                                                                    {shelf.name}
                                                                </a>
                                                                <p className="text-gray-500">{shelf.shelfDescription}</p>
                                                            </div>
                                                            <div className="flex-shrink-0 pr-2">
                                                                <button
                                                                    onClick={() => handleDeleteShelf(shelf.shelfUid)}
                                                                    className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                >
                                                                    <TrashIcon className="w-5 h-5" aria-hidden="true" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setOpenState(true);
                                                                        setShelfToShare({
                                                                            shelfUid: shelf.shelfUid,
                                                                            shelfName: shelf.name
                                                                        })
                                                                    }}
                                                                    className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                >
                                                                    <ShareIcon className="w-5 h-5" aria-hidden="true" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right column */}
                            <div className="grid grid-cols-1 gap-4">
                                <section aria-labelledby="section-2-title">
                                    <div className="rounded-lg bg-white overflow-y-auto shadow" style={{ height: "calc(100vh - 100px)" }}>

                                        <form onSubmit={(e) => handleCreateNewShelf(e)} >
                                            <div className="sm:rounded-md sm:overflow-y-auto">
                                                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                                                    <h1 className="text-xl font-bold">Create new shelf</h1>
                                                    {/* Shelf name input */}
                                                    <div>
                                                        <div className="col-span-3 sm:col-span-2">
                                                            <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                                                                Shelf name
                                                            </label>
                                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                                <input
                                                                    onChange={(e) => setShelfNameValue(e.target.value)}
                                                                    value={shelfNameValue}
                                                                    type="text"
                                                                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                                                    placeholder="Type shelf name"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Shelf description input */}
                                                    <div>
                                                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                                            Description
                                                        </label>
                                                        <div className="mt-1">
                                                            <textarea
                                                                onChange={(e) => setShelfDescriptionValue(e.target.value)}
                                                                value={shelfDescriptionValue}
                                                                rows={3}
                                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                                placeholder="Type shelf description"
                                                                defaultValue={''}
                                                            />
                                                        </div>
                                                        <p className="mt-2 text-sm text-gray-500">
                                                            Shortly describe what types of books you want save in this shelf
                                                        </p>
                                                    </div>

                                                    {/* Public/Private switch */}
                                                    <div>
                                                        <Switch.Group as="div" className="flex items-center justify-between">
                                                            <span className="flex-grow flex flex-col">
                                                                <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                                                                    Open shelf
                                                                </Switch.Label>
                                                                <Switch.Description as="span" className="text-sm text-gray-500">
                                                                    {
                                                                        enabled
                                                                            ? "Any inknest user can browse open shelf."
                                                                            : "Only you can access this shelf."
                                                                    }
                                                                </Switch.Description>
                                                            </span>
                                                            <Switch
                                                                checked={enabled}
                                                                onChange={setEnabled}
                                                                className={classNames(
                                                                    enabled ? 'bg-indigo-600' : 'bg-gray-200',
                                                                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                                                )}
                                                            >
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={classNames(
                                                                        enabled ? 'translate-x-5' : 'translate-x-0',
                                                                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                                                    )}
                                                                />
                                                            </Switch>
                                                        </Switch.Group>
                                                    </div>
                                                    {/* Save button */}
                                                    <div className="pt-5">
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="submit"
                                                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            >
                                                                Create shelf
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>


                                    </div>
                                </section>
                            </div>
                        </div>
                        {/* /End replace */}
                    </div>

                </div>

            </main>

            <UserList openState={openState} setOpenState={setOpenState} setSelectedUser={setSelectedUser} />
        </div>
    )
}

export default Shelfs;
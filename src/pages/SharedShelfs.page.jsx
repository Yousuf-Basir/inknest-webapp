import axios from "axios";
import { useEffect, useState } from "react";
import { TrashIcon, FolderOpenIcon, ShareIcon, UserIcon, XCircleIcon } from '@heroicons/react/solid';
import jwt_decode from "jwt-decode";
import { reactLocalStorage } from "reactjs-localstorage";
import UserList from "../components/UserList.component";
import SidebarToggleButton from "../components/SidebarToggleButton.component";

const sortShelf = (arrayOfObjects) => {
    var byDate = arrayOfObjects.slice(0);
    byDate.sort(function (a, b) {
        return b.dateCreated - a.dateCreated;
    });
    return byDate;
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const SharedShelf = () => {
    const accessToken = reactLocalStorage.get("accessToken");
    const [sharedByMeList, setSharedByMeList] = useState([]);
    const [shelfList, setShelfList] = useState([]);
    const [shelfToShare, setShelfToShare] = useState({});

    // user list modal open state
    const [openState, setOpenState] = useState(false);

    const [openCreateNew, setOpenCreateNew] = useState(false);

    const getSharedByMeList = () => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/shared-by-me`, {
            headers: { "token": accessToken }
        }).then((response) => {
            setSharedByMeList(response.data.sharedByMeList)
        }).catch(err => console.log(err));
    }

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



    const handleUnshare = (sharedWithUid, sharedShelfUid) => {
        let confirmUnshare = window.confirm("Unshare this shelf?");
        if (confirmUnshare) {
            axios.delete(`${process.env.REACT_APP_SERVER_URL}/share?sharedWithUid=${sharedWithUid}&sharedShelfUid=${sharedShelfUid}`, {
                headers: { "token": accessToken }
            }).then(response => {
                getSharedByMeList();
            }).catch(err => console.log(err));
        }
    }

    const getSharedShelf = () => {
        setShelfList([]);
        axios.get(`${process.env.REACT_APP_SERVER_URL}/shared-with-me`, {
            headers: {
                "token": accessToken
            },
        }).then((response) => {
            console.log(response.data)
            const usersShelfs = response.data.sharedWithMeList;
            console.log(usersShelfs);
            if (usersShelfs.length > 0) {
                usersShelfs.forEach((shelf) => {
                    setShelfList(oldArray => [
                        ...oldArray,
                        {
                            name: shelf.Shelf_Name,
                            href: `${process.env.REACT_APP_APP_URL}/mybooks?shelfUidTab=${shelf.Shelf_UID}&shelfName=${shelf.Shelf_Name}&sharedBy=${shelf.Shared_By}`,
                            shelfDescription: shelf.Shared_By,
                            bgColor: "bg-blue-400",
                            sharedShelfUid: shelf.Shared_Shelf_UID,
                            shelfUid: shelf.Shelf_UID,
                            dateCreated: shelf.Shelf_Created_Date
                        }
                    ]);
                })
            }

        }).catch(err => console.log(err))
    }

    const handleDeleteSharedWithMe = (sharedShelfUid) => {
        let confirmUnshare = window.confirm("Remove this shared shelf?");
        if (confirmUnshare) {
            axios.delete(`${process.env.REACT_APP_SERVER_URL}/shared-with-me?sharedShelfUid=${sharedShelfUid}`, {
                headers: { "token": accessToken }
            }).then(response => {
                console.log(response.data)
                getSharedShelf();
            }).catch(err => console.log(err));
        }
    }

    useEffect(() => {
        getSharedByMeList();
        getSharedShelf();
    }, []);

    return (
        <div>
            <div className="bg-gray-200 pb-32">

                <header className="py-6">
                <div className="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex">
                            <SidebarToggleButton />
                            <h1 className="text-2xl font-bold text-gray-800">

                                Shared Shelfs
                            </h1>
                        </div>
                        <button
                            onClick={() => setOpenCreateNew(!openCreateNew)}
                            type="button"
                            className="inline-flex lg:hidden space-x-2 items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {openCreateNew ? <XCircleIcon className="h-6" /> : null}
                            <span>{openCreateNew ? "Close" : "View shared by me"}</span>
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
                                    <div className="rounded-lg bg-white overflow-y-auto shadow " style={{ height: "calc(100vh - 100px)" }}>
                                        {/* Grid list */}
                                        <div>
                                            <ul className="m-6 mt-8 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2">
                                                {sortShelf(shelfList).map((shelf) => (
                                                    <li key={shelf.sharedShelfUid} className="col-span-1 flex shadow-sm rounded-md">
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
                                                                <p className="text-gray-500 space-x-2 flex items-center">
                                                                    <UserIcon className="h-4 inline" aria-hidden="trur" />
                                                                    <span>{shelf.shelfDescription}</span>
                                                                </p>
                                                            </div>
                                                            <div className="flex-shrink-0 pr-2">
                                                                <button
                                                                    onClick={() => handleDeleteSharedWithMe(shelf.sharedShelfUid)}
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
                                        {/* Recent Hires */}
                                        <section aria-labelledby="recent-hires-title">
                                            <div className="rounded-lg bg-white overflow-y-auto">
                                                <div className="p-6">
                                                    <h2 className="text-base font-medium text-gray-900" id="recent-hires-title">
                                                        Shared by me
                                                    </h2>
                                                    <div className="flow-root mt-6">
                                                        <ul className="-my-5 divide-y divide-gray-200">
                                                            {sharedByMeList.map((sharedShelf) => (
                                                                <li key={sharedShelf.Shared_Shelf_UID} className="py-4">
                                                                    <div className="flex items-center space-x-4">
                                                                        <div className="flex-shrink-0 bg-gray-200 p-2 rounded-md">
                                                                            <FolderOpenIcon className="w-5 h-5" aria-hidden="true" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-medium text-gray-900 truncate">{sharedShelf.Shelf_Name}</p>
                                                                            <p className="text-sm text-gray-500 truncate space-x-2">
                                                                                <ShareIcon className="w-3 h-3 inline" aria-hidden="true" />
                                                                                <span>{sharedShelf.Shared_With}</span>
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <button
                                                                                onClick={() => handleUnshare(sharedShelf.Shared_With_UID, sharedShelf.Shared_Shelf_UID)}
                                                                                className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                                                            >
                                                                                Unshare
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
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

export default SharedShelf;
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import PageTitleAction from "../components/PageTitleAction.component";
import CurrentFileContext from "../tools/currentFileContext";
import formatBytes from "../tools/formatByte";
import { UserIcon } from "@heroicons/react/solid";
import bookimage from "../assets/book.png"
import SidebarToggleButton from "../components/SidebarToggleButton.component";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const sortShelf = (arrayOfObjects) => {
    var byDate = arrayOfObjects.slice(0);
    byDate.sort(function (a, b) {
        return b.Shelf_Created_Date - a.Shelf_Created_Date;
    });
    return byDate;
}

const MyBooks = () => {
    function useQuery() {
       return new URLSearchParams(useLocation().search);
    }
    
    const query = useQuery();
    const shelfUidTab = query.get("shelfUidTab");
    const shelfName = query.get("shelfName");
    const sharedBy = query.get("sharedBy");
    
    const accessToken = reactLocalStorage.get("accessToken");
    const [shelfs, setShelfs] = useState([]);
    const [selectedShelfUid, setSelectedShelfUid] = useState(shelfs[0]);
    const [filesOfShelf, setFilesOfShelf] = useState([]);
    const [selectedFileUid, setSelectedFileUid] = useState("");

    const { currentFile, setCurrentFile } = useContext(CurrentFileContext);

    const history = useHistory();

    // Get all books of current user
    const getUserShelf = () => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/shelf`, {
            headers: {
                "token": accessToken
            },
        }).then((response) => {
            setShelfs(sortShelf(response.data.userShelfs));
        }).catch(err => console.log(err))
    }

    const getFilesByShelfUid = (shelfUid) => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/file?shelfUid=${shelfUid}`, {
            headers: { "token": accessToken }
        }).then((response) => {
            // server sends 404 status code if there is no book in this shelf
            setFilesOfShelf(response.data);
            
            // setFilesOfShelf(response.data)
        }).catch(err => {
            if (err.response.status == 404) {
                console.log("No books found in this shelf");
                setFilesOfShelf([]);
            }
        });
    }

    const openFile = (file) => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/file/get-file-url?token=${accessToken}&fileName=${file.File_Name}`)
            .then(res => res.blob())
            .then(blob => {
                setCurrentFile({
                    file: blob,
                    fileInfo: {
                        name: file.Original_Name,
                        size: formatBytes(file.File_Size),
                        type: file.Mimetype,
                        fileUid: file.File_UID,
                    }
                });
                history.push("/fileviewer");
            })

    }

    useEffect(() => {
        if (shelfs[0] && !shelfUidTab) {
            setSelectedShelfUid(shelfs[0].Shelf_UID)
        }
    }, [shelfs])

    useEffect(() => {
        // get books of shelected shelf
        if (selectedShelfUid) {
            getFilesByShelfUid(selectedShelfUid);
        }
    }, [selectedShelfUid]);


    useEffect(() => {
        getUserShelf();
        if (shelfUidTab) {
            setSelectedShelfUid(shelfUidTab);
        }
        setCurrentFile({})
    }, []);

    return (
        <div className="max-w-7xl sm:px-6 lg:px-8">
            
            {
                shelfName && sharedBy
                    ? <div className="flex">
                        <h1 className="flex-1 text-xl font-bold text-gray-900">{shelfName}</h1>
                        <div className="text-indigo-700 flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 inline" /> 
                            <span>{sharedBy}</span>
                        </div>
                    </div>
                    :<PageTitleAction pageTitle="My books" />
            }

            {/* Tabs */}
            <div className="mt-3 sm:mt-2">
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                        Select a shelf
                    </label>
                    <select
                        id="tabs"
                        name="tabs"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        defaultValue="Recently Viewed"
                    >
                        {
                            shelfs.map((shelf) => (
                                <option onClick={() => setSelectedShelfUid(shelf.Shelf_UID)} key={shelf.Shelf_UID}>{shelf.Shelf_Name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="hidden sm:block">
                    <div className="flex items-center border-b border-gray-200">
                        <nav className="flex-1 -mb-px flex space-x-6 xl:space-x-8" aria-label="Tabs">
                            {shelfs.map((shelf) => (
                                <button
                                    onClick={() => setSelectedShelfUid(shelf.Shelf_UID)}
                                    key={shelf.Shelf_UID}
                                    className={classNames(
                                        shelf.Shelf_UID == selectedShelfUid
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                    )}
                                >
                                    {shelf.Shelf_Name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Gallery */}
            <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
                <ul
                    role="list"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                >
                    {filesOfShelf.map((file) => (
                        <li onClick={() => {
                            setSelectedFileUid(file.File_UID);
                            openFile(file);
                        }} key={file.File_UID} className="relative">
                            <div
                                className={classNames(
                                    file.File_UID == selectedFileUid
                                        ? 'ring-2 ring-offset-2 ring-indigo-500'
                                        : 'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500',
                                    'group block w-full aspect-w-10 aspect-h-12 rounded-lg bg-gray-100 overflow-hidden shadow-xl cursor-pointer'
                                )}
                            >

                                {
                                    file.Mimetype == "pdf"
                                        ? <img
                                            src={`${process.env.REACT_APP_SERVER_URL}/file/get-thumbnail-url?token=${accessToken}&fileName=${file.File_Name}`}
                                            alt=""
                                            className={classNames(
                                                file.File_UID == selectedFileUid ? '' : 'group-hover:opacity-75',
                                                'object-cover pointer-events-none'
                                            )}
                                        />
                                        : <img
                                            src={bookimage}
                                            alt=""
                                            className={classNames(
                                                file.File_UID == selectedFileUid ? '' : 'group-hover:opacity-75',
                                                'object-cover pointer-events-none'
                                            )}
                                        />
                                }
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for {file.File_Name}</span>
                                </button>
                            </div>
                            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                                {file.Original_Name}
                            </p>
                            <p className="block text-sm font-medium text-gray-500 pointer-events-none">{formatBytes(file.File_Size)}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

export default MyBooks;
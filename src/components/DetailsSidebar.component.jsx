import axios from 'axios';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import CurrentFileContext from '../tools/currentFileContext';
import ShelfListDropdown from './ShelfListDropdown.component';
import {MenuIcon, DotsCircleHorizontalIcon} from "@heroicons/react/outline"
import { useStore } from 'react-redux';
import { XCircleIcon } from '@heroicons/react/solid';



const DetailsSidebar = () => {
    const accessToken = reactLocalStorage.get("accessToken");
    const { currentFile, setCurrentFile } = useContext(CurrentFileContext);
    const [openDetails, setOpenDetails] = useState(false);

    const history = useHistory();

    const handleDeleteBook = (fileUid) => {
        let confirmDelete = window.confirm("Are you sure you want to delete this book?");
        if (confirmDelete) {
            axios.delete(`http://localhost:3001/file?fileUid=${fileUid}`, {
                headers: { "token": accessToken }
            }).then((response) => {
                console.log(response.data)
                history.push("/dashboard");
            }).catch(err => console.log(err));
        }
    }

    if (!currentFile.fileInfo) {
        return (
            <aside className="hidden w-96 bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block"></aside>
        )
    }

    return (
        <aside className="w-full lg:w-96 bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block absolute bottom-0 lg:relative">
            {/* Bottom details toggle panel */}
            <div className="flex justify-center items-center">
                <button
                    onClick={()=>setOpenDetails(!openDetails)}
                    type="button"
                    className="space-x-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {openDetails?<XCircleIcon className="h-6"/>:<MenuIcon className="h-6" />}
                    <span>{openDetails?"Close":currentFile.fileInfo.fileUid?"View details":"Save to shelf"}</span>
                </button>
            </div>

            {
                openDetails
                ?<div className="pb-16 space-y-6">
                <div className="mt-4 flex items-start justify-between">
                    <div className="space-y-6">
                        <h2 className="text-md lg:text-xl font-medium text-gray-900">
                            <span className="sr-only">Details for </span>
                            {currentFile.fileInfo ? currentFile.fileInfo.name : null}
                        </h2>
                        {/* only uploaded file has fileUid */}
                        {
                            currentFile.fileInfo.fileUid
                                ? null
                                : <ShelfListDropdown />
                        }


                    </div>
                </div>
                <div>
                    <h3 className="font-medium text-gray-900">File Information</h3>
                    <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                        {currentFile.fileInfo ? Object.keys(currentFile.fileInfo).map((key) => (
                            key !== "name"
                                ? <div key={key} className="py-3 flex justify-between text-sm font-medium">
                                    <dt className="text-gray-500">{key}</dt>
                                    <dd className="text-gray-900">{currentFile.fileInfo[key]}</dd>
                                </div> : null
                        )) : null}
                    </dl>

                    {
                        currentFile.fileInfo.fileUid
                            ? <div className="flex justify-end mt-12">
                                <button
                                    onClick={() => handleDeleteBook(currentFile.fileInfo.fileUid)}
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Delete book
                                </button>
                            </div> : null
                    }
                </div>
            </div>
            :null
            }
        </aside>
    )
}

export default DetailsSidebar
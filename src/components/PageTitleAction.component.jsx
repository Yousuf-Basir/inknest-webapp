import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import CurrentFileContext from "../tools/currentFileContext";
import { MenuAlt2Icon, PlusIcon as PlusIconOutline } from '@heroicons/react/outline'
import formateByte from "../tools/formatByte";
import getFileType from "../tools/GetFileType";

const PageTitleAction = ({pageTitle}) => {
    const history = useHistory();
    const accessToken = reactLocalStorage.get("accessToken");
    const { currentFile, setCurrentFile } = useContext(CurrentFileContext);

    const handleFileDialog = (e) => {
        const fileInputValue = e.target.files[0];

        setCurrentFile({
            file: fileInputValue,
            fileInfo: {
                name: fileInputValue.name,
                size: formateByte(fileInputValue.size),
                type: getFileType(fileInputValue)
            }
        });
        history.push("/fileviewer");
    }

    return (
        <div className="border-b border-gray-200 px-4 py-4 flex items-center justify-between sm:px-6 lg:px-8">
            <div className="flex-1 min-w-0">
                <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">{pageTitle}</h1>
            </div>
            <div className="mt-4 flex sm:mt-0 sm:ml-4">
                <button
                    type="button"
                    className="space-x-2 order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:order-1 sm:ml-3"
                >
                    <PlusIconOutline className="h-6 w-6" aria-hidden="true" />
                    <input onChange={handleFileDialog} className="absolute opacity-0" type="file" />
                    <span>Add book</span>
                </button>
            </div>
        </div>
    )
}

export default PageTitleAction;
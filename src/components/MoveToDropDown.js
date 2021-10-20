/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import axios from 'axios'
import localforage from 'localforage'
import CurrentFileContext from '../tools/currentFileContext'
import { reactLocalStorage } from 'reactjs-localstorage'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const MoveToDropDown = () => {
  const { currentFile, setCurrentFile } = useContext(CurrentFileContext);
  console.log(currentFile.fileInfo.fileUid)

  const accessToken = reactLocalStorage.get("accessToken");

  const [uploadingState, setUploadingState] = useState("notStarted"); // notStarted, started, finished

  // get shelf list
  const [userShelfs, setUserShelfs] = useState([]);
  const getUserShelf = () => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/shelf`, {
      headers: {
        "token": accessToken
      },
    }).then((response) => {
      console.log(response.data.userShelfs)
      setUserShelfs(response.data.userShelfs);
    }).catch(err => console.log(err))
  }


  // handle file upload
  const moveFile = async (selectedShelfUid, selectedShelfName) => {

    axios.post(`${process.env.REACT_APP_SERVER_URL}/move-file`, {
      fileUid: currentFile.fileInfo.fileUid,
      moveToShelfUid: selectedShelfUid
    }, {
      headers: {
        "token": accessToken
      },
    }).then(response => {
      alert("Book moved to " + selectedShelfName + " shelf");
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    getUserShelf();
  }, []);


  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="overflow-hidden relative space-x-2 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md  text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="hidden lg:block">Move to shelf</span>
              <span className="lg:hidden block">Select shelf to move</span>
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
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
              className="cursor-pointer origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {userShelfs.map(shelf => (
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <span
                        onClick={() => { moveFile(shelf.Shelf_UID, shelf.Shelf_Name) }}
                        className={classNames(
                          active ? 'bg-indigo-600 text-white' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        {shelf.Shelf_Name}
                      </span>
                    )}
                  </Menu.Item>
                </div>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default MoveToDropDown;
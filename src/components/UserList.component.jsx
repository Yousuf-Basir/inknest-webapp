/* This example requires Tailwind CSS v2.0+ */
import { useState, useEffect, useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, SearchCircleIcon, ShareIcon, UserIcon } from '@heroicons/react/outline'
import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';

export default function UserList({ openState, setOpenState, setSelectedUser }) {
    const accessToken = reactLocalStorage.get("accessToken");
    const [userList, setUserList] = useState([]);
    const [listVisibility, setListVisibility] = useState(false);
    const [searchValue, setSearchValue] = useState([]);
    const [filteredUser, setFilteredUser] = useState([]);

    const getAllUsers = () => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/listusers`, {
            headers: { "token": accessToken }
        }).then(response => {
            console.log(response.data.userList)
            setUserList(response.data.userList);
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        getAllUsers();
    }, []);


    useEffect(() => {
        if(searchValue.length > 2){
            setFilteredUser(userList.filter(function (el) {
                return el.Email.includes(searchValue)
                    || el.First_Name.includes(searchValue)
                    || el.Last_Name.includes(searchValue) 
            }));
            setListVisibility(true);
        }else{
            setListVisibility(false);
        }
        
    }, [searchValue]);


    return (
        <Transition.Root show={openState} as={Fragment}>
            <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={openState} onClose={setOpenState}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <ShareIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 sm:mt-5">
                                    <Dialog.Title as="h3" className="text-center text-lg leading-6 font-medium text-gray-900">
                                        Select user to share with
                                    </Dialog.Title>

                                    
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <SearchCircleIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                onChange={(e)=>{setSearchValue(e.target.value)}}
                                                type="text"
                                                className="h-8 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
                                                placeholder="Search by name or email"
                                            />
                                        </div>
                                    </div>
                                    {listVisibility
                                        ? <div className="mt-2">
                                            <ul className="divide-y divide-gray-200">
                                                {filteredUser.map((user) => (
                                                    <li
                                                     onClick={()=>{
                                                        setSelectedUser({
                                                            selectedUserUid: user.User_UID, 
                                                            selectedUserName: user.First_Name + " " + user.Last_Name
                                                        })
                                                     }}
                                                     key={user.User_UID} className="py-4 cursor-pointer hover:bg-gray-100">
                                                        <div className="flex space-x-3">
                                                            {/* <img className="h-6 w-6 rounded-full" src={user.First_Name} alt="" /> */}
                                                            <UserIcon className="h-6 w-6 rounded-full" aria-hidden="true" />

                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <h3 className="text-sm font-medium">{user.First_Name + " " + user.Last_Name}</h3>
                                                                    {/* <p className="text-sm text-gray-500">{user.Email}</p> */}
                                                                </div>
                                                                <p className="text-sm text-gray-500">
                                                                    Email: {user.Email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        : null}
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
import { MenuAlt1Icon, MenuAlt2Icon, MenuAlt3Icon } from '@heroicons/react/outline'
import {
  SearchIcon,
} from '@heroicons/react/solid'
import { useDispatch } from 'react-redux'
import { toggle } from '../redux/menuSlice'

const SidebarToggleButton = () => {
    const dispatch = useDispatch();
    const setSidebarOpen = () =>{
        dispatch(toggle());
    }

    return (
        <button
            className="pr-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
        >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
        </button>
    )
}

export default SidebarToggleButton;
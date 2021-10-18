import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import CurrentFileContext from "../tools/currentFileContext";
import Skeleton from "react-loading-skeleton";
import { useStore } from "react-redux";

const Loading = () => {
    const [msg, setMsg] = useState("Getting your book ready");
    useEffect(() => {
        let x = 0;
        setInterval(() => {
            if (x == 0) {
                setMsg("Please be patient");
                x = 1;
            } else {
                setMsg("Getting your book ready");
                x = 0
            }
        }, 7000);
    }, []);
    return (
        <div className="absolute h-full w-full top-0 left-0 bg-gray-700 z-50 bg-opacity-95">
            <div className="w-full h-full flex flex-col justify-center items-center space-y-4">
                <svg class="spinner h-20 w-20" viewBox="0 0 50 50">
                    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                </svg>
                <p className="text-white text-5xl">{msg}</p>
            </div>
        </div>
    )
}

const Explore = () => {
    const myRef = useRef(null)
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookName, setBookName] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);

    const search = () => {
        if (bookName.length < 4) return;
        setSearchLoading(true);
        myRef.current.scrollIntoView();
        axios.get(`${process.env.REACT_APP_SERVER_URL}/search?bookName=${bookName}`).then(listHtml => {
            listHtml.data.searchResult.forEach((element, i) => {
                const doc = new DOMParser().parseFromString(element, "text/html");
                const fileHref = doc.querySelector(".file-left a").getAttribute("href");
                const title = doc.querySelector(".file-left .file-img").getAttribute("title");
                const thumbnail = doc.querySelector(".file-left .file-img").getAttribute("src");
                const size = doc.querySelector("span.fi-size").textContent;

                const fileInfo = {
                    href: fileHref,
                    title: title,
                    thumbnail: thumbnail,
                    size: size,
                }
                setSearchResult(prevValue => {
                    return [...prevValue, fileInfo]
                });
                setSearchLoading(false);
            })
        }).catch(err => { console.log(err); setSearchLoading(false) });
    };

    const getDownloadLink = (href, title) => {
        console.log("sending href ", href);
        setLoading(true);
        let errorTimeout = setTimeout(() => {
            setLoading(false);
        }, 30000);
        axios.post(`${process.env.REACT_APP_SERVER_URL}/getDwonloadLink`, {
            "fileLink": href,
            "bookTitle": title
        }).then(response => {
            console.log(response.data);
            const { fileInfo } = response.data;
            setLoading(false);
            clearTimeout(errorTimeout);

            let confirmDownload = window.confirm("Download this ebook?");
            if (confirmDownload) {
                window.open(fileInfo.fileUrl, '_self');
            }

        }).catch(err => { console.log(err); setLoading(false); alert("Sorry book can not be proccessed. Please try with another item.") });
    }



    return (
        <div className={`bg-white overflow-y-auto ${searchResult.length ? "py-2 sm:py-0" : "py-16 sm:py-24"}`}>
            <div className={`relative ${searchResult.length ? "sm:py-4" : "sm:py-16"}`}>
                {/* Dots in background */}
                <div aria-hidden="true" className="hidden sm:block ">
                    <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50 rounded-r-3xl" />
                    <svg className="absolute top-8 left-1/2 -ml-3" width={404} height={392} fill="none" viewBox="0 0 404 392">
                        <defs>
                            <pattern
                                id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                                x={0}
                                y={0}
                                width={20}
                                height={20}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width={404} height={392} fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)" />
                    </svg>
                </div>
                <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="relative rounded-2xl px-6 py-10 bg-indigo-600 overflow-y-auto shadow-xl sm:px-12 sm:py-20">
                        <div aria-hidden="true" className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0">
                            <svg
                                className="absolute inset-0 h-full w-full"
                                preserveAspectRatio="xMidYMid slice"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 1463 360"
                            >
                                <path
                                    className="text-indigo-500 text-opacity-40"
                                    fill="currentColor"
                                    d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                                />
                                <path
                                    className="text-indigo-700 text-opacity-40"
                                    fill="currentColor"
                                    d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                                />
                            </svg>
                        </div>
                        <div className="relative">
                            <div className="sm:text-center">
                                <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                                    Find your favorit books
                                </h2>
                                <p className="mt-4 mx-auto max-w-2xl text-lg text-indigo-200">
                                    Ask pottasha which book to read next
                                </p>
                            </div>
                            <div className="mt-8 sm:mx-auto sm:max-w-lg sm:flex">
                                <div className="min-w-0 flex-1">
                                    <label htmlFor="cta-email" className="sr-only">
                                        Type book title
                                    </label>
                                    <input
                                        id="cta-email"
                                        type="search"
                                        className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                                        placeholder="Type book title"
                                        onChange={(e) => setBookName(e.target.value)}
                                    />
                                </div>
                                <div className="mt-4 sm:mt-0 sm:ml-3">
                                    <button

                                        onClick={() => search()}
                                        className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Search result list */}
            <div className={`pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-y-auto`}>
                {loading ? <Loading /> : null}
                <h1 className="text-xl">{searchResult.length ? `Search result for ${bookName}` : searchLoading ? "Searching for your book..." : ""}</h1>
                <section className={`mt-8 pb-16`} aria-labelledby="gallery-heading">
                    <ul role="list" className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-5 sm:gap-x-6 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 xl:gap-x-8" >
                        {searchResult.length ? searchResult.map((file, index) => (
                            <li key={index} className="relative cursor-pointer">
                                <div
                                    className="border-2 border-white focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 group flex flex-col justify-center w-full aspect-w-10 aspect-h-12 rounded-lg bg-gray-100 overflow-hidden shadow-xl" >
                                    <img src={file.thumbnail} alt="" className="group-hover:opacity-75" />
                                </div>
                                <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                                    {file.title}
                                </p>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => {
                                            // open pdf file viewer
                                            getDownloadLink(file.href, file.title);
                                        }}
                                        type="button"
                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Download
                                    </button>
                                    <p className="block text-sm font-medium text-gray-500 pointer-events-none">{file.size}</p>
                                </div>
                            </li>
                        )) :
                            Array(10).fill(0).map((val, i) => (
                                <div key={i} className={`${searchLoading ? "block" : "hidden"} px-2 py-2 flex-row justify-center items-center focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 group block w-full aspect-w-10 aspect-h-12 rounded-lg bg-white overflow-hidden shadow-xl`}>
                                    <Skeleton height={150} count={1} />
                                    <Skeleton height={10} count={1} />
                                </div>
                            ))
                        }
                    </ul>
                    
                </section>
            </div>
            <span ref={myRef}></span>
        </div>
    )
}

export default Explore;
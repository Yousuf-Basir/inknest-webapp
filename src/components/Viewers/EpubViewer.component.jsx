import ePub from "epubjs";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import "./epubStyle.css";
import localforage from "localforage";

const EpubViewer = ({ file }) => {

    const [rendition, setRendition] = useState(null);
    var ePubInstance = ePub(file);

    useEffect(() => {
        var _rendition = ePubInstance.renderTo("viewer", {
            manager: "continuous",
            flow: "paginated",

        });
        setRendition(_rendition);
    }, [])

    useEffect(() => {
        if (rendition) {
            ePubInstance.loaded.navigation.then(function (toc) {
                var $select = document.getElementById("toc"),
                    docfrag = document.createDocumentFragment();

                toc.forEach(function (chapter) {
                    var option = document.createElement("option");
                    option.textContent = chapter.label;
                    option.ref = chapter.href;

                    docfrag.appendChild(option);
                });

                $select.appendChild(docfrag);

                $select.onchange = function () {
                    var index = $select.selectedIndex,
                        url = $select.options[index].ref;
                    rendition.display(url);
                    return false;
                };
            });

            var displayed = rendition.display();
            localforage.setItem("pdfThumbnail", null);
        }
    }, [rendition])


    const next = () => {
        console.log(rendition)
        rendition.next();
    }

    const prev = () => {
        rendition.prev()
    }


    return (
        <div className="overflow-x-auto">
            <div className="flex justify-center items-center">
                <span className="z-50 relative inline-flex shadow-sm rounded-md">
                    <button
                        onClick={() => prev()}
                        type="button"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div>
                        <select
                            id="toc"
                            name="location"
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            defaultValue="Canada"
                        >
                        </select>
                    </div>
                    <button
                        onClick={() => next()}
                        type="button"
                        className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </span>
            </div>
            <div id="viewer" className="epub-renderer"></div>
        </div>
    )
}


export default EpubViewer;
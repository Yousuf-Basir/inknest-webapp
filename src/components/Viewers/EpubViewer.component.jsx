import ePub from "epubjs";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import "./epubStyle.css";
import localforage from "localforage";
import html2canvas from "html2canvas";

const EpubViewer = ({ file }) => {

    const [ePubInstance, setEPubInstance] = useState(null);
    const [rendition, setRendition] = useState(null);
    const [vImageSrc, setVImageSrc] = useState("");
    
    useEffect(() => {
        if(file){
            setEPubInstance(ePub(file));
        }
    }, [file]);

    useEffect(()=>{
        if(ePubInstance){
            var _rendition = ePubInstance.renderTo("viewer", {
                manager: "continuous",
                flow: "paginated",
    
            });
            setRendition(_rendition);
        }
    }, [ePubInstance])

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
            setTimeout(() => {getElement();}, 1000)
        }
    }, [rendition])


    const next = () => {
        console.log(rendition)
        rendition.next();
    }

    const prev = () => {
        rendition.prev()
    }

    const getElement = async () => {
        var iframe = document.getElementsByTagName("iframe")[0];
        var iframeBody = iframe.contentWindow.document.getElementsByTagName("body")[0];
        var firstDiv = iframeBody.getElementsByTagName("div")[0];
        // check if first div contains svg with image element
        var svg = iframeBody.querySelector("svg image");
        if(svg){
            var imgSrc = svg.getAttribute("xlink:href");
            setVImageSrc(imgSrc);
            const vImage = document.getElementById("vImage");
            convertToImage(vImage)
        }else{
            convertToImage(firstDiv);
        }
    }

    const convertToImage = (htmlElement) => {
        html2canvas(htmlElement, {
            width: htmlElement.scrollWidth,
            height: htmlElement.scrollHeight
        }).then(canvas => {
            const imageDataUri = canvas.toDataURL("image/webp", 0.2)
            localforage.setItem("pdfThumbnail", imageDataUri);
            const vImage = document.getElementById("vImage");
            if(vImage){vImage.style.display = "none"}
        });
    }


    return (
        <div className="overflow-x-auto">
            <img className="absolute top-0 left-0" id="vImage" src={vImageSrc} style={{objectFit: "contain"}} width="300px" height="400px" alt="" />
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
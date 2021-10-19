import React, { useEffect, useState } from 'react';
// import { Document, Page } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, ZoomOutIcon } from '@heroicons/react/solid'
import localforage from 'localforage';


export default ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageList, setPageList] = useState([1]);
  const [scale, setScale] = useState(1);

  const thumbmaker = (doc) => {
    return new Promise((resolve, reject)=>{
      const imageMaker = async (page) => {
        const viewPort = page.getViewport({scale:0.6})
        const widht = viewPort.width; const height = viewPort.height;
        var canvas = document.createElement("canvas");
        canvas.height = height; canvas.width = widht;
        // @ts-ignore: Unreachable code error
        return page.render({canvasContext: canvas.getContext("2d"), viewport: viewPort}).promise.then(()=> canvas.toDataURL("image/webp", 0.2))
      }
      try{
        doc.getPage(1).then(imageMaker).then((canvas)=>{
          resolve(canvas);
        })
      }catch(err){
        reject();
      }
    })

  }

  function onDocumentLoadSuccess(doc) {
    setNumPages(doc.numPages);
    let pl = [];
    for (var i = 1; i < doc.numPages; i++) {
      pl.push(i);
    }
    setPageList(pl);
    // store currently opened pdf thumbnail to localforage storage
    thumbmaker(doc).then((imageDataUri) => {
      localforage.setItem("pdfThumbnail", imageDataUri)
    }).catch(err => console.log(err));
  }

  if (!file) { return <>No file provided</> }

  useEffect(() => {
    console.log(pageList);
  }, [pageList])

  return (
    <div className="overflow-hidden shadow-2xl">
      {/* page navigation controls */}
      <div className="z-50 flex justify-center items-center space-x-2">
        <span className="z-50 relative inline-flex shadow-sm rounded-md">
          <button
            onClick={() => setPageNumber((pageNumber) => pageNumber - 1)}
            type="button"
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div>
            <select
              onChange={(e) => {
                setPageNumber(Number(e.target.value))

              }}
              id="location"
              name="location"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              defaultValue="Canada"
            >
              {pageList.map(val => (
                <option className="text-center" key={val} value={val}>page: {val}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setPageNumber((pageNumber) => pageNumber + 1)}
            type="button"
            className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </span>


        {/* zoom buttons */}
        <div className="z-50">
        <span className="relative inline-flex shadow-sm rounded-md">
          <button
            onClick={() => setScale((scale) => scale - 0.2)}
            type="button"
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <ZoomOutIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </span>
        <button
          onClick={() => setScale((scale) => scale + 0.2)}
          type="button"
          className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <ZoomInIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        </div>

      </div>

      {/* PDF renderer */}
      <div className="overflow-x-auto t-6">
      <Document
      className="-mt-10"
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        renderMode="canvas"
      >
        <Page
          scale={scale}
          pageNumber={pageNumber}

          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
      </div>
      {/* <p>Page {pageNumber} of {numPages}</p> */}
    </div>
  );
}
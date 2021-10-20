import {MobiFile} from "../../tools/mobi.js";
import { useEffect } from "react";
import localforage from "localforage";

const MobiViewer = ({file}) => {
    useEffect(() => {
        new Response(file).arrayBuffer().then((arrayBuffer) => {
            new MobiFile(arrayBuffer).render_to("book");
        }).catch((err) => console.log(err));

        localforage.setItem("pdfThumbnail", null);
    }, [file])
    return(
        <div id="book" className="w-4/6 mt-5">

        </div>
    )
}

export default MobiViewer;
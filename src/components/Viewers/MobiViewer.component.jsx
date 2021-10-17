import {MobiFile} from "../../tools/mobi.js";
import { useEffect } from "react";

const MobiViewer = ({file}) => {
    useEffect(() => {
        
        new Response(file).arrayBuffer().then((arrayBuffer) => {
            new MobiFile(arrayBuffer).render_to("book");
        }).catch((err) => console.log(err));
    }, [file])
    return(
        <div id="book" className="w-4/6 mt-5">

        </div>
    )
}

export default MobiViewer;
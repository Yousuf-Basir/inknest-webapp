import { createContext } from "react";

// read this to know how context can be used
// https://dmitripavlutin.com/react-context-and-usecontext/
const CurrentFileContext = createContext({
    currentFile: {
        // file blob
        file: null,
        // file information object
        fileInfo: null
    },
    setCurrentFile: (currentFile)=>{}
});

export default CurrentFileContext;
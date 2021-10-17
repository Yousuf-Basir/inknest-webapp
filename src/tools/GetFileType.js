const getFileType = (file) => {
    if(file.type){
        switch(file.type){
            case "application/pdf":
                return "pdf"
            case "application/x-mobipocket-ebook":
                return "mobi"
            case "application/octet-stream":
                return "kindle"
            case "application/epub+zip":
                return "epub"
            default:
                return ""
        }
    }else{
        const ext = file.name.split(".").pop();
        
        switch(ext){
            case "pdf":
                return "pdf"
            case "mobi":
                return "mobi"
            case "azw3":
                return "kindle"
            case "epub":
                return "epub"
            default:
                return ""
        }
    }
}

export default getFileType;
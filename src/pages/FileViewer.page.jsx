import { useContext } from "react";
import DetailsSidebar from "../components/DetailsSidebar.component";
import EpubViewer from "../components/Viewers/EpubViewer.component";
import MobiViewer from "../components/Viewers/MobiViewer.component";
import PdfViewerComponent from "../components/Viewers/PdfViewer.component";
import CurrentFileContext from "../tools/currentFileContext";

const FileViewer = () => {
    const {currentFile, setCurrentFile} = useContext(CurrentFileContext);

    return (
        <div className="flex flex-col md:flex-row items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
                {/* File viewers */}
                <div className="flex justify-center">
                    {
                        currentFile.fileInfo
                            ? currentFile.fileInfo.type === "pdf"
                                ? <PdfViewerComponent file={currentFile.file} />
                                : currentFile.fileInfo.type === "epub"
                                    ? <EpubViewer file={currentFile.file} />
                                    : currentFile.fileInfo.type === "kindle" || currentFile.fileInfo.type === "mobi"
                                        ? <MobiViewer file={currentFile.file} />
                                        : "null"
                            : null

                    }
                </div>
            </main>
            <DetailsSidebar />
        </div>
    )
}

export default FileViewer;
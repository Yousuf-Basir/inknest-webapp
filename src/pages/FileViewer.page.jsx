import DetailsSidebar from "../components/DetailsSidebar.component";

const FileViewer = () => {
    return(
        <div className="flex flex-col md:flex-row items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
                {/* File viewer... */}
                <p>Never</p>
            </main>
            <DetailsSidebar />
        </div>
    )
}

export default FileViewer;
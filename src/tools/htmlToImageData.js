import html2canvas from "html2canvas";

const htmlToImageData = (element) => {
    html2canvas().then(function(canvas) {
        console.log(canvas);
    });
}

export default htmlToImageData;
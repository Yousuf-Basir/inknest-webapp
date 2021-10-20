import html2canvas from "html2canvas";

const htmlToImageData = (element) => {
    console.log(element)
    return new Promise((resolve, reject) => {
        html2canvas(element).then(function(canvas) {
            resolve(canvas)
         });
    })
}

export default htmlToImageData;
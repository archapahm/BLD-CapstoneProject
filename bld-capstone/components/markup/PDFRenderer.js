import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.mjs";

self.onmessage = (e) => {
    //start pdf rendering tasks
    //debugger;
    let msg = e.data;
    const PDFRenderingAsyncFunc = async () => {
        const document = {
            fonts: self.fonts,
            createElement: (name) => {
                if (name == 'canvas') {
                    return new OffscreenCanvas(1, 1);
                }
                return null;
            },
        };

        const loadingTask = pdfjsLib.getDocument({
            url: new URL(msg.pdfURL),
            ownerDocument: document
        });
        let pdf = await loadingTask.promise;
        let imageArray = [];
        let pageNumberEnd = (msg.pagesStart + 1) + msg.pagesToComplete;
        for (let pageNumber = (msg.pagesStart + 1); pageNumber < pageNumberEnd; pageNumber++) {
            let page = await pdf.getPage(pageNumber);
            var scale = 1;
            var viewport = page.getViewport({ scale: scale });

            var canvas = new OffscreenCanvas(viewport.width, viewport.height);
            var context = canvas.getContext('2d');
            var renderContext = { canvasContext: context, viewport: viewport };

            var renderTask = page.render(renderContext);
            await renderTask.promise;

            let blob = await canvas.convertToBlob({ type: "image/jpeg" });
            imageArray.push(URL.createObjectURL(blob));
        }
        self.postMessage({
            workerIndex: msg.workerIndex,
            workerImageArray: imageArray,
            workerPageStart: msg.pagesStart
        });
    }
    PDFRenderingAsyncFunc();
}
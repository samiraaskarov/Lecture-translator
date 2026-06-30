/**
 * Lecture Translator AI - PDF Helper
 * Extracts text from selectable PDFs client-side using PDF.js
 */

const PdfHelper = (function() {
    // PDF.js global library object is expected to be loaded via CDN script in the HTML.
    
    /**
     * Extracts all readable text from a PDF file.
     * @param {File} file - The file object uploaded by user
     * @returns {Promise<string>} - Resolves with the extracted text, or rejects with an error
     */
    function extractText(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                return reject(new Error("No file provided."));
            }
            if (file.type !== "application/pdf") {
                return reject(new Error("Selected file is not a PDF."));
            }

            // Verify pdfjsLib is loaded
            if (typeof pdfjsLib === 'undefined') {
                return reject(new Error("PDF parsing engine is currently loading. Please try again."));
            }

            // Set up worker source if not set
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            }

            const reader = new FileReader();

            reader.onload = function(event) {
                const typedarray = new Uint8Array(event.target.result);

                // Load PDF document
                const loadingTask = pdfjsLib.getDocument({ data: typedarray });
                loadingTask.promise.then(pdf => {
                    const maxPages = pdf.numPages;
                    const pageTextPromises = [];

                    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
                        pageTextPromises.push(
                            pdf.getPage(pageNum).then(page => {
                                return page.getTextContent().then(textContent => {
                                    return textContent.items.map(item => item.str).join(' ');
                                });
                            })
                        );
                    }

                    Promise.all(pageTextPromises).then(pagesText => {
                        const fullText = pagesText.join('\n\n').trim();
                        
                        if (!fullText) {
                            // Empty string means no selectable text was found, indicating scanned images
                            reject(new Error("This PDF contains images instead of selectable text."));
                        } else {
                            resolve(fullText);
                        }
                    }).catch(err => {
                        console.error("Error concatenating pages text:", err);
                        reject(new Error("Failed to read text pages from this PDF."));
                    });

                }).catch(err => {
                    console.error("PDF loading task error:", err);
                    reject(new Error("Invalid PDF file. The file may be corrupted."));
                });
            };

            reader.onerror = function() {
                reject(new Error("Failed to read the file. Please try again."));
            };

            reader.readAsArrayBuffer(file);
        });
    }

    return {
        extractText
    };
})();

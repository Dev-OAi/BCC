document.addEventListener('DOMContentLoaded', async () => {
    const { PDFDocument } = PDFLib;

    const form = document.getElementById('application-form');
    const fillPdfBtn = document.getElementById('fill-pdf-btn');
    const downloadBtn = document.getElementById('download-btn');
    const pdfViewer = document.getElementById('pdf-viewer');
    const previewPdfBtn = document.getElementById('preview-pdf-btn');
    const pdfColumn = document.getElementById('pdf-column');

    let pdfDoc;

    async function loadPdf() {
        const pdfUrl = './business-credit-card-application.pdf';
        const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
        pdfDoc = await PDFDocument.load(existingPdfBytes);
        renderPdf();
    }

    async function renderPdf() {
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        pdfViewer.src = url;
    }

    fillPdfBtn.addEventListener('click', async () => {
        const pdfForm = pdfDoc.getForm();

        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            try {
                if (input.type === 'checkbox') {
                    if (input.checked) {
                        const field = pdfForm.getCheckBox(input.name);
                        field.check();
                    }
                } else {
                    const field = pdfForm.getTextField(input.name);
                    field.setText(input.value);
                }
            } catch (error) {
                console.warn(`Could not find or set field: ${input.name}`);
            }
        });

        renderPdf();
    });

    downloadBtn.addEventListener('click', async () => {
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'filled-application.pdf';
        link.click();
    });

    previewPdfBtn.addEventListener('click', () => {
        pdfColumn.classList.toggle('pdf-column-visible');
    });

    pdfColumn.addEventListener('click', (e) => {
        if (e.target === pdfColumn) {
            pdfColumn.classList.remove('pdf-column-visible');
        }
    });

    loadPdf();
});

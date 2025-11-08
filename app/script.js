const initializeApp = async () => {
    const { PDFDocument } = PDFLib;

    const form = document.getElementById('application-form');
    const fillPdfBtn = document.getElementById('fill-pdf-btn');
    const downloadBtn = document.getElementById('download-btn');
    const pdfViewer = document.getElementById('pdf-viewer');
    const previewPdfBtn = document.getElementById('preview-pdf-btn');
    const pdfColumn = document.getElementById('pdf-column');
    const resetBtn = document.getElementById('reset-btn');

    // New document scanner elements
    const documentType = document.getElementById('document-type');
    const documentUpload = document.getElementById('document-upload');
    const documentPreview = document.getElementById('document-preview');
    const scanDocumentBtn = document.getElementById('scan-document-btn');

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

    resetBtn.addEventListener('click', () => {
        form.reset();
        documentPreview.style.display = 'none';
        documentPreview.src = '#';
        documentUpload.value = '';
        loadPdf();
    });

    documentUpload.addEventListener('change', (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                documentPreview.src = e.target.result;
                documentPreview.style.display = 'block';
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    scanDocumentBtn.addEventListener('click', async () => {
        if (!documentPreview.src || documentPreview.src.endsWith('#')) {
            alert('Please upload a document image first.');
            return;
        }

        scanDocumentBtn.textContent = 'Scanning...';
        scanDocumentBtn.disabled = true;

        const { data: { text } } = await Tesseract.recognize(
            documentPreview.src,
            'eng',
            { logger: m => console.log(m) }
        );

        const selectedDocumentType = documentType.value;
        if (selectedDocumentType === 'business-card') {
            parseBusinessCard(text);
        } else if (selectedDocumentType === 'drivers-license') {
            parseDriversLicense(text);
        }

        scanDocumentBtn.textContent = 'Scan Document';
        scanDocumentBtn.disabled = false;
    });

    function parseBusinessCard(text) {
        const data = {};
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        const phoneRegex = /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?/g;
        const nameRegex = /([A-Z][a-z]+)\s([A-Z][a-z]+)/;

        const emailMatch = text.match(emailRegex);
        if (emailMatch) data.email = emailMatch[0];

        const phoneMatch = text.match(phoneRegex);
        if (phoneMatch) data.phone = phoneMatch[0];

        const nameMatch = text.match(nameRegex);
        if (nameMatch) data.name = nameMatch[0];

        const lines = text.split('\n');
        if (lines.length > 1) {
            // Correctly assign the second line to the company name
            data.company = lines[1];
        }

        autofillForm(data, 'business-card');
    }

    function parseDriversLicense(text) {
        const data = {};
        const nameRegex = /^([A-Z]+ [A-Z](?: [A-Z]+)?)/m;
        const addressRegex = /(\d+ .*\n.*, \w{2} \d{5})/;
        const dobRegex = /DOB:?\s*(\d{2}[-/]\d{2}[-/]\d{4})/;

        const nameMatch = text.match(nameRegex);
        if (nameMatch) data.name = nameMatch[0].trim();

        const addressMatch = text.match(addressRegex);
        if (addressMatch) {
            const addressLines = addressMatch[0].split('\n');
            data.address_street = addressLines[0];
            const cityStateZip = addressLines[1].match(/(.*), (\w{2}) (\d{5})/);
            if (cityStateZip) {
                data.address_city = cityStateZip[1];
                data.address_state = cityStateZip[2];
                data.address_zip = cityStateZip[3];
            }
        }

        const dobMatch = text.match(dobRegex);
        if (dobMatch) data.dob = dobMatch[1].replace(/-/g, '/');

        autofillForm(data, 'drivers-license');
    }

    function autofillForm(data, type) {
        if (type === 'business-card') {
            if (data.name) document.getElementById('applicant-name').value = data.name;
            if (data.company) document.getElementById('business-name').value = data.company;
            if (data.phone) document.getElementById('business-phone').value = data.phone;
            if (data.email) document.getElementById('email-address').value = data.email;
        } else if (type === 'drivers-license') {
            if (data.name) document.getElementById('applicant-name').value = data.name;
            if (data.address_street) document.getElementById('applicant-home-address').value = data.address_street;
            if (data.address_city) document.getElementById('applicant-city').value = data.address_city;
            if (data.address_state) document.getElementById('applicant-state').value = data.address_state;
            if (data.address_zip) document.getElementById('applicant-zip').value = data.address_zip;
            if (data.dob) document.getElementById('applicant-dob').value = data.dob;
        }
    }

    loadPdf();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

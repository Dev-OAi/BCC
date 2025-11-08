const initializeApp = async () => {
    const { PDFDocument } = PDFLib;

    const form = document.getElementById('application-form');
    const fillPdfBtn = document.getElementById('fill-pdf-btn');
    const downloadBtn = document.getElementById('download-btn');
    const pdfViewer = document.getElementById('pdf-viewer');
    const resetBtn = document.getElementById('reset-btn');

    // Document scanner elements
    const documentType = document.getElementById('document-type');
    const documentUpload = document.getElementById('document-upload');
    const documentPreview = document.getElementById('document-preview');
    const scanDocumentBtn = document.getElementById('scan-document-btn');
    const scanCameraBtn = document.getElementById('scan-camera-btn');

    // Sidebar elements
    const leftSidebarToggle = document.getElementById('left-sidebar-toggle');
    const rightSidebarToggle = document.getElementById('right-sidebar-toggle');
    const leftSidebar = document.getElementById('left-sidebar');
    const rightSidebar = document.getElementById('right-sidebar');
    const backdrop = document.getElementById('backdrop');

    // Navigation elements
    const homeBtn = document.getElementById('home-btn');
    const pdfTemplatesBtn = document.getElementById('pdf-templates-btn');
    const formColumn = document.getElementById('form-column');
    const pdfTemplatesColumn = document.getElementById('pdf-templates-column');
    const pdfUpload = document.getElementById('pdf-upload');
    const processPdfBtn = document.getElementById('process-pdf-btn');
    const pdfPreview = document.getElementById('pdf-preview');
    const dynamicForm = document.getElementById('dynamic-form');

    let pdfDoc;

    homeBtn.addEventListener('click', () => {
        formColumn.style.display = 'block';
        pdfTemplatesColumn.style.display = 'none';
    });

    pdfTemplatesBtn.addEventListener('click', () => {
        formColumn.style.display = 'none';
        pdfTemplatesColumn.style.display = 'block';
    });

    if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
    }

    async function loadPdf() {
        try {
            const pdfUrl = './business-credit-card-application.pdf';
            const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
            pdfDoc = await PDFDocument.load(existingPdfBytes);
            renderPdf();
        } catch (error) {
            console.error("Failed to load PDF:", error);
        }
    }

    async function renderPdf() {
        try {
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            pdfViewer.src = url;
        } catch (error) {
            console.error("Failed to render PDF:", error);
        }
    }

    function toggleSidebar(sidebar) {
        const isOpen = sidebar.classList.toggle('open');
        backdrop.classList.toggle('visible', leftSidebar.classList.contains('open') || rightSidebar.classList.contains('open'));
    }

    function closeSidebars() {
        leftSidebar.classList.remove('open');
        rightSidebar.classList.remove('open');
        backdrop.classList.remove('visible');
    }

    leftSidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar(leftSidebar);
    });

    rightSidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar(rightSidebar);
    });

    backdrop.addEventListener('click', closeSidebars);

    fillPdfBtn.addEventListener('click', async () => {
        const pdfForm = pdfDoc.getForm();
        let activeForm;
        if (pdfTemplatesColumn.style.display === 'block') {
            activeForm = dynamicForm;
        } else {
            activeForm = form;
        }

        const inputs = activeForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            try {
                if (input.type === 'checkbox') {
                    if (input.checked) {
                        pdfForm.getCheckBox(input.name).check();
                    }
                } else if (input.tagName.toLowerCase() === 'select') {
                    pdfForm.getTextField(input.name).setText(input.value);
                } else {
                    pdfForm.getTextField(input.name).setText(input.value);
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
        performOcr();
    });

    scanCameraBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            // This part is a placeholder for a more complex camera UI
            alert('Camera access granted. Taking a snapshot in 3 seconds.');
            setTimeout(() => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                documentPreview.src = canvas.toDataURL('image/png');
                documentPreview.style.display = 'block';
                stream.getTracks().forEach(track => track.stop());
                performOcr();
            }, 3000);
        } catch (error) {
            handlePermissionsError(error);
        }
    });

    async function performOcr() {
        scanDocumentBtn.textContent = 'Scanning...';
        scanDocumentBtn.disabled = true;
        try {
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
        } catch (error) {
            console.error('Error during OCR scanning:', error);
            alert('An error occurred during scanning. Please check the console for more details.');
        } finally {
            scanDocumentBtn.textContent = 'Scan Document';
            scanDocumentBtn.disabled = false;
        }
    }

    function handlePermissionsError(error) {
        console.error('Permission error:', error);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            alert('Camera access was denied. Please enable camera permissions in your browser settings to use this feature.');
        } else {
            alert('An error occurred while trying to access the camera. Please ensure your browser supports camera access and that you have a working camera.');
        }
    }

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

    processPdfBtn.addEventListener('click', async () => {
        if (!pdfUpload.files || pdfUpload.files.length === 0) {
            alert('Please select a PDF file first.');
            return;
        }
        processPdf(pdfUpload.files[0]);
    });

    async function processPdf(file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const pdfBytes = event.target.result;
            pdfDoc = await PDFDocument.load(pdfBytes);

            dynamicForm.innerHTML = '';

            const form = pdfDoc.getForm();
            const fields = form.getFields();

            fields.forEach(field => {
                const label = document.createElement('label');
                label.textContent = field.getName();

                let input;
                if (field instanceof PDFLib.PDFTextField) {
                    input = document.createElement('input');
                    input.type = 'text';
                } else if (field instanceof PDFLib.PDFCheckBox) {
                    input = document.createElement('input');
                    input.type = 'checkbox';
                }

                if (input) {
                    input.name = field.getName();
                    dynamicForm.appendChild(label);
                    dynamicForm.appendChild(input);
                    dynamicForm.appendChild(document.createElement('br'));
                }
            });

            renderPdfPreview(pdfBytes);
        };
        reader.readAsArrayBuffer(file);
    }

    async function renderPdfPreview(pdfBytes) {
        if (!window.pdfjsLib) {
            console.error('pdf.js is not loaded.');
            return;
        }
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });

        const canvas = pdfPreview;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        await page.render(renderContext).promise;
    }

    loadPdf();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

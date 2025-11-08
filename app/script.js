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

    let pdfDoc;

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

    form.addEventListener('input', () => {
        const formData = {};
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.id] = input.checked;
            } else {
                formData[input.id] = input.value;
            }
        });
        localStorage.setItem('savedFormData', JSON.stringify(formData));
    });

    fillPdfBtn.addEventListener('click', async () => {
        const pdfForm = pdfDoc.getForm();
        const inputs = form.querySelectorAll('input, select');
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
        if (confirm("Are you sure you want to reset the form? This will clear all fields and remove any saved data.")) {
            form.reset();
            localStorage.removeItem('savedFormData');
            documentPreview.style.display = 'none';
            documentPreview.src = '#';
            documentUpload.value = '';
            loadPdf();
        }
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

    function validateInput(input, regex, errorMessage) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (!regex.test(input.value)) {
            errorElement.textContent = errorMessage;
            input.classList.add('invalid');
        } else {
            errorElement.textContent = '';
            input.classList.remove('invalid');
        }
    }

    form.addEventListener('input', (e) => {
        switch (e.target.id) {
            case 'email-address':
            case 'applicant-business-email':
            case 'applicant2-business-email':
            case 'cardholder1-business-email':
            case 'cardholder2-business-email':
            case 'cardholder3-business-email':
                validateInput(e.target, /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email address.');
                break;
            case 'applicant-ssn':
            case 'applicant2-ssn':
            case 'cardholder1-ssn':
            case 'cardholder2-ssn':
            case 'cardholder3-ssn':
                validateInput(e.target, /^\d{3}-\d{2}-\d{4}$/, 'Invalid SSN (must be XXX-XX-XXXX).');
                break;
            case 'applicant-dob':
            case 'applicant2-dob':
            case 'cardholder1-dob':
            case 'cardholder2-dob':
            case 'cardholder3-dob':
                validateInput(e.target, /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, 'Invalid date format (must be MM/DD/YYYY).');
                break;
            case 'business-phone':
            case 'applicant-home-phone':
            case 'applicant2-home-phone':
                validateInput(e.target, /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Invalid phone number.');
                break;
        }
    });

    function loadSavedData() {
        const savedData = localStorage.getItem('savedFormData');
        if (savedData) {
            if (confirm("Would you like to restore your previously saved data?")) {
                const formData = JSON.parse(savedData);
                for (const key in formData) {
                    const input = document.getElementById(key);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = formData[key];
                        } else {
                            input.value = formData[key];
                        }
                    }
                }
            }
        }
    }

    loadPdf();
    loadSavedData();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

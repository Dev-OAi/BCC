const initializeApp = async () => {
    const { PDFDocument } = PDFLib;

    const form = document.getElementById('application-form');
    const fillPdfBtn = document.getElementById('fill-pdf-btn');
    const downloadBtn = document.getElementById('download-btn');
    const pdfImage = document.getElementById('pdf-image');
    const pdfOverlays = document.getElementById('pdf-overlays');
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

    const fieldCoordinates = {
        'CREDIT LINE REQUESTED': { top: '10.5%', left: '25%' },
        'Business Name to appear on card': { top: '12.5%', left: '25%' },
        'Tax Identification Number': { top: '14.5%', left: '25%' },
        'Type of Business': { top: '16.5%', left: '25%' },
        'Business Address street address': { top: '18.5%', left: '25%' },
        'City': { top: '20.5%', left: '25%' },
        'State': { top: '20.5%', left: '60%' },
        'Zip Code': { top: '20.5%', left: '80%' },
        'Mailing Address if different from Business Address': { top: '22.5%', left: '25%' },
        'City_2': { top: '24.5%', left: '25%' },
        'State_2': { top: '24.5%', left: '60%' },
        'Zip Code_2': { top: '24.5%', left: '80%' },
        'Business Phone': { top: '26.5%', left: '25%' },
        'Primary Banking Relationship': { top: '28.5%', left: '25%' },
        'Branch Location': { top: '30.5%', left: '25%' },
        'Email Address': { top: '32.5%', left: '25%' },
        'Date of Origin': { top: '34.5%', left: '25%' },
        'Years in Business': { top: '34.5%', left: '60%' },
        'Gross Annual Revenue': { top: '36.5%', left: '25%' },
        'Number of Employees': { top: '38.5%', left: '25%' },
        'Name on Card first last': { top: '44%', left: '25%' },
        'Title if any': { top: '46%', left: '25%' },
        'Of Ownership': { top: '46%', left: '60%' },
        'Annual Income': { top: '48%', left: '25%' },
        'Social Security NumberITIN': { top: '50%', left: '25%' },
        'Home Address street address': { top: '52%', left: '25%' },
        'City_3': { top: '54%', left: '25%' },
        'State_3': { top: '54%', left: '60%' },
        'Zip_3': { top: '54%', left: '80%' },
        'Date of Birth': { top: '56%', left: '25%' },
        'Home Phone': { top: '58%', left: '25%' },
        'Business Email Address': { top: '60%', left: '25%' },
        'Mothers Maiden Name': { top: '62%', left: '25%' },
    };

    async function loadPdf() {
        try {
            const pdfUrl = './business-credit-card-application.pdf';
            const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
            pdfDoc = await PDFDocument.load(existingPdfBytes);
            pdfImage.src = './business-credit-card-application.png';
        } catch (error) {
            console.error("Failed to load PDF:", error);
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

    form.addEventListener('input', (e) => {
        const { name, value } = e.target;
        let overlay = document.getElementById(`overlay-${name}`);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = `overlay-${name}`;
            overlay.classList.add('pdf-overlay');
            pdfOverlays.appendChild(overlay);
        }
        overlay.textContent = value;
        if (fieldCoordinates[name]) {
            overlay.style.top = fieldCoordinates[name].top;
            overlay.style.left = fieldCoordinates[name].left;
        }
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

    loadPdf();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

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


  // Navigation elements
  const homeBtn = document.getElementById('home-btn');
  const pdfTemplatesBtn = document.getElementById('pdf-templates-btn');
  const formColumn = document.getElementById('form-column');
  const pdfTemplatesColumn = document.getElementById('pdf-templates-column');
  const pdfUpload = document.getElementById('pdf-upload');
  const processPdfBtn = document.getElementById('process-pdf-btn');
  const pdfPreview = document.getElementById('pdf-preview');
  const dynamicForm = document.getElementById('dynamic-form');

  // Share and Resume Modal elements
  const saveEmailBtn = document.getElementById('save-email-btn');
  const emailModal = document.getElementById('email-modal');
  const resumeModal = document.getElementById('resume-modal');
  const closeButton = document.querySelector('.close-button');
  const generateLinkBtn = document.getElementById('generate-link-btn');
  const encryptionPassword = document.getElementById('encryption-password');
  const mailtoLink = document.getElementById('mailto-link');
  const generatedLinkContainer = document.getElementById('generated-link-container');
  const decryptionPassword = document.getElementById('decryption-password');
  const unlockDataBtn = document.getElementById('unlock-data-btn');


  let pdfDoc, templatePdfDoc;

  homeBtn.addEventListener('click', () => {
    formColumn.style.display = 'block';
    pdfTemplatesColumn.style.display = 'none';
  });

  pdfTemplatesBtn.addEventListener('click', () => {
    formColumn.style.display = 'none';
    pdfTemplatesColumn.style.display = 'block';
  });

  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
  }

  const fieldCoordinates = {
    'CREDIT LINE REQUESTED': { top: '10.5%', left: '25%' },
    'Business Name to appear on card': { top: '12.5%', left: '25%' },
    'Tax Identification Number': { top: '14.5%', left: '25%' },
    'Type of Business': { top: '16.5%', left: '25%' },
    'Business Address street address': { top: '18.5%', left: '25%' },
    City: { top: '20.5%', left: '25%' },
    State: { top: '20.5%', left: '60%' },
    'Zip Code': { top: '20.5%', left: '80%' },
    'Mailing Address if different from Business Address': { top: '22.5%', left: '25%' },
    City_2: { top: '24.5%', left: '25%' },
    State_2: { top: '24.5%', left: '60%' },
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
    City_3: { top: '54%', left: '25%' },
    State_3: { top: '54%', left: '60%' },
    Zip_3: { top: '54%', left: '80%' },
    'Date of Birth': { top: '56%', left: '25%' },
    'Home Phone': { top: '58%', left: '25%' },
    'Business Email Address': { top: '60%', left: '25%' },
    'Mothers Maiden Name': { top: '62%', left: '25%' },
  };





  async function loadPdf() {
    try {
      const pdfUrl = 'business-credit-card-application.pdf';
      const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
      pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfImage.src = 'business-credit-card-application.png';
    } catch (error) {
      console.error('Failed to load PDF:', error);
    }
  }

  function toggleSidebar(sidebar, toggleBtn) {
    const isOpen = sidebar.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    backdrop.classList.toggle(
      'visible',
      leftSidebar.classList.contains('open') || rightSidebar.classList.contains('open')
    );
  }

  function closeSidebars() {
    leftSidebar.classList.remove('open');
    rightSidebar.classList.remove('open');
    leftSidebarToggle.setAttribute('aria-expanded', 'false');
    rightSidebarToggle.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('visible');
  }

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      (leftSidebar.classList.contains('open') || rightSidebar.classList.contains('open'))
    ) {
      closeSidebars();
    }
  });

  leftSidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar(leftSidebar, leftSidebarToggle);
  });

  rightSidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar(rightSidebar, rightSidebarToggle);
  });

  backdrop.addEventListener('click', closeSidebars);

  saveEmailBtn.addEventListener('click', () => {
    emailModal.style.display = 'flex';
  });

  closeButton.addEventListener('click', () => {
    emailModal.style.display = 'none';
  });

  generateLinkBtn.addEventListener('click', () => {
    const password = encryptionPassword.value;
    if (password.length < 8) {
      alert('Please use a password of at least 8 characters.');
      return;
    }

    const formData = {};
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach((input) => {
      if (input.type === 'checkbox') {
        formData[input.id] = input.checked;
      } else {
        formData[input.id] = input.value;
      }
    });

    const jsonString = JSON.stringify(formData);
    const compressed = pako.deflate(jsonString, { to: 'string' });
    const encrypted = CryptoJS.AES.encrypt(compressed, password).toString();
    const base64 = btoa(encrypted);

    const url = new URL(window.location.href);
    url.hash = base64;

    mailtoLink.href = `mailto:?subject=Saved BCC Application&body=Here is your saved application link: ${url.href}`;
    generatedLinkContainer.style.display = 'block';
  });

  form.addEventListener('input', (e) => {
    // Part 1: Overlay and localStorage logic
    const { name, value, id } = e.target;
    let overlay = document.getElementById(`overlay-${name}`);
    if (name && fieldCoordinates[name]) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = `overlay-${name}`;
        overlay.classList.add('pdf-overlay');
        pdfOverlays.appendChild(overlay);
      }
      overlay.textContent = value;
      overlay.style.top = fieldCoordinates[name].top;
      overlay.style.left = fieldCoordinates[name].left;
    }

    // Save all form data to localStorage
    const formData = {};
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach((input) => {
      if (input.type === 'checkbox') {
        formData[input.id] = input.checked;
      } else {
        formData[input.id] = input.value;
      }
    });
    localStorage.setItem('savedFormData', JSON.stringify(formData));

    // Part 2: Validation logic
    switch (id) {
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
        validateInput(
          e.target,
          /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
          'Invalid date format (must be MM/DD/YYYY).'
        );
        break;
      case 'business-phone':
      case 'applicant-home-phone':
      case 'applicant2-home-phone':
        validateInput(e.target, /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Invalid phone number.');
        break;
    }
  });

  fillPdfBtn.addEventListener('click', async () => {
    let currentPdfDoc = pdfDoc;
    let activeForm = form;

    if (pdfTemplatesColumn.style.display === 'block') {
      currentPdfDoc = templatePdfDoc;
      activeForm = dynamicForm;
    }

    if (!currentPdfDoc) {
      alert('Please load or upload a PDF first.');
      return;
    }

    const pdfForm = currentPdfDoc.getForm();
    const inputs = activeForm.querySelectorAll('input, select');
    inputs.forEach((input) => {
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
    let currentPdfDoc = pdfDoc;
    if (pdfTemplatesColumn.style.display === 'block') {
      currentPdfDoc = templatePdfDoc;
    }

    if (!currentPdfDoc) {
      alert('No PDF document is available for download.');
      return;
    }

    const pdfBytes = await currentPdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'filled-application.pdf';
    link.click();
  });

  resetBtn.addEventListener('click', () => {
    if (
      confirm(
        'Are you sure you want to reset the form? This will clear all fields and remove any saved data.'
      )
    ) {
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
        stream.getTracks().forEach((track) => track.stop());
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
      const {
        data: { text },
      } = await Tesseract.recognize(documentPreview.src, 'eng', { logger: (m) => console.log(m) });
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
      alert(
        'Camera access was denied. Please enable camera permissions in your browser settings to use this feature.'
      );
    } else {
      alert(
        'An error occurred while trying to access the camera. Please ensure your browser supports camera access and that you have a working camera.'
      );
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
      if (data.address_street)
        document.getElementById('applicant-home-address').value = data.address_street;
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
      templatePdfDoc = await PDFDocument.load(pdfBytes);

      dynamicForm.innerHTML = '';

      const form = templatePdfDoc.getForm();
      const fields = form.getFields();

      fields.forEach((field) => {
        const fieldName = field.getName();
        const label = document.createElement('label');
        label.textContent = fieldName;
        dynamicForm.appendChild(label);

        if (field instanceof PDFLib.PDFTextField) {
          const input = document.createElement('input');
          input.type = 'text';
          input.name = fieldName;
          dynamicForm.appendChild(input);
        } else if (field instanceof PDFLib.PDFCheckBox) {
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.name = fieldName;
          dynamicForm.appendChild(input);
        } else if (field instanceof PDFLib.PDFDropdown) {
          const select = document.createElement('select');
          select.name = fieldName;
          const options = field.getOptions();
          options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
          });
          dynamicForm.appendChild(select);
        } else if (field instanceof PDFLib.PDFRadioGroup) {
          const options = field.getOptions();
          options.forEach((option) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = fieldName;
            input.value = option;

            const radioLabel = document.createElement('label');
            radioLabel.textContent = option;

            dynamicForm.appendChild(input);
            dynamicForm.appendChild(radioLabel);
          });
        }
        dynamicForm.appendChild(document.createElement('br'));
      });

      const fillButton = document.createElement('button');
      fillButton.textContent = 'Fill PDF';
      fillButton.addEventListener('click', () => fillPdfBtn.click());
      dynamicForm.appendChild(fillButton);

      renderPdfPreview(pdfBytes);
    };
    reader.readAsArrayBuffer(file);
  }

  async function renderPdfPreview(pdfBytes) {
    if (!window.pdfjsLib) {
      console.error('pdf.js is not loaded.');
      return;
    }
    console.log('Rendering PDF preview...');
    try {
      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
      const pdf = await loadingTask.promise;
      console.log('PDF loaded for preview.');
      const page = await pdf.getPage(1);
      console.log('Got page 1 for preview.');
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = pdfPreview;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      console.log(`Canvas dimensions set to: ${canvas.width}x${canvas.height}`);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
      console.log('PDF preview rendered.');
    } catch (error) {
      console.error('Error rendering PDF preview:', error);
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


  function loadSavedData() {
    const savedData = localStorage.getItem('savedFormData');
    if (savedData) {
      if (confirm('Would you like to restore your previously saved data?')) {
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
  loadSharedData();

  function loadSharedData() {
    if (window.location.hash) {
      resumeModal.style.display = 'flex';
    }

    unlockDataBtn.addEventListener('click', () => {
      const password = decryptionPassword.value;
      if (!password) {
        alert('Please enter a password.');
        return;
      }

      try {
        const base64 = window.location.hash.substring(1);
        const encrypted = atob(base64);
        const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);
        const jsonString = pako.inflate(decrypted, { to: 'string' });
        const formData = JSON.parse(jsonString);

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
        resumeModal.style.display = 'none';
      } catch (error) {
        console.error('Decryption failed:', error);
        alert('Failed to decrypt data. Please check your password and try again.');
      }
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

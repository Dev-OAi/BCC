const initializeApp = async () => {
  const { PDFDocument } = PDFLib;

  // --- Main Content Sections ---
  const formColumn = document.getElementById('form-column');
  const pdfTemplatesColumn = document.getElementById('pdf-templates-column');
  const productFinderColumn = document.getElementById('product-finder-column');
  const accountFinderColumn = document.getElementById('account-finder-column');
  const pointGridColumn = document.getElementById('point-grid-column');
  const salesLogContent = document.getElementById('sales-log-content');
  const afinderContent = document.getElementById('afinder-content');


  // --- Sidebar & Navigation ---
  const leftSidebarToggle = document.getElementById('left-sidebar-toggle');
  const rightSidebarToggle = document.getElementById('right-sidebar-toggle');
  const leftSidebar = document.getElementById('left-sidebar');
  const rightSidebar = document.getElementById('right-sidebar');
  const backdrop = document.getElementById('backdrop');
  const homeBtn = document.getElementById('home-btn');
  const pointGridBtn = document.getElementById('point-grid-btn');
  const salesLogBtn = document.getElementById('sales-log-btn');
  const afinderBtn = document.getElementById('afinder-btn');


  // --- Business Card Application Elements ---
  const form = document.getElementById('application-form');
  const fillPdfBtn = document.getElementById('fill-pdf-btn');
  const downloadBtn = document.getElementById('download-btn');
  const resetBtn = document.getElementById('reset-btn');
  const pdfImage = document.getElementById('pdf-image');
  const pdfOverlays = document.getElementById('pdf-overlays');

  // Document scanner elements
  const documentType = document.getElementById('document-type');
  const documentUpload = document.getElementById('document-upload');
  const documentPreview = document.getElementById('document-preview');
  const scanDocumentBtn = document.getElementById('scan-document-btn');
  const scanCameraBtn = document.getElementById('scan-camera-btn');

  // PDF Templates Elements
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

  // --- SPA Navigation Logic ---
  const hideAllContent = () => {
    formColumn.style.display = 'none';
    pdfTemplatesColumn.style.display = 'none';
    productFinderColumn.style.display = 'none';
    accountFinderColumn.style.display = 'none';
    pointGridColumn.style.display = 'none';
    salesLogContent.style.display = 'none';
    afinderContent.style.display = 'none';
  };

  homeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllContent();
    formColumn.style.display = 'block';
  });

  pointGridBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllContent();
    pointGridColumn.style.display = 'block';
    renderPointGrid();
  });

  function renderPointGrid() {
    const container = document.getElementById('point-grid-container');
    container.innerHTML = ''; // Clear existing content

    for (const category in productData) {
      const categoryHeader = document.createElement('h3');
      categoryHeader.innerText = category;
      container.appendChild(categoryHeader);

      for (const subCategory in productData[category]) {
        const subCategoryHeader = document.createElement('h4');
        subCategoryHeader.innerText = subCategory;
        container.appendChild(subCategoryHeader);

        const table = document.createElement('table');
        table.innerHTML = `
          <thead>
            <tr>
              <th>PRODUCT/SERVICE</th>
              <th>POINTS PER PRODUCT</th>
              <th>MINIMUM BALANCE THRESHOLD</th>
              <th>BALANCE TIERS</th>
              <th>TIER POINTS</th>
            </tr>
          </thead>
        `;
        const tbody = document.createElement('tbody');
        productData[category][subCategory].forEach(product => {
          product.tiers.forEach((tier, index) => {
            const row = document.createElement('tr');
            if (index === 0) {
              row.innerHTML = `
                <td rowspan="${product.tiers.length}">${product.product}</td>
                <td rowspan="${product.tiers.length}">${product.points}</td>
                <td rowspan="${product.tiers.length}">${product.min_balance}</td>
                <td>${tier.range}</td>
                <td>${tier.points}</td>
              `;
            } else {
              row.innerHTML = `
                <td>${tier.range}</td>
                <td>${tier.points}</td>
              `;
            }
            tbody.appendChild(row);
          });
        });
        table.appendChild(tbody);
        container.appendChild(table);
      }
    }
  }

  salesLogBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllContent();
    salesLogContent.style.display = 'block';
  });

  afinderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllContent();
    afinderContent.style.display = 'block';
    renderAfinderTable();
  });

  // --- "Client Relationship Builder" Logic ---
  const findProductBtn = document.getElementById('find-product-btn');
  findProductBtn.addEventListener('click', () => {
    const businessType = document.getElementById('business-type-select').value;
    const businessRevenue = document.getElementById('business-revenue').value;
    const transactionVolume = document.getElementById('transaction-volume').value;
    const productRecommendation = document.getElementById('product-recommendation');

    let recommendation = '';
    if (businessRevenue > 1000000 && transactionVolume > 1000) {
      recommendation = 'Platinum Business Suite';
    } else if (businessRevenue > 500000 || transactionVolume > 500) {
      recommendation = 'Gold Business Package';
    } else {
      recommendation = 'Silver Business Essentials';
    }

    productRecommendation.innerHTML = `<h3>Recommended Product:</h3><p>${recommendation}</p>`;
  });

  // --- "Daily Sales Activity Log" Logic ---
  const logActivityBtn = document.getElementById('log-activity-btn');
  const salesLogDisplay = document.getElementById('sales-log-display');
  const salesLog = [];

  logActivityBtn.addEventListener('click', () => {
    const activityType = document.getElementById('activity-type').value;
    const clientName = document.getElementById('client-name').value;
    const notes = document.getElementById('notes').value;

    if (clientName && notes) {
      salesLog.push({ activityType, clientName, notes, date: new Date().toLocaleString() });
      renderSalesLog();
      document.getElementById('sales-log-form').reset();
    } else {
      alert('Please fill out all fields.');
    }
  });

  function renderSalesLog() {
    salesLogDisplay.innerHTML = '<h3>Activity Log:</h3>';
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Date</th>
          <th>Activity Type</th>
          <th>Client Name</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${salesLog.map(log => `
          <tr>
            <td>${log.date}</td>
            <td>${log.activityType}</td>
            <td>${log.clientName}</td>
            <td>${log.notes}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
    salesLogDisplay.appendChild(table);
  }

  // --- "Account Finder" Logic ---
  const afinderTable = document.getElementById('afinder-table');
  const accountData = [
    { name: 'John Doe', accountNumber: '123456789', type: 'Checking', balance: '$5,000' },
    { name: 'Jane Smith', accountNumber: '987654321', type: 'Savings', balance: '$10,000' },
    { name: 'Peter Jones', accountNumber: '112233445', type: 'Checking', balance: '$2,500' }
  ];

  function renderAfinderTable() {
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          <th>Account Number</th>
          <th>Type</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        ${accountData.map(account => `
          <tr>
            <td>${account.name}</td>
            <td>${account.accountNumber}</td>
            <td>${account.type}</td>
            <td>${account.balance}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
    afinderTable.innerHTML = '';
    afinderTable.appendChild(table);
  }


  // --- Business Card Application Logic ---

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
      if(pdfImage) pdfImage.src = 'business-credit-card-application.png';
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

  encryptionPassword.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      generateLinkBtn.click();
    }
  });

  form.addEventListener('input', (e) => {
    const { name, value, id } = e.target;
    // ... (rest of the input handling logic)
  });

  fillPdfBtn.addEventListener('click', async () => {
    if (!pdfDoc) {
      alert('PDF not loaded yet. Please wait.');
      return;
    }

    const formFields = pdfDoc.getForm().getFields();
    const fieldNames = formFields.map(f => f.getName());

    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      const name = input.name;
      if (fieldNames.includes(name)) {
        const field = pdfDoc.getForm().getField(name);
        if (input.type === 'checkbox') {
          if (input.checked) {
            field.check();
          } else {
            field.uncheck();
          }
        } else if (input.type === 'radio') {
          if (input.checked) {
            // This assumes radio button groups have the same name
            const radioGroup = pdfDoc.getForm().getRadioGroup(name);
            radioGroup.select(input.value);
          }
        } else {
          field.setText(input.value);
        }
      }
    });
    alert('PDF filled. Ready to download.');
  });

  downloadBtn.addEventListener('click', async () => {
    if (!pdfDoc) {
      alert('PDF not filled yet. Please click "Fill PDF" first.');
      return;
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'filled-application.pdf';
    link.click();

    // Reload the original PDF to allow for re-filling
    await loadPdf();
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    alert('Form has been reset.');
  });

  documentUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        documentPreview.src = e.target.result;
        documentPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  scanDocumentBtn.addEventListener('click', async () => {
    if (!documentUpload.files[0]) {
      alert('Please upload a document first.');
      return;
    }
    await performOcr(documentPreview.src);
  });

  scanCameraBtn.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', ''); // required to work on iOS
      video.play();

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const captureFrame = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        documentPreview.src = dataUrl;
        documentPreview.style.display = 'block';
        performOcr(dataUrl);
        stream.getTracks().forEach(track => track.stop());
      };
      // Simple capture after a delay, a more robust solution would have a capture button
      setTimeout(captureFrame, 2000);

    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert('Could not access camera. Please ensure you have given permission.');
    }
  });

  async function performOcr(image) {
    const status = document.createElement('p');
    status.innerText = 'Performing OCR...';
    form.prepend(status);

    try {
        const { data: { text } } = await Tesseract.recognize(image, 'eng');
        status.innerText = 'OCR complete.';
        const type = documentType.value;
        const parsedData = type === 'business-card' ? parseBusinessCard(text) : parseDriversLicense(text);
        autofillForm(parsedData, type);
    } catch (error) {
        console.error('OCR Error:', error);
        status.innerText = 'OCR failed. Please try again.';
    }
  }

  function parseBusinessCard(text) {
    const data = {};
    const lines = text.split('\n');
    lines.forEach(line => {
        if (line.match(/@/)) data['Email Address'] = line.trim();
        if (line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) data['Business Phone'] = line.trim();
    });
    // Basic parsing, would need to be more robust for production
    if (lines[0]) data['Business Name to appear on card'] = lines[0].trim();
    if (lines[1]) data['Name on Card first last'] = lines[1].trim();
    return data;
  }

  function parseDriversLicense(text) {
    const data = {};
    const lines = text.split('\n');
    // Highly dependent on DL format, this is a simplified example
    lines.forEach(line => {
        if (line.startsWith('1 ')) data['Home Address street address'] = line.substring(2).trim();
        if (line.startsWith('2 ')) data['Name on Card first last'] = line.substring(2).trim();
        if (line.includes('DOB')) data['Date of Birth'] = line.split(' ').pop();
    });
    return data;
  }

  function autofillForm(data) {
    for (const key in data) {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = data[key];
        }
    }
  }

  processPdfBtn.addEventListener('click', async () => {
    if (!pdfUpload.files[0]) {
      alert('Please upload a PDF template first.');
      return;
    }
    await processPdf(pdfUpload.files[0]);
  });

  async function processPdf(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const pdfBytes = e.target.result;
      templatePdfDoc = await PDFDocument.load(pdfBytes);
      renderPdfPreview(pdfBytes);

      const formFields = templatePdfDoc.getForm().getFields();
      dynamicForm.innerHTML = '';
      formFields.forEach(field => {
        const div = document.createElement('div');
        const label = document.createElement('label');
        label.innerText = field.getName();
        const input = document.createElement('input');
        input.name = field.getName();
        input.type = 'text';
        div.appendChild(label);
        div.appendChild(input);
        dynamicForm.appendChild(div);
      });
    };
    reader.readAsArrayBuffer(file);
  }

  async function renderPdfPreview(pdfBytes) {
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    pdfPreview.height = viewport.height;
    pdfPreview.width = viewport.width;
    const renderContext = {
      canvasContext: pdfPreview.getContext('2d'),
      viewport: viewport,
    };
    page.render(renderContext);
  }

  function validateInput(input, regex, errorMessage) {
    const errorElement = document.getElementById(`${input.id}-error`);
    if (!regex.test(input.value)) {
      errorElement.textContent = errorMessage;
      return false;
    } else {
      errorElement.textContent = '';
      return true;
    }
  }

  function loadSavedData() {
    // load saved data logic
  }

  function loadSharedData() {
    // load shared data logic
  }

  // Initial setup
  hideAllContent();
  pointGridColumn.style.display = 'block';
  loadPdf();
  loadSavedData();
  loadSharedData();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

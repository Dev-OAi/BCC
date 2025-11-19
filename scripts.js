document.addEventListener('DOMContentLoaded', () => {
    // --- Global Data & Configuration ---
    const salesLogState = {
        // ... sales log state data
    };

    // --- DOM Elements ---
    const navHome = document.getElementById('nav-home');
    const navAfinder = document.getElementById('nav-afinder');
    const navSalesLog = document.getElementById('nav-sales-log');
    const navBcard = document.getElementById('nav-bcard');
    const vindexContent = document.getElementById('vindex-content');
    const afinderContent = document.getElementById('afinder-content');
    const salesLogContent = document.getElementById('sales-log-content');
    const bcardContent = document.getElementById('bcard-content');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .sidebar-link');
    const mainContent = document.querySelector('.main-content');
    const tocList = document.getElementById('toc-list');

    // --- Core Navigation ---
    function hideAllContent() {
        if (vindexContent) vindexContent.style.display = 'none';
        if (afinderContent) afinderContent.style.display = 'none';
        if (salesLogContent) salesLogContent.style.display = 'none';
        if (bcardContent) bcardContent.style.display = 'none';
    }

    function updateActiveLink(activeLink) {
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            // Remove the arrow span if it exists
            const arrow = link.querySelector('.active-arrow');
            if(arrow) arrow.remove();
        });
        if (activeLink) {
            activeLink.classList.add('active');
            // Add the arrow span for the active link
            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'active-arrow';
            activeLink.prepend(arrowSpan);
        }
    }

    // --- Dynamic TOC Generation & Highlighting ---
    let headingOffsets = [];

    function generateTOC(contentSelector) {
        if (!mainContent || !tocList) return;

        tocList.innerHTML = ''; // Clear existing TOC
        headingOffsets = []; // Reset heading offsets

        const headings = mainContent.querySelectorAll(`${contentSelector} h2[id], ${contentSelector} h3[id]`);

        if (headings.length === 0) {
            tocList.innerHTML = '<li><a href="#" class="text-gray-500">No topics on this page.</a></li>';
            return;
        }

        headings.forEach(heading => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            listItem.appendChild(link);
            if (heading.tagName === 'H3') listItem.classList.add('toc-nested');
            tocList.appendChild(listItem);

            headingOffsets.push({
                id: heading.id,
                element: heading,
                linkElement: link
            });
        });
        updateActiveTOCLinkOnScroll(); // Initial update
    }

    function updateActiveTOCLinkOnScroll() {
        if (headingOffsets.length === 0) return;

        const activationOffset = mainContent.clientHeight * 0.3;
        const scrollPosition = mainContent.scrollTop;

        let activeHeading = null;
        for (let i = headingOffsets.length - 1; i >= 0; i--) {
            if (headingOffsets[i].element.offsetTop < scrollPosition + activationOffset) {
                activeHeading = headingOffsets[i];
                break;
            }
        }

        headingOffsets.forEach(offset => {
            offset.linkElement.classList.toggle('active', offset === activeHeading);
        });
    }

    mainContent.addEventListener('scroll', updateActiveTOCLinkOnScroll);

    // --- Initialization Functions for each "Page" ---
    function initVindex() { /* ... vIndex shell logic ... */ }

    function initAfinder() {
        // Check if the function has already run
        if (initAfinder.hasRun) return;
        initAfinder.hasRun = true;

        const categorySelect = document.getElementById('category');
        const subCategorySelect = document.getElementById('subCategory');
        const groupSelect = document.getElementById('group');
        const productNameSelect = document.getElementById('productName');
        const balanceInput = document.getElementById('balance');
        const calculateBtn = document.getElementById('calculate');
        const resultDiv = document.getElementById('result');
        const pointsSpan = document.getElementById('points');
        const resetButton = document.getElementById('reset');

        // Populate Category dropdown
        const categories = [...new Set(productData.map(p => p.category))];
        categories.forEach(c => {
            const option = document.createElement('option');
            option.value = c;
            option.textContent = c;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener('change', () => {
            subCategorySelect.innerHTML = '<option value="">Select Sub-Category</option>';
            groupSelect.innerHTML = '<option value="">Select Group</option>';
            productNameSelect.innerHTML = '<option value="">Select Product Name</option>';
            balanceInput.style.display = 'none';

            const selectedCategory = categorySelect.value;
            const subCategories = [...new Set(productData.filter(p => p.category === selectedCategory && p.subCategory).map(p => p.subCategory))];

            if (subCategories.length > 0) {
                subCategorySelect.style.display = 'block';
                subCategories.forEach(sc => {
                    const option = document.createElement('option');
                    option.value = sc;
                    option.textContent = sc;
                    subCategorySelect.appendChild(option);
                });
            } else {
                subCategorySelect.style.display = 'none';
                populateGroups(selectedCategory);
            }
        });

        subCategorySelect.addEventListener('change', () => {
            groupSelect.innerHTML = '<option value="">Select Group</option>';
            productNameSelect.innerHTML = '<option value="">Select Product Name</option>';
            balanceInput.style.display = 'none';
            populateGroups(categorySelect.value, subCategorySelect.value);
        });

        function populateGroups(category, subCategory) {
            const filtered = productData.filter(p => p.category === category && (p.subCategory === subCategory || !p.subCategory));
            const groups = [...new Set(filtered.filter(p => p.group).map(p => p.group))];

            if (groups.length > 0) {
                groupSelect.style.display = 'block';
                groups.forEach(g => {
                    const option = document.createElement('option');
                    option.value = g;
                    option.textContent = g;
                    groupSelect.appendChild(option);
                });
            } else {
                groupSelect.style.display = 'none';
                populateProducts(category, subCategory);
            }
        }

        groupSelect.addEventListener('change', () => {
            productNameSelect.innerHTML = '<option value="">Select Product Name</option>';
            balanceInput.style.display = 'none';
            populateProducts(categorySelect.value, subCategorySelect.value, groupSelect.value);
        });

        function populateProducts(category, subCategory, group) {
            const filtered = productData.filter(p =>
                p.category === category &&
                (p.subCategory === subCategory || !p.subCategory) &&
                (p.group === group || !p.group)
            );
            const productNames = [...new Set(filtered.map(p => p.productName))];
            productNameSelect.innerHTML = '<option value="">Select Product Name</option>'; // Clear previous
            productNames.forEach(pn => {
                const option = document.createElement('option');
                option.value = pn;
                option.textContent = pn;
                productNameSelect.appendChild(option);
            });
        }

        productNameSelect.addEventListener('change', () => {
            const selectedProduct = productData.find(p => p.productName === productNameSelect.value);
            if (selectedProduct && selectedProduct.balanceTiers) {
                balanceInput.style.display = 'block';
            } else {
                balanceInput.style.display = 'none';
            }
        });

        calculateBtn.addEventListener('click', () => {
            const selectedProduct = productData.find(p => p.productName === productNameSelect.value);
            let points = 0;

            if (selectedProduct) {
                if (selectedProduct.balanceTiers) {
                    const balance = parseFloat(balanceInput.value);
                    if (isNaN(balance)) {
                        alert("Please enter a valid balance.");
                        return;
                    }
                    if (selectedProduct.minBalanceThreshold && balance < parseFloat(selectedProduct.minBalanceThreshold.replace('$', ''))) {
                       points = 0;
                    } else {
                        // Special handling for string-based pointsPerProduct in tiered products
                        if (typeof selectedProduct.pointsPerProduct === 'string' && selectedProduct.pointsPerProduct.includes("1st Balance Tier")) {
                            points = selectedProduct.balanceTiers[0].points;
                        } else {
                           for (const tier of selectedProduct.balanceTiers) {
                                const range = tier.range.replace(/[$,+]/g, '').split(' - ');
                                const min = parseFloat(range[0]);
                                const max = range[1] ? parseFloat(range[1]) : Infinity;
                                if (balance >= min && balance <= max) {
                                    points = tier.points;
                                    break;
                                }
                            }
                        }
                    }
                } else if (selectedProduct.pointsPerProduct) {
                     // Check for minBalanceThreshold on non-tiered products
                    if (selectedProduct.minBalanceThreshold) {
                         const balance = parseFloat(balanceInput.value);
                         if (!isNaN(balance) && balance >= parseFloat(selectedProduct.minBalanceThreshold.replace('$', ''))) {
                             points = selectedProduct.pointsPerProduct;
                         } else {
                             points = 0; // Balance doesn't meet threshold
                         }
                    } else {
                       points = selectedProduct.pointsPerProduct;
                    }
                }
            }

            pointsSpan.textContent = points;
            resultDiv.style.display = 'block';
        });

        resetButton.addEventListener('click', () => {
            categorySelect.selectedIndex = 0;
            subCategorySelect.innerHTML = '<option value="">Select Sub-Category</option>';
            groupSelect.innerHTML = '<option value="">Select Group</option>';
            productNameSelect.innerHTML = '<option value="">Select Product Name</option>';

            subCategorySelect.style.display = 'block';
            groupSelect.style.display = 'block';

            balanceInput.style.display = 'none';
            balanceInput.value = '';

            resultDiv.style.display = 'none';
            pointsSpan.textContent = '0';
        });
    }

    function initSalesLog() {
        if (initSalesLog.hasRun) return;
        initSalesLog.hasRun = true;

        const state = {
                callEntries: [
                    { id: 'call-1', time: '09:30', client: 'Innovate Inc.', contact: 'John Smith', callType: 'Follow-up', outcome: 'Confirmed interest, scheduled demo for Friday.', nextAction: 'Send demo confirmation email.', followUpDate: '2025-11-14' }
                ],
                emailEntries: [
                    { id: 'email-1', timeSent: '11:00', client: 'Solutions LLC', subject: 'Re: Proposal', emailType: 'Proposal', responseReceived: true, nextStep: 'Follow up call tomorrow.' }
                ],
                meetingEntries: [
                    { id: 'meeting-1', time: '14:00', client: 'Global Tech', attendees: 'Sarah Brown, Mike Lee', meetingType: 'Closing', summary: 'Finalized contract terms. Positive outcome.', outcome: 'Deal closed.', nextAction: 'Send final contract for signature.', followUpDate: '2025-11-11' }
                ],
                metrics: [
                    { metric: 'Total Calls', number: 0, comments: '' },
                    { metric: 'Total Emails', number: 0, comments: '' },
                    { metric: 'Total Meetings', number: 0, comments: '' },
                    { metric: 'New Leads Generated', number: 0, comments: '' },
                    { metric: 'Deals in Pipeline', number: 0, comments: '' },
                    { metric: 'Deals Closed Today', number: 0, comments: '' },
                    { metric: 'Revenue Closed (if applicable)', number: 0, comments: '' },
                ],
                isSaving: false,
                isPrintingBlank: false
            };

            // --- CONFIGURATION ---
            const LOG_CONFIG = {
                call: {
                    title: '1. Call Log',
                    entries: state.callEntries,
                    columns: ['Time', 'Client/Company', 'Contact Person', 'Call Type', 'Outcome', 'Next Action', 'Follow-up Date'],
                    columnWidths: { 'Time': 'w-[8%]', 'Client/Company': 'w-[15%]', 'Contact Person': 'w-[14%]', 'Call Type': 'w-[12%]', 'Outcome': 'w-[20%]', 'Next Action': 'w-[19%]', 'Follow-up Date': 'w-[12%]' },
                    getEmptyEntry: () => ({ id: `call-${Date.now()}`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), client: '', contact: '', callType: 'New', outcome: '', nextAction: '', followUpDate: new Date().toISOString().split('T')[0] }),
                    getSummary: (entries) => [
                        { label: 'Total Calls Made', value: entries.length },
                        { label: 'Successful Conversations', value: entries.filter(c => c.outcome.toLowerCase().includes('confirm') || c.outcome.toLowerCase().includes('schedul')).length },
                        { label: 'Appointments Set', value: entries.filter(c => c.outcome.toLowerCase().includes('schedul') || c.outcome.toLowerCase().includes('appoint')).length },
                    ]
                },
                email: {
                    title: '2. Email Log',
                    entries: state.emailEntries,
                    columns: ['Time Sent', 'Client/Company', 'Subject', 'Email Type', 'Response', 'Next Step'],
                    columnWidths: { 'Time Sent': 'w-[10%]', 'Client/Company': 'w-[20%]', 'Subject': 'w-[25%]', 'Email Type': 'w-[15%]', 'Response': 'w-[10%]', 'Next Step': 'w-[20%]' },
                    getEmptyEntry: () => ({ id: `email-${Date.now()}`, timeSent: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), client: '', subject: '', emailType: 'Intro', responseReceived: false, nextStep: '' }),
                    getSummary: (entries) => [
                        { label: 'Total Emails Sent', value: entries.length },
                        { label: 'Responses Received', value: entries.filter(e => e.responseReceived).length },
                        { label: 'Proposals Sent', value: entries.filter(e => e.emailType === 'Proposal').length },
                    ]
                },
                meeting: {
                    title: '3. Meeting Log',
                    entries: state.meetingEntries,
                    columns: ['Time', 'Client/Company', 'Attendees', 'Meeting Type', 'Summary', 'Outcome', 'Next Action', 'Follow-up Date'],
                    columnWidths: { 'Time': 'w-[8%]', 'Client/Company': 'w-[12%]', 'Attendees': 'w-[12%]', 'Meeting Type': 'w-[10%]', 'Summary': 'w-[17%]', 'Outcome': 'w-[15%]', 'Next Action': 'w-[14%]', 'Follow-up Date': 'w-[12%]' },
                    getEmptyEntry: () => ({ id: `meeting-${Date.now()}`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), client: '', attendees: '', meetingType: 'Intro', summary: '', outcome: '', nextAction: '', followUpDate: new Date().toISOString().split('T')[0] }),
                    getSummary: (entries) => [
                        { label: 'Total Meetings Held', value: entries.length },
                        { label: 'Deals Closed', value: entries.filter(m => m.outcome.toLowerCase().includes('closed') || m.outcome.toLowerCase().includes('deal')).length },
                    ]
                }
            };

            // --- UTILITY & RENDER FUNCTIONS ---
            const baseInputClasses = "w-full text-sm px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900";

            function autoSizeTextarea(el) {
                setTimeout(() => {
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                }, 0);
            }

            function renderInput(entry, field, type, isBlank = false) {
                const value = entry[field];
                const commonProps = `class="${baseInputClasses}" data-id="${entry.id}" data-field="${field}" data-type="${type}"`;

                if (typeof value === 'boolean') {
                    return `<div class="flex items-center justify-center h-full">
                                <input type="checkbox" ${value ? 'checked' : ''} ${commonProps.replace('class="', 'class="h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 ')} />
                            </div>`;
                }

                if (isBlank && (field.toLowerCase().includes('date') || field.toLowerCase().includes('time'))) {
                    return `<input type="text" value="" ${commonProps} />`;
                }

                if (field.toLowerCase().includes('date')) return `<input type="date" value="${value}" ${commonProps} />`;
                if (field.toLowerCase().includes('time')) return `<input type="time" value="${value}" ${commonProps} />`;

                if (field.toLowerCase().includes('type')) {
                    const optionsMap = { call: ['New', 'Follow-up'], email: ['Intro', 'Follow-up', 'Proposal', 'Other'], meeting: ['Intro', 'Follow-up', 'Closing'] };
                    const options = optionsMap[type] || [];
                    const selectedValue = isBlank ? '' : value;
                    const optionsHtml = options.map(opt => `<option value="${opt}" ${opt === selectedValue ? 'selected' : ''}>${opt}</option>`).join('');
                    return `<select ${commonProps}><option value=""></option>${optionsHtml}</select>`;
                }

                return `<textarea rows="1" ${commonProps} style="overflow-y: hidden; resize: vertical;">${value}</textarea>`;
            }

            function renderLogSection(type) {
                const config = LOG_CONFIG[type];
                const container = document.getElementById(`${type}-log-section`);
                if (!container) return;

                const summaryItems = state.isPrintingBlank
                    ? config.getSummary([])
                    : config.getSummary(config.entries);

                const tableRows = config.entries.map(entry => {
                    const cells = Object.keys(config.getEmptyEntry()).filter(key => key !== 'id').map(field =>
                        `<td class="p-1 border border-gray-200 align-top">${renderInput(entry, field, type, state.isPrintingBlank)}</td>`
                    ).join('');
                    return `<tr data-id="${entry.id}">
                                ${cells}
                                <td class="p-1 border border-gray-200 text-center align-middle no-print">
                                    <button class="remove-entry-btn text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors" data-id="${entry.id}" data-type="${type}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 pointer-events-none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </td>
                            </tr>`;
                }).join('');

                const headers = config.columns.map(col => `<th class="p-2 border border-gray-200 font-semibold text-gray-800 bg-gray-100 ${config.columnWidths[col] || ''}">${col}</th>`).join('');
                const summaryHtml = summaryItems.map(item => `<div key="${item.label}">
                                <span class="text-gray-600">${item.label}:</span>
                                <span class="font-bold ml-2 text-gray-800">${item.value}</span>
                            </div>`).join('');

                const content = `
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-gray-700" id="${type}-log-title">${config.title}</h2>
                        <button class="add-entry-btn no-print inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" data-type="${type}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add Entry
                        </button>
                    </div>
                    ${config.entries.length > 0 ? `
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left border-collapse">
                                <thead><tr class="bg-gray-100">${headers}<th class="p-2 border border-gray-200 w-12 no-print bg-gray-100"></th></tr></thead>
                                <tbody>${tableRows}</tbody>
                            </table>
                        </div>` :
                        `<div class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <p class="text-gray-500">No entries added yet. Click "Add Entry" to start logging.</p>
                         </div>`
                    }
                    <div class="mt-4 bg-gray-50 p-2 rounded-md text-sm">
                        <h4 class="font-semibold text-gray-700 mb-2">Summary of ${config.title.split('. ')[1]}:</h4>
                        <div class="flex flex-wrap gap-x-8 gap-y-2">${summaryHtml}</div>
                    </div>`;

                container.innerHTML = content;
                container.querySelectorAll('textarea').forEach(autoSizeTextarea);
            }

            function renderMetrics() {
                const container = document.getElementById('metrics-section');
                if (!container) return;

                const rows = state.metrics.map((metric, index) => `
                    <tr>
                        <td class="p-2 border border-gray-200 align-middle font-medium text-gray-900">${metric.metric}</td>
                        <td class="p-1 border border-gray-200 align-middle">
                            <input type="number" value="${metric.number}" data-index="${index}" data-field="number" class="metric-input w-full text-sm p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" />
                        </td>
                        <td class="p-1 border border-gray-200 align-middle">
                            <input type="text" value="${metric.comments}" data-index="${index}" data-field="comments" class="metric-input w-full text-sm p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" />
                        </td>
                    </tr>
                `).join('');

                container.innerHTML = `
                    <h2 class="text-xl font-bold text-gray-700 mb-4" id="daily-summary-metrics">4. Daily Summary & Metrics</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-100">
                                    <th class="p-2 border border-gray-200 font-semibold text-gray-800 w-1/3 bg-gray-100">METRIC</th>
                                    <th class="p-2 border border-gray-200 font-semibold text-gray-800 w-1/6 bg-gray-100">NUMBER</th>
                                    <th class="p-2 border border-gray-200 font-semibold text-gray-800 bg-gray-100">COMMENTS</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>`;
            }

            function updateMetrics() {
                if (state.isPrintingBlank) {
                    state.metrics.forEach(m => { m.number = 0; });
                    return;
                }
                const callSummary = LOG_CONFIG.call.getSummary(state.callEntries);
                const emailSummary = LOG_CONFIG.email.getSummary(state.emailEntries);
                const meetingSummary = LOG_CONFIG.meeting.getSummary(state.meetingEntries);

                state.metrics[0].number = callSummary.find(s => s.label === 'Total Calls Made').value;
                state.metrics[1].number = emailSummary.find(s => s.label === 'Total Emails Sent').value;
                state.metrics[2].number = meetingSummary.find(s => s.label === 'Total Meetings Held').value;
                // Note: Other metrics are manually entered, except for this one
                state.metrics[5].number = meetingSummary.find(s => s.label === 'Deals Closed').value;
            }

            function rerenderAll() {
                updateMetrics();
                Object.keys(LOG_CONFIG).forEach(renderLogSection);
                renderMetrics();
            }

            // --- EVENT HANDLERS ---
            document.body.addEventListener('click', (e) => {
                const target = e.target.closest('button');
                if (!target) return;

                if (target.classList.contains('add-entry-btn')) {
                    const type = target.dataset.type;
                    const config = LOG_CONFIG[type];
                    config.entries.push(config.getEmptyEntry());
                    rerenderAll();
                }

                if (target.classList.contains('remove-entry-btn')) {
                    const { id, type } = target.dataset;
                    const config = LOG_CONFIG[type];
                    config.entries = config.entries.filter(entry => entry.id !== id);
                    rerenderAll();
                }
            });

            document.body.addEventListener('input', (e) => {
                const target = e.target;
                if (target.matches('textarea')) {
                    autoSizeTextarea(target);
                }
            });

            document.body.addEventListener('change', (e) => {
                const target = e.target;
                if (target.matches('[data-type][data-id][data-field]')) {
                    const { id, field, type } = target.dataset;
                    const config = LOG_CONFIG[type];
                    const entry = config.entries.find(e => e.id === id);
                    if (entry) {
                        const value = target.type === 'checkbox' ? target.checked : target.value;
                        entry[field] = value;
                        rerenderAll();
                    }
                } else if (target.classList.contains('metric-input')) {
                    const { index, field } = target.dataset;
                    const value = target.type === 'number' ? parseInt(target.value, 10) || 0 : target.value;
                    state.metrics[index][field] = value;
                    rerenderAll();
                }
            });

            document.getElementById('save-pdf-btn').addEventListener('click', async () => {
                if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
                    console.log('PDF libraries not found. Using browser print fallback.');
                    window.print();
                    return;
                }

                const btn = document.getElementById('save-pdf-btn');
                const btnIcon = document.getElementById('save-pdf-btn-icon');
                const btnText = document.getElementById('save-pdf-btn-text');

                btn.disabled = true;
                btnIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2 loader"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;
                btnText.textContent = 'Saving PDF...';

                const printContainer = document.getElementById('print-container');
                const { jsPDF } = jspdf;

                try {
                    const canvas = await html2canvas(printContainer, {
                        scale: 2,
                        useCORS: true,
                        onclone: (docClone) => {
                            docClone.querySelectorAll('input, textarea, select').forEach(el => {
                                const input = el;
                                const staticEl = docClone.createElement('div');
                                staticEl.style.color = 'black';
                                staticEl.style.fontSize = '9pt';
                                staticEl.style.lineHeight = '1.15';

                                staticEl.style.whiteSpace = 'pre-wrap';
                                staticEl.style.wordBreak = 'break-word';
                                staticEl.style.height = 'auto';
                                staticEl.style.minHeight = '12pt';
                                staticEl.style.width = '100%';
                                staticEl.style.padding = '0';
                                staticEl.style.margin = '0';

                                if (input.type === 'checkbox') {
                                    staticEl.textContent = input.checked ? '✓' : '';
                                    staticEl.style.textAlign = 'center';
                                } else if (input.type === 'date' && input.value) {
                                    const parts = input.value.split('-'); // YYYY-MM-DD
                                    if (parts.length === 3 && parts[0].length === 4) {
                                        staticEl.textContent = `${parts[1]}/${parts[2]}/${parts[0]}`;
                                    } else {
                                        staticEl.textContent = input.value;
                                    }
                                } else if (input.tagName.toLowerCase() === 'select') {
                                     staticEl.textContent = input.options[input.selectedIndex]?.text || input.value;
                                } else {
                                    staticEl.textContent = input.value;
                                }

                                input.parentNode?.replaceChild(staticEl, input);
                            });
                            docClone.querySelectorAll('.no-print').forEach(el => el.style.display = 'none');
                        }
                    });

                    const imgData = canvas.toDataURL('image/jpeg', 0.95);
                    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const canvasWidth = canvas.width;
                    const canvasHeight = canvas.height;
                    const ratio = canvasWidth / pdfWidth;
                    const imgHeight = canvasHeight / ratio;

                    let heightLeft = imgHeight;
                    let position = 0;

                    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                    heightLeft -= pdfHeight;

                    while (heightLeft > 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                        heightLeft -= pdfHeight;
                    }

                    pdf.save('Daily_Sales_Activity_Log.pdf');
                } catch (error) {
                    console.error("Failed to generate PDF:", error);
                    alert("Sorry, there was an error creating the PDF. Please try printing using your browser's print function.");
                } finally {
                    btn.disabled = false;
                    btnIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mr-2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>`;
                    btnText.textContent = 'Print / Save as PDF';
                }
            });

            document.getElementById('print-blank-btn').addEventListener('click', () => {
                state.isPrintingBlank = true;
                const originalState = JSON.parse(JSON.stringify(state));
                const originalHeader = {
                    company: document.getElementById('company-region').value,
                    manager: document.getElementById('sales-manager').value,
                    date: document.getElementById('date').value,
                    department: document.getElementById('department').value,
                    notes: document.getElementById('general-notes').value
                };

                const restoreState = () => {
                    Object.assign(state, originalState);
                    state.isPrintingBlank = false;
                    document.getElementById('company-region').value = originalHeader.company;
                    document.getElementById('sales-manager').value = originalHeader.manager;
                    document.getElementById('date').value = originalHeader.date;
                    document.getElementById('department').value = originalHeader.department;
                    document.getElementById('general-notes').value = originalHeader.notes;
                    rerenderAll();
                    window.removeEventListener('afterprint', restoreState);
                };
                window.addEventListener('afterprint', restoreState, { once: true });

                document.getElementById('company-region').value = '';
                document.getElementById('sales-manager').value = '';
                document.getElementById('date').value = '';
                document.getElementById('department').value = '';
                document.getElementById('general-notes').value = '';

                const createBlankEntry = (type) => {
                    const entry = LOG_CONFIG[type].getEmptyEntry();
                    Object.keys(entry).forEach(key => {
                        if (key !== 'id') {
                            entry[key] = (typeof entry[key] === 'boolean') ? false : '';
                        }
                    });
                    return entry;
                };

                state.callEntries = Array.from({length: 3}, () => createBlankEntry('call'));
                state.emailEntries = Array.from({length: 3}, () => createBlankEntry('email'));
                state.meetingEntries = Array.from({length: 3}, () => createBlankEntry('meeting'));
                state.metrics.forEach(m => { m.number = 0; m.comments = ''; });

                rerenderAll();

                setTimeout(() => window.print(), 100);
            });

            // --- INITIALIZATION ---
            rerenderAll();
    }

    // --- Main Navigation Event Listeners ---
    navHome?.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllContent();
        if (vindexContent) vindexContent.style.display = 'block';
        updateActiveLink(navHome);
        generateTOC('#vindex-content');
    });

    navAfinder?.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllContent();
        if (afinderContent) afinderContent.style.display = 'block';
        updateActiveLink(navAfinder);
        generateTOC('#afinder-content');
        initAfinder();
    });

    navSalesLog?.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllContent();
        if (salesLogContent) salesLogContent.style.display = 'block';
        updateActiveLink(navSalesLog);
        initSalesLog();
        generateTOC('#sales-log-content');
    });

    navBcard?.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllContent();
        if (bcardContent) bcardContent.style.display = 'block';
        updateActiveLink(navBcard);
        generateTOC('#bcard-content');
    });

    // --- Initial Application State ---
    function initializeApp() {
        hideAllContent();
        if (vindexContent) vindexContent.style.display = 'block';
        updateActiveLink(navHome);
        initVindex();
        generateTOC('#vindex-content');
    }

    initializeApp();
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('application-form');
    const prefillBtn = document.getElementById('prefill-btn');
    const clearBtn = document.getElementById('clear-btn');

    const sampleData = {
        'business-name': 'ABC Corporation',
        'business-address': '123 Main St',
        'business-city': 'Anytown',
        'business-state': 'CA',
        'business-zip': '12345',
        'business-tin': '12-3456789',
        'applicant-name': 'John Doe',
        'applicant-title': 'CEO',
        'applicant-dob': '1980-01-01',
        'applicant-ssn': '123-45-678',
        'applicant-address': '456 Oak Ave',
        'applicant-city': 'Someville',
        'applicant-state': 'CA',
        'applicant-zip': '54321',
        'owner1-name': 'Jane Smith',
        'owner1-ownership': '50',
        'controller-name': 'John Doe',
        'controller-title': 'CEO'
    };

    prefillBtn.addEventListener('click', () => {
        for (const key in sampleData) {
            if (Object.hasOwnProperty.call(sampleData, key)) {
                const element = document.getElementById(key);
                if (element) {
                    element.value = sampleData[key];
                }
            }
        }
    });

    clearBtn.addEventListener('click', () => {
        form.reset();
        updateCardPreview();
    });

    // Live Preview
    const businessNameInput = document.getElementById('business-name');
    const applicantNameInput = document.getElementById('applicant-name');
    const applicantTitleInput = document.getElementById('applicant-title');

    const cardBusinessName = document.querySelector('.card-business-name');
    const cardApplicantName = document.querySelector('.card-applicant-name');
    const cardApplicantTitle = document.querySelector('.card-applicant-title');

    function updateCardPreview() {
        cardBusinessName.textContent = businessNameInput.value || 'Your Business Name';
        cardApplicantName.textContent = applicantNameInput.value || 'Your Name';
        cardApplicantTitle.textContent = applicantTitleInput.value || 'Your Title';
    }

    businessNameInput.addEventListener('input', updateCardPreview);
    applicantNameInput.addEventListener('input', updateCardPreview);
    applicantTitleInput.addEventListener('input', updateCardPreview);

    // Initial update
    updateCardPreview();
});
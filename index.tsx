// Add type definition for window.jspdf to avoid TypeScript error.
declare global {
    interface Window {
        jspdf: any;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Dark mode toggle logic
    const themeToggle = document.getElementById('checkbox') as HTMLInputElement;
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        }

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // On-scroll animation logic
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // PDF generation logic
    const downloadCvButton = document.getElementById('download-cv');
    if (downloadCvButton) {
        downloadCvButton.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const margin = 15;
            const pageWidth = doc.internal.pageSize.getWidth();
            let yPos = 20;
            const lineSpacing = 7;
            const sectionSpacing = 10;

            // Helper to add text and wrap if necessary
            const addText = (text: string, options?: object) => {
                const splitText = doc.splitTextToSize(text, pageWidth - margin * 2);
                doc.text(splitText, margin, yPos, options);
                yPos += (splitText.length * lineSpacing) - (lineSpacing - 5); // Adjust spacing
            };
            
            // --- Header ---
            doc.setFontSize(22).setFont(undefined, 'bold');
            doc.text('Harshal Joshi', pageWidth / 2, yPos, { align: 'center' });
            yPos += lineSpacing;

            doc.setFontSize(10).setFont(undefined, 'normal');
            const contactInfo = [
                'Udaipur, Rajasthan, India',
                '+91-8114439253',
                'harshaljoshii@outlook.com',
                'linkedin.com/in/harshaljoshi-data-ninja'
            ].join(' | ');
            doc.text(contactInfo, pageWidth / 2, yPos, { align: 'center' });
            yPos += sectionSpacing;

            // --- Profile Summary ---
            doc.setFontSize(14).setFont(undefined, 'bold');
            doc.text('Profile Summary', margin, yPos);
            yPos += lineSpacing;
            doc.setFontSize(11).setFont(undefined, 'normal');
            const summaryEl = document.querySelector<HTMLElement>('#summary p');
            if (summaryEl) {
                const summaryText = summaryEl.innerText;
                addText(summaryText);
            }
            yPos += sectionSpacing;

            // --- Skills ---
            doc.setFontSize(14).setFont(undefined, 'bold');
            doc.text('Skills', margin, yPos);
            yPos += lineSpacing;
            doc.setFontSize(11);
            document.querySelectorAll<HTMLElement>('#skills .skill-category').forEach(cat => {
                doc.setFont(undefined, 'bold');
                const titleEl = cat.querySelector<HTMLElement>('h3');
                if (titleEl) {
                    const title = titleEl.innerText;
                    const skills = Array.from(cat.querySelectorAll<HTMLElement>('li')).map(li => li.innerText).join(', ');
                    addText(`${title}: ${skills}`);
                }
                doc.setFont(undefined, 'normal');
                yPos += 2;
            });
            yPos += sectionSpacing - 2;
            
            // --- Project Highlights ---
            doc.setFontSize(14).setFont(undefined, 'bold');
            doc.text('Project Highlights', margin, yPos);
            yPos += lineSpacing;
            document.querySelectorAll<HTMLElement>('#projects .card').forEach(project => {
                doc.setFontSize(12).setFont(undefined, 'bold');
                const titleEl = project.querySelector<HTMLElement>('h3');
                if (titleEl) {
                    addText(titleEl.innerText);
                }
                doc.setFontSize(11).setFont(undefined, 'normal');
                project.querySelectorAll<HTMLElement>('li').forEach(li => {
                    addText(`- ${li.innerText}`);
                });
                yPos += 4;
            });
            yPos += sectionSpacing - 4;

            // --- Certifications ---
            doc.setFontSize(14).setFont(undefined, 'bold');
            doc.text('Certifications', margin, yPos);
            yPos += lineSpacing;
            doc.setFontSize(11).setFont(undefined, 'normal');
            document.querySelectorAll<HTMLElement>('#certifications .list-container p').forEach(cert => {
                 addText(`- ${cert.innerText}`);
            });
            yPos += sectionSpacing;
            
            // --- Work Experience ---
            doc.setFontSize(14).setFont(undefined, 'bold');
            doc.text('Work Experience', margin, yPos);
            yPos += lineSpacing;
            document.querySelectorAll<HTMLElement>('#experience .card').forEach(exp => {
                doc.setFontSize(12).setFont(undefined, 'bold');
                const titleEl = exp.querySelector<HTMLElement>('h3');
                if (titleEl) {
                    addText(titleEl.innerText);
                }
                doc.setFontSize(11).setFont(undefined, 'italic');
                const companyEl = exp.querySelector<HTMLElement>('.company');
                if (companyEl) {
                    addText(companyEl.innerText);
                }
                doc.setFont(undefined, 'normal');
                const pEl = exp.querySelectorAll<HTMLElement>('p')[1];
                if (pEl) {
                    addText(pEl.innerText);
                }
                yPos += 4;
            });
            yPos += sectionSpacing -4;

            // --- Education ---
            doc.setFontSize(14).setFont(undefined, 'bold');
            doc.text('Education', margin, yPos);
            yPos += lineSpacing;
             document.querySelectorAll<HTMLElement>('#education .card').forEach(edu => {
                doc.setFontSize(12).setFont(undefined, 'bold');
                const titleEl = edu.querySelector<HTMLElement>('h3');
                if (titleEl) {
                    addText(titleEl.innerText);
                }
                doc.setFontSize(11).setFont(undefined, 'italic');
                const companyEl = edu.querySelector<HTMLElement>('.company');
                if (companyEl) {
                    addText(companyEl.innerText);
                }
                yPos += 4;
            });

            doc.save('Harshal_Joshi_Resume.pdf');
        });
    }

    // Project card expand/collapse logic
    const projectLearnMoreButtons = document.querySelectorAll('.btn-learn-more');
    projectLearnMoreButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const currentButton = event.currentTarget as HTMLButtonElement;
            const card = currentButton.closest('.card');
            if (card) {
                const details = card.querySelector('.project-details') as HTMLElement;
                if (details) {
                    const isExpanded = details.classList.contains('expanded');
                    
                    details.classList.toggle('expanded');
                    currentButton.setAttribute('aria-expanded', String(!isExpanded));

                    if (!isExpanded) {
                        currentButton.textContent = 'Show Less';
                    } else {
                        currentButton.textContent = 'Learn More';
                    }
                }
            }
        });
    });

    // Contact Form Modal Logic
    const modal = document.getElementById('contact-modal') as HTMLElement;
    const openModalBtn = document.getElementById('open-contact-form') as HTMLButtonElement;
    const closeModalBtn = document.querySelector('.close-button') as HTMLElement;
    const contactForm = document.getElementById('contact-form') as HTMLFormElement;

    if (modal && openModalBtn && closeModalBtn && contactForm) {
        const showModal = () => {
            if (modal) modal.style.display = 'block';
        };

        const hideModal = () => {
            if (modal) modal.style.display = 'none';
        };

        openModalBtn.addEventListener('click', showModal);
        closeModalBtn.addEventListener('click', hideModal);

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideModal();
            }
        });

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = (document.getElementById('name') as HTMLInputElement).value;
            const email = (document.getElementById('email') as HTMLInputElement).value;
            const company = (document.getElementById('company') as HTMLInputElement).value;
            const message = (document.getElementById('message') as HTMLTextAreaElement).value;

            const subject = encodeURIComponent(`Contact from ${name} via Portfolio`);
            const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}

Message:
${message}`
            );

            window.location.href = `mailto:harshaljoshii@outlook.com?subject=${subject}&body=${body}`;

            hideModal();
            contactForm.reset();
        });
    }
});

// Add export {} to treat this file as a module. This allows global augmentation.
export {};
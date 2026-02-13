// Format date to 'Month YYYY' (e.g., 'September 2015')
function formatDate(dateString) {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Format phone number for tel: link
function formatPhone(phone) {
    return phone.replace(/[^\d]/g, '');
}

// Map social network to Font Awesome icon class
function getFaIcon(network) {
    switch ((network || '').toLowerCase()) {
        case 'github': return 'github';
        case 'linkedin': return 'linkedin';
        case 'twitter': return 'twitter';
        case 'facebook': return 'facebook';
        default: return (network || '').toLowerCase();
    }
}

// Initialize the resume
$(document).ready(function() {
    // Load resume data
    $.ajax({
        url: 'resume.json',
        dataType: 'json',
        cache: false,
        success: function(data) {
            // Dates are displayed as plain text from JSON

            // Add phoneHref for tel: link, but keep original phone for display
            if (data.basics.phone) {
                data.basics.phoneHref = formatPhone(data.basics.phone);
            }

            // Add keywordsString to each skill and add 'comma' property for template
            if (data.skills) {
                data.skills.forEach(function(skill) {
                    skill.keywordsString = (skill.keywords || []).join(', ');
                    if (skill.keywords && skill.keywords.length > 0) {
                        skill.keywords = skill.keywords.map(function(kw, i, arr) {
                            return {
                                name: kw,
                                comma: i < arr.length - 1
                            };
                        });
                    }
                });
            }

            // Add faIcon to each profile
            if (data.basics.profiles) {
                data.basics.profiles.forEach(function(profile) {
                    profile.faIcon = getFaIcon(profile.network);
                });
            }

            // Load all partials and main layout, then render
            $.when(
                $.ajax({ url: 'templates/layout.html', cache: false }),
                $.ajax({ url: 'templates/header.html', cache: false }),
                $.ajax({ url: 'templates/summary.html', cache: false }),
                $.ajax({ url: 'templates/skills.html', cache: false }),
                $.ajax({ url: 'templates/projects.html', cache: false }),
                $.ajax({ url: 'templates/achievements.html', cache: false }),
                $.ajax({ url: 'templates/jobs.html', cache: false }),
                $.ajax({ url: 'templates/education.html', cache: false }),
                $.ajax({ url: 'templates/references.html', cache: false })
            ).done(function(layout, header, summary, skills, projects, achievements, jobs, education, references) {
                var partials = {
                    header: header[0],
                    summary: summary[0],
                    skills: skills[0],
                    projects: projects[0],
                    achievements: achievements[0],
                    jobs: jobs[0],
                    education: education[0],
                    references: references[0]
                };
                var rendered = Mustache.render(layout[0], data, partials);
                $('#content').html(rendered);

                // Set up PDF generation after content is rendered
                document.getElementById('pdf').addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const element = document.querySelector('.container');
                    if (!element) {
                        console.error('Container element not found');
                        return;
                    }

                    // Create clones for each page
                    const mainContent = element.cloneNode(true);
                    const referencesContent = element.cloneNode(true);

                    // Remove references from main content
                    const mainRefs = mainContent.querySelector('#references');
                    if (mainRefs) mainRefs.remove();

                    // Prepare references content only if references exist
                    const refs = referencesContent.querySelector('#references');
                    let hasReferences = false;
                    if (refs) {
                        hasReferences = true;
                        referencesContent.innerHTML = '';
                        referencesContent.appendChild(refs);
                    }

                    // Remove social links from both pages
                    [mainContent, referencesContent].forEach(container => {
                        const socialDiv = container.querySelector('.header-social');
                        if (socialDiv) {
                            socialDiv.remove();
                        }
                    });

                    // Create containers for each page
                    const createPageContainer = () => {
                        const container = document.createElement('div');
                        container.style.width = '8.5in';
                        container.style.height = '11in';
                        container.style.padding = '0.6in';
                        container.style.background = 'white';
                        container.style.position = 'absolute';
                        container.style.left = '-9999px';
                        container.style.top = '-9999px';
                        return container;
                    };

                    const page1Container = createPageContainer();
                    page1Container.appendChild(mainContent);
                    document.body.appendChild(page1Container);

                    let page2Container = null;
                    if (hasReferences) {
                        page2Container = createPageContainer();
                        page2Container.appendChild(referencesContent);
                        document.body.appendChild(page2Container);
                    }

                    // Add PDF-specific styles
                    const style = document.createElement('style');
                    style.textContent = `
                        @page {
                            size: letter;
                            margin: 0.6in;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            font-size: 10.5pt;
                            line-height: 1.22;
                        }
                        .container {
                            width: auto;
                            max-width: none;
                            margin: 0;
                            padding: 0;
                        }
                        section {
                            margin-bottom: 0.1in;
                        }
                        h1 { 
                            font-size: 28pt;
                            margin-bottom: 0.08in;
                        }
                        h2 { 
                            font-size: 15pt;
                            margin-bottom: 0.06in;
                        }
                        h3 { 
                            font-size: 14pt;
                            margin-bottom: 0.06in;
                        }
                        .job-title, .education-title { 
                            font-size: 12pt;
                            margin-bottom: 0.03in;
                        }
                        .job-company, .education-institution { 
                            font-size: 11pt;
                            margin-bottom: 0.03in;
                        }
                        .job-dates, .education-dates { 
                            font-size: 10pt;
                            margin-bottom: 0.05in;
                        }
                        .skills-group-title { 
                            font-size: 11pt;
                            margin-bottom: 0.05in;
                        }
                        .skill-tags { 
                            font-size: 10.5pt;
                            margin-bottom: 0.03in;
                        }
                        .job-highlights li { 
                            font-size: 10.5pt;
                            margin-bottom: 0.02in;
                        }
                        .references-grid {
                            display: block !important;
                        }
                        .reference-card {
                            font-size: 9pt;
                            margin-bottom: 0.02in !important;
                            padding: 0 !important;
                        }
                        .reference-card:last-child {
                            margin-bottom: 0 !important;
                        }
                        .reference-name {
                            font-size: 10pt;
                            margin: 0 0 0.01in 0 !important;
                        }
                        .reference-title {
                            font-size: 9pt;
                            margin: 0 0 0.01in 0 !important;
                        }
                        .reference-content {
                            font-size: 9pt;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        .job-highlights, .education-details {
                            margin-bottom: 0.03in;
                        }
                        .skills-group {
                            margin-bottom: 0.04in;
                        }
                        .contact-info {
                            margin-bottom: 0.06in;
                        }
                        .job, .education {
                            margin-bottom: 0.06in;
                        }
                        .job:last-child, .education:last-child {
                            margin-bottom: 0;
                        }
                    `;
                    page1Container.appendChild(style.cloneNode(true));
                    if (page2Container) {
                        page2Container.appendChild(style.cloneNode(true));
                    }

                    // Generate PDF
                    const pdf = new jspdf.jsPDF({
                        orientation: 'portrait',
                        unit: 'in',
                        format: 'letter'
                    });

                    const renderContent = (contentEl) => {
                        return new Promise(resolve => {
                            requestAnimationFrame(() => {
                                html2canvas(contentEl, {
                                    scale: 2,
                                    useCORS: true,
                                    logging: false,
                                    backgroundColor: '#ffffff'
                                }).then(resolve);
                            });
                        });
                    };

                    // Render first page
                    renderContent(mainContent).then(canvas1 => {
                        const imgData1 = canvas1.toDataURL('image/png');
                        const pageW = 8.5;
                        const pageH = 11;
                        const marginX = 0.2;
                        const marginY = 0.6;
                        const maxW = pageW - (marginX * 2);
                        const maxH = pageH - (marginY * 2);
                        const imgRatio1 = canvas1.height / canvas1.width;
                        let renderW1 = maxW;
                        let renderH1 = maxW * imgRatio1;
                        if (renderH1 > maxH) {
                            renderH1 = maxH;
                            renderW1 = maxH / imgRatio1;
                        }
                        const x1 = marginX + (maxW - renderW1) / 2;
                        const y1 = marginY + (maxH - renderH1) / 2;
                        pdf.addImage(imgData1, 'PNG', x1, y1, renderW1, renderH1);

                        if (!page2Container) {
                            pdf.save('Resume - Travis West.pdf');
                            document.body.removeChild(page1Container);
                            return;
                        }

                        // Render second page
                        renderContent(referencesContent).then(canvas2 => {
                            const imgData2 = canvas2.toDataURL('image/png');
                            const imgRatio2 = canvas2.height / canvas2.width;
                            let renderW2 = maxW;
                            let renderH2 = maxW * imgRatio2;
                            if (renderH2 > maxH) {
                                renderH2 = maxH;
                                renderW2 = maxH / imgRatio2;
                            }
                            const x2 = marginX + (maxW - renderW2) / 2;
                            const y2 = marginY + (maxH - renderH2) / 2;
                            pdf.addPage();
                            pdf.addImage(imgData2, 'PNG', x2, y2, renderW2, renderH2);

                            // Save the PDF
                            pdf.save('Resume - Travis West.pdf');

                            // Clean up
                            document.body.removeChild(page1Container);
                            document.body.removeChild(page2Container);
                        });
                    });
                });
            });
        }
    });
}); 

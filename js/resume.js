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
            // Format dates in work experience
            data.work.forEach(function(job) {
                job.startDate = formatDate(job.startDate);
                job.endDate = formatDate(job.endDate);
            });

            // Format dates in education
            if (data.education) {
                data.education.forEach(function(edu) {
                    edu.startDate = formatDate(edu.startDate);
                    edu.endDate = formatDate(edu.endDate);
                });
            }

            // Format dates in projects
            if (data.projects) {
                data.projects.forEach(function(project) {
                    project.startDate = formatDate(project.startDate);
                    project.endDate = formatDate(project.endDate);
                });
            }

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
                $.ajax({ url: 'templates/activities.html', cache: false }),
                $.ajax({ url: 'templates/jobs.html', cache: false }),
                $.ajax({ url: 'templates/education.html', cache: false }),
                $.ajax({ url: 'templates/references.html', cache: false })
            ).done(function(layout, header, summary, skills, projects, activities, jobs, education, references) {
                var partials = {
                    header: header[0],
                    summary: summary[0],
                    skills: skills[0],
                    projects: projects[0],
                    activities: activities[0],
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
                        container.style.padding = '0.75in';
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
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            font-size: 10.5pt;
                            line-height: 1.32;
                        }
                        @page {
                            size: letter;
                            margin: 0.6in;
                        }
                        .container {
                            width: 7in;
                            margin: 0 auto;
                            padding: 0;
                        }
                        section {
                            margin-bottom: 0.16in;
                        }
                        h1 { 
                            font-size: 28pt;
                            margin-bottom: 0.12in;
                        }
                        h2 { 
                            font-size: 15pt;
                            margin-bottom: 0.1in;
                        }
                        h3 { 
                            font-size: 14pt;
                            margin-bottom: 0.1in;
                        }
                        .job-title, .education-title { 
                            font-size: 12pt;
                            margin-bottom: 0.05in;
                        }
                        .job-company, .education-institution { 
                            font-size: 11pt;
                            margin-bottom: 0.05in;
                        }
                        .job-dates, .education-dates { 
                            font-size: 10pt;
                            margin-bottom: 0.1in;
                        }
                        .skills-group-title { 
                            font-size: 11pt;
                            margin-bottom: 0.1in;
                        }
                        .skill-tags { 
                            font-size: 10.5pt;
                            margin-bottom: 0.05in;
                        }
                        .job-highlights li { 
                            font-size: 10.5pt;
                            margin-bottom: 0.05in;
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
                            margin-bottom: 0.05in;
                        }
                        .skills-group {
                            margin-bottom: 0.06in;
                        }
                        .contact-info {
                            margin-bottom: 0.1in;
                        }
                        .job, .education {
                            margin-bottom: 0.1in;
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

                    // Render first page
                    html2canvas(page1Container, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff'
                    }).then(canvas1 => {
                        const imgData1 = canvas1.toDataURL('image/png');
                        pdf.addImage(imgData1, 'PNG', 0, 0, 8.5, 11);

                        if (!page2Container) {
                            pdf.save('Resume - Travis West.pdf');
                            document.body.removeChild(page1Container);
                            return;
                        }

                        // Render second page
                        html2canvas(page2Container, {
                            scale: 2,
                            useCORS: true,
                            logging: false,
                            backgroundColor: '#ffffff'
                        }).then(canvas2 => {
                            const imgData2 = canvas2.toDataURL('image/png');
                            pdf.addPage();
                            pdf.addImage(imgData2, 'PNG', 0, 0, 8.5, 11);

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

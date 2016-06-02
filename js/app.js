define([
    'jquery',
    'underscore',
    'text!../templates/header.html',
    'text!../templates/summary.html',
    'text!../templates/skills.html',
    'text!../templates/jobs.html',
    'text!../templates/references.html'
], function($, _, HeaderTemplate, SummaryTemplate, SkillTemplate, JobTemplate, ReferenceTemplate) {
    var headerTemplate = _.template(HeaderTemplate),
        summaryTemplate = _.template(SummaryTemplate),
        skillTemplate = _.template(SkillTemplate),
        jobTemplate = _.template(JobTemplate),
        referenceTemplate = _.template(ReferenceTemplate);

    _.template.formatDate = function(date) {
        if (!date) return 'Present';

        var d = new Date(date),
            fragments = [
                d.toLocaleString('en-us', { month: "short" }),
                d.getFullYear()
            ];

        return fragments.join(' ');
    };

    _.template.flattenPhone = function(phone) {
        return phone.replace(/\D/g, '');
    };

    var initialize = function() {
        $.getJSON('resume.json', function(json) {
            $('#header').html(headerTemplate({
                basics: json.basics
            }));

            $('#summary-container').html(summaryTemplate({
                summary: json.basics.summary
            }));

            $('#skill-container').html(skillTemplate({
                skills: json.skills
            }));

            $('#job-container').html(jobTemplate({
                jobs: json.work
            }));

            $('#reference-container').html(referenceTemplate({
                references: json.references
            }));
        });
    };

    return { initialize: initialize };
});

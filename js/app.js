define([
    'jquery',
    'underscore',
    'text!/templates/header.html',
    'text!/templates/jobs.html',
    'text!/templates/references.html'
], function($, _, HeaderTemplate, JobTemplate, ReferenceTemplate) {
    var headerTemplate = _.template(HeaderTemplate);
    var jobTemplate = _.template(JobTemplate);
    var referenceTemplate = _.template(ReferenceTemplate);

    _.template.formatDate = function(date) {
        if (!date) return 'Present';

        var d = new Date(date),
            fragments = [
                d.toLocaleString('en-us', { month: "short" }),
                d.getFullYear()
            ];

        return fragments.join(' ');
    };

    var initialize = function() {
        $.getJSON('resume.json', function(json) {
            $('header').html(headerTemplate({
                basics: json.basics
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

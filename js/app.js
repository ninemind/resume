define([
    'jquery',
    'underscore',
    'text!/templates/jobs.html'
], function($, _, JobTemplate) {
    var template = _.template(JobTemplate);

    var initialize = function() {
        $.getJSON('resume.json', function(json) {
            $('#job-container').html(template({
                jobs: json.work
            }));
        });
    };

    return { initialize: initialize };
});

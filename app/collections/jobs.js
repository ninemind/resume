define([
    'jquery',
    'underscore',
    'backbone',
    'models/job'
], function($, _, Backbone, JobModel) {
    return Backbone.Collection.extend({
        model: JobModel,
        parse: function(res) {
            res.work.forEach(function(job) {
                if (job.startDate) {
                    job.startDate = new Date(job.startDate);
                }

                if (job.endDate) {
                    job.endDate = new Date(job.endDate);
                }
            });

            return res.work;
        }
    });
});

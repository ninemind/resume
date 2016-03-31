define([
    'jquery',
    'underscore',
    'backbone',
    'collections/jobs',
    'views/jobs'
], function($, _, JobsCollection, JobView) {
    return Backbone.Router.extend({
        routes: {
            '': 'main'
        },

        main: function() {
            console.log('main');

            // var jobs = new JobsCollection;
            // jobs.fetch({
            //     url: '/resume.json',
            //     complete: function() {
            //         console.log(jobs);
            //
            //         var jobView = new JobView({collection: jobs});
            //         jobView.render();
            //     }
            // });
        }
    });
});

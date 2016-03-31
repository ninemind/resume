define([
    'jquery',
    'underscore',
    'backbone',
    'collections/jobs',
    'text!templates/jobs.html'
], function($, _, Backbone, JobsCollection, JobsTemplate){
    return Backbone.View.extend({
        el: '#job-container',
        initialize: function() {
            this.render();
        },
        render: function() {
            var data = {
                jobs: this.collection.models,
                _: _
            };

            var compiledTemplate = _.template(JobsTemplate, data);
            this.$el.html(compiledTemplate);

            return this;
        }
    });
});

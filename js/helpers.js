define([
    'jquery',
    'underscore'
], function($, _) {
    _.template.formatDate = function(date) {
        if (!date) return 'Present';

        var d = new Date(date),
            fragments = [
                d.toLocaleString('en-us', { month: "short" }),
                d.getFullYear()
            ];

        return fragments.join(' ');
    };

    return { initialize: initialize };
});

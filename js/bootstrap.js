require.config({
    paths: {
        text:       '../node_modules/text/text',
        jquery:     '../node_modules/jquery/dist/jquery.min',
        underscore: '../node_modules/underscore/underscore-min'
    }
});

require(['app'], function(App) {
    App.initialize();
});

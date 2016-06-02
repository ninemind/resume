require.config({
    paths: {
        text:       '../bower_components/text/text',
        jquery:     '../bower_components/jquery/dist/jquery.min',
        underscore: '../bower_components/underscore/underscore-min'
    }
});

require(['app'], function(App) {
    App.initialize();
});

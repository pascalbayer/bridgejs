require.config({
    baseUrl: 'lib/',
    paths: {
        'Bridge': 'bridge.core.js',
        'Bridge.Accounts': 'bridge.core.js'
    }
});

require(['Bridge.Accounts'], function () {

});
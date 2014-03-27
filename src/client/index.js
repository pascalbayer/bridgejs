require.config({
    baseUrl: 'lib/',
    paths: {
        'Bridge': 'bridge.core',
        'Bridge.Accounts': 'bridge.core'
    }
});

require(['Bridge.Accounts'], function (Bridge) {

});
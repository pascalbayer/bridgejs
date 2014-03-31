define(['Bridge'], function (Bridge) {
    describe('Testing Core#Module', function() {
        it('Check module definition', function() {
            var test = bridgejs.module('Test');
            expect(test.name).toEqual('Test');
        });
    });
});
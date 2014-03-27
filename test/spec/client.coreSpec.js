define(['Bridge'], function (Bridge) {
    describe('Testing Core', function() {
        it('Module check', function() {
            console.log(Bridge);
            expect(Bridge.module(5)).toEqual(5);
        });
    });
});
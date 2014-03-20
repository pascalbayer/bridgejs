define(['Bridge'], function (Bridge) {
    describe('Testing Accounts', function() {
        it('Accounts config check', function() {
            // just checking that _ works
            expect(Bridge.Accounts.x).toEqual(5);
        });
    });
});
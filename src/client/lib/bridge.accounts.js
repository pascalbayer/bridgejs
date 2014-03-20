/*
 * bridgejs
 * http://bridgejs.com/
 *
 * Copyright (c) 2014 Pascal Bayer
 * Licensed under the MIT license.
 * https://github.com/pascalbayer/bridgejs/blob/master/LICENSE
 */

'use strict';

define('Bridge', function (Bridge) {
    Bridge.Accounts = (function () {
        var Accounts = {};

        Accounts.x = 5

        return Accounts;
    }());

    return Bridge;
});
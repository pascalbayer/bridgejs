/*
 * bridgejs
 * http://bridgejs.com/
 *
 * Copyright (c) 2014 Pascal Bayer
 * Licensed under the MIT license.
 * https://github.com/pascalbayer/bridgejs/blob/master/LICENSE
 */

/**
 * Accounts provide the build in account system to easily create new users, managing users and complete common
 * required actions on user profiles
 *
 * @class Bridge.Accounts
 */
Bridge.Accounts = (function () {
    var Accounts = {};
    var createUserCallback = function () {
    };
    var validateNewUserCallback = function () {
        return true;
    };

    /**
     * <div class="usage-box"><b>USAGE: </b>Client</div>
     * Login a user by providing username and password, if the login fails a single `Error` object is passed to
     * the callback function as parameter
     *
     * @method loginWithPassword
     * @param user {String}
     * @param password {String}
     * @param [callback] {Function}
     * @example
     * Login a user
     *
     *      Bridge.Accounts.loginWithPassword('username', 'password', function (Error) {
             *          if (Error) {
             *              console.log(Error.message);
             *          }
             *      });
     */
    Accounts.loginWithPassword = function (user, password, callback) {
        Bridge.Socket.emit('loginWithPassword', {
            user: user,
            password: password
        });
    };

    /**
     * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
     * Create a new user in the database
     *
     * @method createUser
     * @param user {Object}
     * @param callback {Function} <span class="important-info">Only available on server</span>
     * @example
     * Create a new user
     *
     *      Bridge.Accounts.createUser({
         *          username: 'username',
         *          email: 'email@email.com',
     *          password: 'password',
     *          profile: {
         *              name: 'name',
         *              prename: 'prename'
         *              // Add your own properties you want to store in a users profile
         *          }
     *      });
     */
    Accounts.createUser = function (user, callback) {
        //TODO: do something with callback
        Bridge.Socket.emit('createUser', user);
    };

    return Accounts;
}());


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
    * <div class="usage-box"><b>USAGE: </b>Server</div>
    * Validates the creation of a new user account, returns true by default. Specify a callback to perform a
    * specific validation returning true or false.
    *
    * @method validateNewUser
    * @param callback {Function}
    * @example
    * Register a callback to customize the validation of a new user account creation
    *
    *      Bridge.Accounts.validateNewUser(function (user) {
    *          if (usernameIsAvailable(user.username)) {
    *              return true;
    *          }
    *          else {
    *              return false;
    *          }
    *      });
    */
    Accounts.validateNewUser = function (callback) {
        if (typeof callback == 'function') {
            validateNewUserCallback = callback;
        }
    };

    /**
    * <div class="usage-box"><b>USAGE: </b>Server</div>
    * Customize the creation of a new user
    *
    * @method onCreateUser
    * @param callback {Function}
    * @example
    * Register a callback to customize the creation of a new user
    *
    *      Bridge.Accounts.onCreateUser(function (user) {
    *          options.profile.level = 0;      // Customize the profile of a user, by adding new properties
    *          options.picture = 'image.png'   // Add new properties to the user object
    *      });
    */
    Accounts.onCreateUser = function (callback) {
        if (typeof callback == 'function') {
            createUserCallback = callback;
        }
    };

    /**
     * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
     * Create a new user in the database
     *
     * @method createUser
     * @param user {Object}
     * @param callback {Function} <span class="important-info">Only available on server</span>
     * @return {Boolean} true if the user could be created
     * @throws Bridge.Error if the creation fails, because of insufficient permissions
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
        if (validateNewUserCallback(user)) {
            createUserCallback(user);
            db.collection('Users').insert(user);
            return true;
        }
        else {
            throw Bridge.Error('The creation of the user was not granted');
        }
    };

    return Accounts;
}());

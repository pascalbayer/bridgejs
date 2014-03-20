/*
 * bridgejs
 * http://bridgejs.com/
 *
 * Copyright (c) 2014 Pascal Bayer, Sebastian Wahn
 * Licensed under the MIT license.
 * https://github.com/pascalbayer/bridgejs/blob/master/LICENSE
 */

/**
 * Connect provides an abstraction for basic connecting and communication features.
 *
 * @class Bridge.Connect
 */
Bridge.Connect = (function(){
    var Connect = {};
    var connectors = ['socket.io', ''];

    Connect.connect = function(){};
    Connect.send = function(){};
    Connect.broadcast = function(){};

    return Connect;
}());
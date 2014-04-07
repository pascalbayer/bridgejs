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
Bridge.Connect = (function(port, undefined){
    var Connect = {};
    //TODO: needed when default ?
    var connectors = ['socket.io', ''];
    var socket = require('socket.io').listen(port);
    var clients = [];

    Connect.connect = function(){
        socket.sockets.on('connection', function (socket) {

            //TODO: change to key value array/object with user data
            clients['id'] = socket;

            socket.on('disconnect', function () {
                //TODO: delete client from clients
            });
        });
    };

    Connect.send = function(clientId, message, protocol){
        //TODO: lookup client and send the message to him
        
    };

    Connect.broadcast = function(){};

    return Connect;
}());
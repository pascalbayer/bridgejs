/*
 * bridgejs
 * http://bridgejs.com/
 *
 * Copyright (c) 2014
 * Authors Pascal Bayer, Sebastian Wahn
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
        if(protocol != undefined && message != undefined){
            var client = clients[clientId];
            if(client != undefined && client != null){
                client.emit(protocol, message);
            } else if (message != undfined) {
                client.send()
            }
        }
    };

    Connect.broadcast = function(message, protocol){
        if(protocol != undefined && message != undefined){
            clients.forEach(function(key, value){
                value.emit(protocol, message);
            });
        }
    };

    return Connect;
}());
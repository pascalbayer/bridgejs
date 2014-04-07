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
Bridge.Connect = (function(undefined){
    var Connect = {};

    //TODO: needed when default ?
    var connectors = ['socket.io', ''];

    var serverURL = '';
    var socket = undefined;

    /***
     *
     */
    Connect.connect = function(){
        var socket = io.connect(serverURL);

        socket.on('ping', function (data) {
            console.log(data);
        });
        Connect.send('Hello, this is bridge');
    };

    Connect.send = function(msg, protocol, callback){
        if(socket == undefined){
            throw new Bridge.Error('Socket is not initialized')
        }

        if(msg == undefined) {
            throw new Bridge.Error('No message was provided');
        }

        if(callback != undefined && protocol != undefined){
            socket.emit(protocol, msg, callback);
        }
        else if (callback != undefined) {
            socket.emit(protocol, msg);
        } else {
            socket.send(msg);
        }
    };

    Connect.broadcast = function(protocol, msg, callback){
        // TODO: add broadcast flag to the protocol, therefore the server can handle it different?
        // else there is nothing special here
        Connect.send(protocol, msg, callback);
    };

    return Connect;
}());

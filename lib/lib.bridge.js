var Bridge = typeof global != 'undefined' ? module.exports : {};
var underscore = typeof global != 'undefined' ? require('underscore') : window._;
var database = typeof global != 'undefined' ? require('mongojs') : {};
var socketio = typeof global != 'undefined' ? require('socket.io') : window.io;
var fs = typeof global != 'undefined' ? require('fs') : {};

/**
 * Bridge provides all framework components on a client as well as a server
 *
 * @class Bridge
 * @type {Bridge}
 */
(function (Bridge, underscore, database, socketio, fs) {
    var db = database;
    var socket = socketio;
    var onEvents = new Array;
    var emitEvents = new Array;
    var publishedCollections = {};
    var pendingSubscriptions = {
        counter: 0,
        callbacks: new Array()
    };
    var _ = underscore;

    /**
     * Stores the global configuration settings
     *
     * @property Settings
     * @type {Object}
     * @example
     * Available setting:
     *
     *      Bridge.Settings = {
     *          server: '127.0.0.1:80',     // server to connect to
     *          database: 'test',           // database to connect to
     *          language: 'de-de'           // set a language for localized messages
     *      }
     */
    Bridge.Settings = {
        server:null,
        database:null,
        language:'en-en'
    }
    /**
     * Indicates whether the script is running on a server (`true`) or a client (`false`)
     *
     * @property isServer
     * @type Boolean
     * @example
     * For running code only on server:
     *
     *      if (Bridge.isServer) {
     *          // code is only executed on the server
     *      }
     */
    Bridge.isServer = (function () {
        return (typeof global != 'undefined');
    }());
    /**
     * Indicates whether the script is running on a client (`true`) or a server (`false`)
     *
     * @property isClient
     * @type Boolean
     * @example
     * For running code only on client:
     *
     *      if (Bridge.isClient) {
     *          // code is only executed on the client
     *      }
     */
    Bridge.isClient = !Bridge.isServer;
    /**
     * <b>USAGE: Anywhere</b>
     *
     * @method ready
     * @param callback {Function}
     * @example
     * Register a ready callback
     *
     *      Bridge.ready(function () {
     *          // Code to execute when client/server is ready
     *      });
     */
    Bridge.ready = function (callback) {
        if (Bridge.isServer) {
            //TODO: implement server ready event
        }
        else {
            if (typeof callback == 'function') {
                document.addEventListener('DOMContentLoaded', callback, false);
            }
        }
    };
    /**
     * Connect to a bridge instance
     *
     * @method connect
     * @example
     * Connect to an instance
     *
     *      Bridge.connect();
     */
    Bridge.connect = function () {
        //TODO: return true after successful connection
        if (Bridge.isServer) {
            db = db(Bridge.Settings.database);
            socket = socket.listen(Bridge.Settings.server).sockets
            socket.on('connection', function (iosocket) {
                for (event in onEvents) {
                    iosocket.on(onEvents[event].name, onEvents[event].callback);
                }
                for (event in emitEvents) {
                    iosocket.emit(emitEvents[event].name, emitEvents[event].data);
                }
            });

            var path = '/bridgejs';
            var listeners = Bridge.Settings.server.listeners('request').slice(0);
            Bridge.Settings.server.removeAllListeners('request');

            Bridge.Settings.server.on('request', function(request, response){
                if (path == request.url.substr(0, path.length)) {
                    if (request.url == '/bridgejs/bridge.js') {
                        fs.readFile(__dirname + '/lib.bridge.js', function(error, content) {
                            if (!error) {
                                response.writeHead(200, {
                                    'Content-Type': 'application/javascript'
                                });
                                response.end(content, 'utf-8');
                            }
                        });
                    }
                    else {
                        response.end('Welcome to bridge.js.');
                    }
                } else {
                    for (var i = 0, l = listeners.length; i < l; i++) {
                        listeners[i].call(Bridge.Settings.server, request, response);
                    }
                }
            });
        }
        else {
            socket = socket.connect(Bridge.Settings.server);
        }
    }
    /**
     * Sort an array
     *
     * @method sort
     * @param array
     * @param [descending]
     * @param [property]
     * @example
     * Sort the array passed as parameter, optionally pass in the sort order asc/desc and/or a field to sort by if the
     * array contains objects with subfields/subproperties
     *
     *      // sort array descending
     *      var array = Bridge.sort([1, 2, 5, 3, 9, 6, 4], true);
     *
     *      // sort array by property
     *      var array = Bridge.sort([{name: 'Fabienne'}, {name: 'Svenja'}, {name: 'Isabel'}], 'name');
     *
     *      // sort array by subproperty using the `.subfield` convention, subfield must exist otherwise the function
     *      // will throw an error
     *      var array = Bridge.sort([
     *          {name: {prename: 'Fabienne'}},
     *          {name: {prename: 'Svenja'}},
     *          {name: {prename: 'Isabel'}}], 'name.prename');
     *
     *      // sort array by field and descending
     *      var array = Bridge.sort([{name: 'Fabienne'}, {name: 'Svenja'}, {name: 'Isabel'}], true, 'name');
     */
    Bridge.sort = function (array, descending, property) {
        var sort = (function () {
            var order = (descending == true) ? -1 : 1;
            property = typeof descending == 'string' ? descending : property;
            var parts = property ? property.split('.') : null;

            return function (a, b) {
                if (parts) {
                    parts.forEach(function(item) {
                        a = a[item];
                    });
                    parts.forEach(function(item) {
                        b = b[item];
                    });
                }

                var result = (a < b) ? -1 : (a > b) ? 1 : 0;
                return result * order;
            }
        }());

        array.sort(sort);

        return array;
    }
    /**
     * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
     * Generates a unique id in RFC 4122 v4 format
     *
     * @method uuid
     * @return {String} uuid
     * @example
     * Generate a new uuid
     *
     *      Bridge.uuid(); // Returns a string like 'c3d4ef3c-54ea-47fc-c874-66952365d789'
     */
    Bridge.uuid = function () {
        var date = new Date().getTime();
        var uuid = 'XXXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX'.replace(/[XY]/g, function (character) {
            var random = (date + Math.random() * 16) % 16 | 0;
            date = Math.floor(date / 16);
            return (character == 'X' ? random : (random & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    };

    // Functionality only available on the server
    if (Bridge.isServer) {
        /**
         * <div class="usage-box"><b>USAGE: </b>Server</div>
         * Publish a collection or parts of on the server side
         *
         * @method publish
         * @param name
         * @param callback
         * @example
         * Publish a collection on the server. The callback function should always return a Cursor to the collection
         * items you want to publish.
         *
         *      Bridge.publish('allposts', function([optionalArgumentsArray]) {
         *          var Posts = Bridge.Collection('Posts');
         *          return Posts.find({username: 'My name'}).sort({date: 1}).limit(30);
         *      });
         */
        Bridge.publish = function (name, callback) {
            var cursor = callback();

            if (!publishedCollections[cursor.collection]) {
                publishedCollections[cursor.collection] = {};
            }
            else {
                if (!publishedCollections[cursor.collection][name]) {
                    publishedCollections[cursor.collection][name] = {};
                }
            }
            publishedCollections[cursor.collection][name] = {
                callback:callback,
                subscribers:new Array
            }
        };
    }
    // Functionality only available on the client
    else {
        /**
         * <div class="usage-box"><b>USAGE: </b>Client</div>
         * Subscribe a collection on the client
         *
         * @method subscribe
         * @param name
         * @param [args] {Array} Provide an array of optional arguments that are passed to the server's publish function
         * @param [callback] {Function} Provide an optional callback that is called when all data is received from the
         * server and cached locally
         * @example
         * Subscribe to a collection that is published on the server
         *
         *      Bridge.subscribe('allposts', ['argument1', 'argument2'], function (Error) {
         *          if (Error) {
         *              Bridge.Error(Error.message);
         *          }
         *          else {
         *              var Posts = Bridge.Collection('Posts');
         *          }
         *      });
         */
        Bridge.subscribe = function (name, args, callback) {
            Bridge.Socket.emit('subscribe', {
                name:name,
                args:args || null
            });
            pendingSubscriptions.counter++;
            // TODO: Add counter to avoid that toArray/bind is called while a subscription is pending for the collection
        }

        Bridge.subscriptionsCompleted = function (callback) {
            pendingSubscriptions.callbacks.push(callback);
        }
    }
    /**
     * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
     * The Cursor class is not directly accessible but it is returned whenever you call the `.find()` method of a
     * collection. A Cursor object provides standard methods to filter your result set.
     *
     * @class Cursor
     * @param collection {String}
     * @param selector
     * @param fields {Object}
     * @param options {Object}
     * @return {Cursor}
     * @constructor
     */
    var Cursor = function (collection, selector, fields, options) {
        var Cursor = function () {
            this.collection = collection;
            this.selector = selector;
            this.fields = fields;
            this.options = !options ? {} : options;

            this.sortValue = null;
            this.limitValue = null;
        };
        /**
         * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
         * Sort the result set
         *
         * @method sort
         * @param sortValue {Object}
         * @return {Cursor}
         * @example
         * Sort your results. Provide field to sort and 1 for ascending or -1 for descending.
         *
         *      var Posts = new Bridge.Collection('Posts');
         *      Posts.find().sort({date: 1});
         */
        Cursor.prototype.sort = function (sortValue) {
            this.sortValue = sortValue;

            return this;
        };
        /**
         * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
         * Limit the result set
         *
         * @method limit
         * @param limitValue {Integer}
         * @return {Cursor}
         * @example
         * Limit your results. Provide the number of results you want to retrieve. You will get back the first results
         * found in the database within the limit. Normally the results are stored in the database based on the order
         * they where inserted in.
         *
         *      var Posts = new Bridge.Collection('Posts');
         *      Posts.find().limit(5);
         */
        Cursor.prototype.limit = function (limitValue) {
            this.limitValue = limitValue;

            return this;
        };
        /**
         * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
         * Create a complete result set
         *
         * @method toArray
         * @param callback {Function}
         * @return {Cursor}
         * @example
         * Create an array of all results matching the current cursor options. <span class="important-info">Warning, the
         * array is completely mapped on the servers main memory depending on the number of items within the collection
         * that could cause a lot of memory usage. If you do not need to use the `toArray` function, you could use
         * `stream` instead to save memory</span>
         *
         *      var Posts = new Bridge.Collection('Posts');
         *      Posts.find().toArray(function (items) {
         *          console.log(items);
         *      });
         */
        Cursor.prototype.toArray = function (callback) {
            if (Bridge.isServer) {
                db.collection(this.collection).find(this.selector, this.fields).sort(this.sortValue).limit(this.limitValue, function (err, items) {
                    callback(items);
                });
            }
            else {
                var result = db[this.collection];
                var tempArray = new Array;

                if (this.selector) {
                    var keys = {
                        key: Object.keys(this.selector)[0],
                        value: this.selector[Object.keys(this.selector)[0]]
                    }

                    result = _.filter(result, function (item){
                        return item[keys.key] == keys.value;
                    });
                }

                if (_.isObject(this.fields) && !_.isArray(this.fields)) {
                    var fields = this.fields;

                    result = _.map(result, function (item) {
                        var obj = {};
                        for (field in fields) {
                            if (fields[field]) {
                                if (item.hasOwnProperty(field)) {
                                    obj[field] = item[field];
                                }
                            }
                        }

                        obj._id = item._id;

                        return obj;
                    });
                }

                if (this.sortValue) {
                    var keys = {
                        key: Object.keys(this.sortValue)[0],
                        value: this.sortValue[Object.keys(this.sortValue)[0]]
                    }

                    result = Bridge.sort(result, keys.value == -1 ? true : false, keys.key);
                }

                if (this.limitValue) {
                    for (i = 0; (i < this.limitValue) && (i < result.length); i++) {
                        tempArray.push(result[i]);
                    }
                    result = tempArray;
                }

                callback(result);
            }

            return this;
        };

        Cursor.prototype.bind = function(callback) {
            if (!db[this.collection].bindings) {
                db[this.collection].bindings = new Array;
            }
            db[this.collection].bindings.push({
                cursor: this,
                callback: callback
            })
        }

        return new Cursor;
    };
    /**
     * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
     * @Class Bridge.Collection
     * @param [name] {String} Provide a name for the collection to create a consistent collection that is synchronized with the
     * server. Otherwise the collection is only created for the current client session.
     * @return {Collection}
     * @constructor
     */
    Bridge.Collection = function (name) {
        var rulesset = null;

        var Collection = function () {
            if (Bridge.isClient) {
                if (!db.hasOwnProperty(name)) {
                    db[name] = new Array;
                }
            }
        };
        Collection.prototype.insert = function (data) {
            data._id = Bridge.uuid();
            if (Bridge.isServer) {
                db.collection(name).insert(data);
            }
            else {
                db[name].push(data);

                /*for (var binding in db[name].bindings) {
                    db[name].bindings[binding].cursor.toArray(function (items) {
                        db[name].bindings[binding].callback(items);
                    });
                }*/

                Bridge.Socket.emit('insert', {
                    collection:name,
                    data:data
                });
                return db[name];
            }

        };
        /**
         * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
         * @method find
         * @param [query] {Object}
         * @param [projection] {Object}
         * @return {Cursor}
         * @example
         * Find records in a collection matching the specified query, result contains specified fields
         *
         *      var Posts = new Bridge.Collection('Posts');
         *      // Find all elements in a collection
         *      Posts.find().toArray(function (items) {
         *          console.log(items);
         *      });
         *      // Find a record in the collection with field `_id` matching 'c3d4ef3c-54ea-47fc-c874-66952365d789'
         *      Posts.find({_id: 'c3d4ef3c-54ea-47fc-c874-66952365d789'}).toArray(function (items) {
         *          console.log(items);
         *      });
         *      // Find all records in a collection result should only contain field `post`
         *      Posts.find(null, []).
         */
        Collection.prototype.find = function find(query, projection) {
            var args = Array.prototype.slice.call(arguments);
            var selector = args[0] || null;
            var fields = args[1] || [];
            var db = Bridge.Settings.database;
            var collection = name;

            return new Cursor(collection, selector, fields);
        };
        /**
         *
         * @param query
         */
        Collection.prototype.update = function (query) {
            if (Bridge.isServer) {

            }
            else {

            }
        };
        /**
         *
         * @param query
         */
        Collection.prototype.remove = function (query) {
            if (Bridge.isServer) {
                db.collection(name).remove(query);
            }
            else {
                bindings = db[name].bindings;

                if (query) {
                    var keys = Object.keys(query);

                    if (keys.length < 1) {
                        db[name] = new Array();
                    }
                    else {
                        for (i = 0; i < db[name].length; i++) {
                            item = db[name][i];

                            _.each(keys, function (key) {
                                if (!item.hasOwnProperty(key)) {
                                    return;
                                }
                                else {
                                    if (item[key] == query[key]) {
                                        db[name].splice(i--, 1);
                                    }
                                }
                            });
                        }
                    }
                }
                else {
                    db[name] = new Array();
                }

                db[name].bindings = bindings;

                for (var binding in db[name].bindings) {
                    db[name].bindings[binding].cursor.toArray(function (items) {
                        db[name].bindings[binding].callback(items);
                    });
                }

                Bridge.Socket.emit('remove', {
                    collection: name,
                    data: query
                });
            }
        };
        if (Bridge.isServer) {
            Collection.prototype.allow = function (rules) {
                rulesset = rules;
            }
        }

        return new Collection;
    };

    Bridge.Route = (function () {
        var add = function (url, callback) {

        };

        return {
            add:function (url, callback) {
                add(url, callback);
            }
        }
    }());

    /**
     * Socket provides functions for creating new web sockets clients/servers by providing functions for Socket.listen,
     * Socket.emit and Socket.on for a socket
     *
     * @class Bridge.Socket
     */
    Bridge.Socket = (function () {
        var on = function (name, callback) {
            if (Bridge.isServer) {
                onEvents.push({name:name, callback:callback});
            }
            else {
                socket.on(name, callback);
            }
        };

        var emit = function (name, data, id) {
            //TODO: Error when user tries to emit without a connection
            if (Bridge.isServer) {
                if (id) {
                    socket.sockets[id].emit(name, data);
                }
                else {
                    emitEvents.push(name, data);
                }
            }
            else {
                socket.emit(name, data);
            }
        };

        var broadcast = function (name, data) {
            for (iosocket in socket.sockets) {
                socket.sockets[iosocket].emit(name, data);
            }
        };

        var broadcastTo = function (name, data, ids) {
            for (iosocket in socket.sockets) {
                for (id in ids) {
                    if(socket.sockets[iosocket].id == ids[id]) {
                        socket.sockets[iosocket].emit(name, data);
                    }
                }
            }
        };

        return {
            /**
             * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
             * Register a callback on a specific socket event
             *
             * @method on
             * @param name {String}
             * @param callback {Function}
             * @example
             * Register a callback for `message` event
             *
             *      Bridge.Socket.on('message', function (data) {
             *          console.log(data);
             *      });
             */
            on:function (name, callback) {
                on(name, callback);
            },
            /**
             * <div class="usage-box"><b>USAGE: </b>Anywhere</div>
             * Emit a new message to server/client
             *
             * @method emit
             * @param name {String}
             * @param data {Object}
             * @param id {String} <span class="important-info">Only available on server</span>
             * @example
             * Emit a `message` event
             *
             *      Bridge.Socket.emit('message', {
             *          user: 'username',
             *          message: 'message content'
             *      });
             */
            emit:function (name, data, id) {
                emit(name, data, id);
            },
            /**
             * <div class="usage-box"><b>USAGE: </b>Server</div>
             * Broadcast a new message to all clients
             *
             * @method broadcast
             * @param name {String}
             * @param data {Object}
             * @example
             * Broadcast a `message` to all clients
             *
             *      Bridge.Socket.broadcast('message', {
             *          user: 'username',
             *          message: 'message content'
             *      });
             */
            broadcast:function (name, data) {
                broadcast(name, data);
            },
            /**
             * <div class="usage-box"><b>USAGE: </b>Server</div>
             * Broadcast a new message to all clients provided within the `ids` parameter,
             *
             * @method broadcastTo
             * @param name {String}
             * @param data {Object}
             * @param ids {Array}
             * @example
             * Broadcast a `message` to some specified clients
             *
             *      Bridge.Socket.broadcastTo('message', {
             *          user: 'username',
             *          message: 'message content'
             *      }, [
             *          'c01c1a19-4462-4ecb-d29d-e6944afc3dd3',
             *          '8a109d17-2c0c-422c-d856-ac5b6c8eba00',
             *          '3c0b763e-acb3-4cdd-de00-4f090b9e7326'
             *      ]);
             */
            broadcastTo:function (name, data, ids) {
                broadcastTo(name, data, ids);
            }
        }
    }());

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

        if (Bridge.isServer) {
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
        }
        else {
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
                    user:user,
                    password:password
                });
            };
        }
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
            if (Bridge.isServer) {
                if (validateNewUserCallback(user)) {
                    createUserCallback(user);
                    db.collection('Users').insert(user);
                    return;
                }
                else {
                    return Bridge.Error('The creation of the user was not granted');
                }
            }
            else {
                Bridge.Socket.emit('createUser', user);
            }
        };

        return Accounts;
    }());
    /**
     * Create an Error object by providing the error details as parameter
     *
     * @class Bridge.Error
     * @param message
     * @return {Error}
     * @constructor
     * @example
     * Throw an exception with a localized error message and fallback if the localization package is not included
     *
     *      Bridge.Error(Localization.get('Error.notPrivileged') || 'You do not have the required permissions to
     *      complete this action');
     */
    Bridge.Error = function (message) {
        var Error = function () {
            console.error(message);
            this.message = message;
        };

        return new Error;
    };

    var init = function () {
        initSocketProtocol();
    };

    /**
     * Initialize socket protocol on client and server
     */
    var initSocketProtocol = function () {
        if (Bridge.isServer) {
            //Listen for client insert messages
            Bridge.Socket.on('insert', function (data) {
                // store id of client
                var id = this.id;
                // TODO: Check if operation is allowed
                db.collection(data.collection).insert(data.data);
                // TODO: Check for changes in subscribed parts of the collections
                for (var collection in publishedCollections[data.collection]) {
                    var result = new Array;
                    result.push(data.data);
                    var cursor = publishedCollections[data.collection][collection].callback();

                    if (cursor.selector) {
                        var keys = {
                            key: Object.keys(cursor.selector)[0],
                            value: cursor.selector[Object.keys(cursor.selector)[0]]
                        }

                        result = _.filter(result, function (item){
                            return item[keys.key] == keys.value;
                        });
                    }

                    if (_.isObject(cursor.fields) && !_.isArray(cursor.fields)) {
                        var fields = cursor.fields;

                        result = _.map(result, function (item) {
                            var obj = {};
                            for (var field in fields) {
                                if (fields[field]) {
                                    if (item.hasOwnProperty(field)) {
                                        obj[field] = item[field];
                                    }
                                }
                            }

                            obj._id = item._id;

                            return obj;
                        });
                    }

                    if (result.length > 0) {
                        var subscribers = publishedCollections[data.collection][collection].subscribers;
                        subscribers = _.filter(subscribers, function (item) {
                            return item != id;
                        });
                        Bridge.Socket.broadcastTo('insert', {
                            collection: data.collection,
                            data: result[0]
                        }, subscribers);
                    }
                }
            });
            Bridge.Socket.on('createUser', function (user) {
                var result = Bridge.Accounts.createUser(user);
                Bridge.Socket.emit('createUser', result, this.id);
            });
            Bridge.Socket.on('subscribe', function (data) {
                // store id of client
                var id = this.id;

                for (var collection in publishedCollections) {
                    if (publishedCollections[collection].hasOwnProperty(data.name)) {
                        var cursor = publishedCollections[collection][data.name].callback(data.args);

                        cursor.toArray(function (items) {
                            Bridge.Socket.emit('publish', {
                                name:cursor.collection,
                                data:items
                            }, id);
                        });

                        publishedCollections[collection][data.name].subscribers.push(this.id);
                        return;
                    }
                }

                //Return error if the collection is not published on the server side
                Bridge.Socket.emit('publish', {
                    Error: 'A collection called "' + data.name + '" is not published by the server.'
                }, id);
            });
            Bridge.Socket.on('remove', function (data) {
                db.collection(data.collection).remove(data.data);

                for (var collection in publishedCollections[data.collection]) {
                    var result = new Array;
                    result.push(data.data);
                    var cursor = publishedCollections[data.collection][collection].callback();

                    if (cursor.selector) {
                        var keys = {
                            key: Object.keys(cursor.selector)[0],
                            value: cursor.selector[Object.keys(cursor.selector)[0]]
                        }

                        result = _.filter(result, function (item){
                            return item[keys.key] == keys.value;
                        });
                    }

                    if (_.isObject(cursor.fields) && !_.isArray(cursor.fields)) {
                        var fields = cursor.fields;

                        result = _.map(result, function (item) {
                            var obj = {};
                            for (field in fields) {
                                if (fields[field]) {
                                    if (item.hasOwnProperty(field)) {
                                        obj[field] = item[field];
                                    }
                                }
                            }

                            obj._id = item._id;

                            return obj;
                        });
                    }

                    if (result.length > 0) {
                        var subscribers = publishedCollections[data.collection][collection].subscribers;
                        subscribers = _.filter(subscribers, function (item) {
                            return item != id;
                        });
                        Bridge.Socket.broadcastTo('remove', {
                            collection: data.collection,
                            data: result[0]
                        }, subscribers);
                    }
                }
            });
        }
        else {
            Bridge.ready(function () {
                Bridge.Socket.on('insert', function (data) {
                    db[data.collection].push(data.data);
                    for (var binding in db[data.collection].bindings) {
                        db[data.collection].bindings[binding].cursor.toArray(function (items) {
                            db[data.collection].bindings[binding].callback(items);
                        });
                    }
                });
                Bridge.Socket.on('remove', function (data) {
                    var bindings = db[data.collection].bindings;

                    if (data.data) {
                        var keys = Object.keys(data.data);

                        if (keys.length < 1) {
                            db[data.collection] = new Array();
                        }
                        else {
                            for (var i = 0; i < db[data.collection].length; i++) {
                                var item = db[data.collection][i];

                                _.each(keys, function (key) {
                                    if (!item.hasOwnProperty(key)) {
                                        return;
                                    }
                                    else {
                                        if (item[key] == data.data[key]) {
                                            db[data.collection].splice(i--, 1);
                                        }
                                    }
                                });
                            }
                        }
                    }
                    else {
                        db[data.collection] = new Array();
                    }

                    db[data.collection].bindings = bindings;

                    for (var binding in db[data.collection].bindings) {
                        db[data.collection].bindings[binding].cursor.toArray(function (items) {
                            db[data.collection].bindings[binding].callback(items);
                        });
                    }
                });
                Bridge.Socket.on('publish', function (data) {
                    // check for empty results
                    if (data.hasOwnProperty('data')) {
                        data.data.forEach(function (item) {
                            if (!db.hasOwnProperty(data.name)) {
                                db[data.name] = new Array;
                            }

                            if (!_.find(db[data.name], function (element) {
                                return element._id == item._id;
                            })) {
                                db[data.name].push(item);
                            }
                            else {
                                Bridge.Error('Element already in local database: _id: ' + item._id);
                            }
                        });
                    }
                    else {
                        if (data.hasOwnProperty('Error')) {
                            Bridge.Error(data.Error);
                        }
                    }

                    pendingSubscriptions.counter--;

                    if (pendingSubscriptions.counter == 0) {
                        for (callback in pendingSubscriptions.callbacks) {
                            pendingSubscriptions.callbacks[callback]();
                        }
                    }
                });
                // TODO: add callback
                Bridge.Socket.on('loginWithPassword', function (data) {

                });
                // TODO: fix callback
                Bridge.Socket.on('createUser', function (data) {
                    if (typeof callback == 'function') {
                        callback(data);
                    }
                });
            })
        }
    };

    init();
}(Bridge, underscore, database, socketio, fs));
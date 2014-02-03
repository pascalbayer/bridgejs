bridgejs
========

A Web Application Framework for NodeJS and Clients


Install
-------

``` bash
$ npm install -g bridgejs
```


CLI
---

Create a new app template (in current dir or specified path):
```bash
$ bridgejs 'app name'
```

Install dependencies for the new app:
```bash
$ cd 'app name' && npm install
```

Run the new app:
```bash
$ node app
```


Options
-------

bridgejs has a few different switches which change behavior.

- `-h`, `--help` Output usage information
- `-V`, `--version` Output the version number
- `-A`, `--angular` Use AngularJS as MV* Framework for your new app


Usage
-----

### Default template



### Template with AngularJS



### Template with Backbone.js

- Not available in current version


Features
--------

### Implemented features

- Client/Server Collections
- Collection insert, delete
- Collection publishing/subscription
- Integration with AngularJS
- Client side MongoDB API (cursor, find, sort, limit)
- CLI
- MongoDB as database on the server

### Missing features

- Collection allow/deny
- Collection update method
- Login services
- Client MongoDB API (operators $gt, $inc, $lt, ...)
- AngularJS service for automatic scope refresh (workaround with collection bindings is working fine)


License
-------

(The MIT License)

Copyright (c) 2013 Pascal Bayer <pascal.bayer@cubesoft.org>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/pascalbayer/bridgejs/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


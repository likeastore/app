# Likeastore.

API and Web Client of awesome Likeastore. application.

## Installation

Install few things required for development.

Mocha is used for unit testing,

```
$ npm install -g mocha
```

Client package manager,

```
$ npm install -g bower
```

Grunt build system,

```
$ npm install -g grunt-cli
```

After all developer dependencies are installed,

```
$ npm install
$ bower install
$ grunt
```

Run application (make sure your mongod is running),

```
$ node app.js
```

## Working

Please keep in mind that all current work commits are pushed to **development** branch.

## Testing

To run full test suite,

```
$ npm test
```

## Pre-requisites

Application requires `collector` component to be up and running, to collect users data.

Clone collector app,

```
$ git clone git@github.com:likeastore/collector.git
```

Run tests,

```
$ npm test
```

Run collector,

```
$ node app.js
```

## Useful tools / tips

* To quickly clean up developers database, run

```
$ node tools/cleanDb.js
```
# ngCustomerVoice

Small [Angular.js](http://angularjs.org) provider for sending feedback, Q&A and support for your application. It can be used as replacement for [Intercom](https://www.intercom.io) or [Uservoice](https://www.uservoice.com/) messaging plugins.

[![](https://farm8.staticflickr.com/7346/14003765983_137b61a269_c.jpg)](http://likeastore.github.io/ngCustomerVoice)

### [Demo](http://likeastore.github.io/ngCustomerVoice)

## Install

ngCustomerVoice is a simple angular provider and directive based on [ngDialog](http://likeastore.github.io/ngDialog/) popups. So for proper work you can install it through [Bower](http://bower.io/) package manager (recommended):

```bash
bower install ngCustomerVoice
```

And don't forget to include all necessary javascript and css files to your application:

- ``ngDialog.css``
- ``ngCustomerVoice.css``
- ``angular.js``
- ``ngDialog.js``
- ``ngCustomerVoice.js``

## Usage

To start using plugin you just need to insert **directive** into your template:

```html
<div ng-customer-voice="'your.user@email.com'"></div>
```

You are able to insert some identifier of a user (email, username, id, etc.) but it's optional, this can be handled on your server instead.

And inside your app configuration  use ``ngCustomerVoiceProvider`` to specify which API url will be requested:

```js
var app = angular.module('YourApp', ['ngDialog', 'ngCustomerVoice']);
app.config(['ngCustomerVoiceProvider', function (ngCustomerVoiceProvider) {
	ngCustomerVoiceProvider.apiUrl('/your/email/server');
}]);
```

That's it!

## License

MIT Licensed

Copyright (c) 2014, Likeastore.com info@likeastore.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

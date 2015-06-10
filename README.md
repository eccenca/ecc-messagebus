# Postal.js with util

Eccenca Postal wrapper that adds a set of utilities on top of default postal.js lib.

## Usage

`ecc-postal` exports a normal postal.js instance but with a set of additional functions.
Currently it adds two things:  
1. Request-response pattern support
2. Subscription wrapped into [Rx.Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)

### Using request-response
Request-response pattern is added using [postal.request-response](https://github.com/postaljs/postal.request-response) and can be used like so:

```js
import postal from 'ecc-postal';
// ...
// get channel
const channel = postal.channel('yourChannel');
// subscribe to topic
channel.subscribe('someTopic', (msg, envelop) => {
    // ...
    // use envelop.reply to send response
    envelop.reply(null, {some: 'response'});
});
// ...
// initiate request and handle response as a promise
channel.request({
    topic: 'someTopic',
    data: {test: 'test'},
    timeout: 2000
})
.then((data) => {
    // work with data here
    // ...
},
(err) => {
    // catch and handle error here
    // ...
});
```

### Using Rx.Observable subscription

Rx.Observable pattern is added using [postal.observe](https://github.com/yamalight/postal.observe) and can be used like so:

```js
import postal from 'ecc-postal';
// ...
// get channel
const channel = postal.channel('yourChannel');
// subscribe to topic (you can also use postal.observe({channel, topic}))
const source = channel.observe('someTopic');
// do your work over the Rx.Observable
// e.g. source.skip(1).take(1).delay(100)...
source.subscribe(
(body) => {
    // handle result body here
    // ...
},
(err) => {
    // handle error here
    // ...
},
() => {
    // handle stream completion here
    // ...
});
```

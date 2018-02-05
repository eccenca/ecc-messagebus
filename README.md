# Eccenca Message Bus for inter-component and in-app communications

`ecc-messagebus` exports a normal rxmq.js instance but with a set of additional functions.
For convenience reasons it also exports `Rx` so that we can use a fixed `Rx` version in all components. 

## Using Rx

```js
import {Rx} from 'ecc-messagebus';

var source = Rx.Observable.just(42);

var subscription = source.subscribe(
  function (x) {
    console.log(`Next: ${x}');
  },
  function (err) {
    console.log(`Error: ${err}`);
  },
  function () {
    console.log('Completed');
  });

// => Next: 42
// => Completed

```

## Using request-response

Request-response pattern can be used like so:

```js
import rxmq from 'ecc-messagebus';
// ...
// get channel
const channel = rxmq.channel('yourChannel');
// subscribe to topic
channel.subject('someTopic').subscribe(({data, replySubject}) => {
    // ...
    // use envelop.reply to send response
    replySubject.onNext({some: 'response'});
    replySubject.onCompleted();
});
// ...
// initiate request and handle response as a promise
channel.request({
    topic: 'someTopic',
    data: {test: 'test'},
    timeout: 2000
})
.subscribe((data) => {
    // work with data here
    // ...
},
(err) => {
    // catch and handle error here
    // ...
});
```

# Rxmq.js with util

Eccenca Rxmq wrapper.

## Usage

`ecc-messagebus` exports a normal rxmq.js instance but with a set of additional functions.

### Using request-response

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

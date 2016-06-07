# Rxmq.js with util (ecc-messagebus)

Eccenca Message Bus for inter-component and in-app communications
Eccenca Rxmq wrapper.

## Usage

`ecc-messagebus` exports a normal rxmq.js instance but with a set of additional functions.
One of those functions is the `createChannels` helper.

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

### Creating Channel Definitions

The `createChannels` functions allows to define channels and subjects.
Basically it allows to create a channelDefinition with private and public subjects.
The Channel of Private Subjects can be changed.
This may sound counter-intuitive, but is actually a nice wrapper around changing channels.
This helper is predominantly used within the `ecc-mixins` to create an event-bus per component instance,
so that there are no side effects (two components reacting on the same click handler)

```

// in a channelDefinition.js

import {createChannels, SubjectType} from 'ecc-messagebus'

const {privateChannel, publicChannel} = createChannels({
    name: 'component',
    subjects: {
        secretMessage: SubjectType.private,
        update: SubjectType.public,
    }
});

export {privateChannel, publicChannel};

// in Component A

import {publicChannel, privateChannel} from './channelDefinition.js';

// Handle public messages
publicChannel.update.getSubject().subscribe(() => {
    console.log('There was an update');
});

// Handle Secret Message from Component B
publicChannel.secretMessage.getSubject('secret-key-b').subscribe(() => {
    console.log('Uuuuuh, a secret message from Component B');
});

// Handle Secret Message from Component C
publicChannel.secretMessage.getSubject('secret-key-c').subscribe(() => {
    console.log('Uuuuuh, a secret message from Component C');
});

// in Component B

import {privateChannel} from './channelDefinition.js';

// Send to Component A on Secret Channel
publicChannel.secretMessage.getSubject('secret-key-b').onNext('pssst, component A');

// in Component C

import {privateChannel} from './channelDefinition.js';

// Send to Component A on Secret Channel
publicChannel.secretMessage.getSubject('secret-key-c').onNext('pssst, component A');

```


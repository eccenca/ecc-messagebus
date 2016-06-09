/* global describe, it */
// imports
import should from 'ecc-test-helpers';

// import module
import rxmq from '../index.js';
import {createChannels, SubjectType} from '../index';

// main test suite
describe('rxmq.js', function() {
    it('should exist', function() {
        // check object
        should.exist(rxmq);
    });

    it('should work with normal rxmq workflow', function(done) {
        const channel = rxmq.channel('test1');
        channel.subject('test').subscribe((msg) => {
            should(msg).equal('test');
            done();
        });
        channel.subject('test').onNext('test');
    });

    it('should work with request-response workflow', function(done) {
        const channel = rxmq.channel('test2');
        channel.subject('test').subscribe(({data, replySubject}) => {
            should(data).equal('test');
            replySubject.onNext('ok');
            replySubject.onCompleted();
        });
        channel.request({
            topic: 'test',
            data: 'test',
        }).subscribe((data) => {
            should(data).equal('ok');
            done();
        });
    });

    it('should work with Rx.Observable workflow', function(done) {
        const channel = rxmq.channel('test3');
        // rx workflow
        const source = channel.subject('test');
        source.skip(1).take(1).delay(100).subscribe(
            (body) => {
                should(body).equal('test2');
            }, (err) => {
                throw err;
            }, () => done());

        // dispatch messages
        channel.subject('test').onNext('test');
        channel.subject('test').onNext('test2');
        channel.subject('test').onNext('test3');
    });

    it('should apply middleware', function(done) {
        const channel = rxmq.channel('test4');
        // rx workflow
        const source = channel.subject('test');
        source.middleware.add((val) => val + '_middleware');
        source.subscribe((body) => {
            should(body).equal('test_middleware');
            done();
        });

        // dispatch messages
        channel.subject('test').onNext('test');
    });
});

describe('createChannel', () => {
    it('should exist', () => {
        // check object
        should.exist(createChannels);
    });

    it('should throw if defaultChannel Parameter is missing', () => {
        should.throws(createChannels, Error); // note no parentheses
    });

    it('should throw if SubjectType is unknown', () => {

        const subjects = {
            failingType: false
        };

        should.throws(createChannels.bind(null, {name: 'foo', subjects}), Error); // note no parentheses
    });

    describe('private and public channels', () => {

        let channels;
        let publicChannel;
        let privateChannel;
        let subs;

        beforeEach(() => {
            subs = [];
            channels = createChannels({
                name: 'default',
                subjects: {
                    testSubjectPrivate: SubjectType.private,
                    testSubjectPublic: SubjectType.public,
                }
            });
            ({privateChannel, publicChannel} = channels);
        });

        afterEach(()=> {
            channels = null;
            publicChannel = null;
            privateChannel = null;
            subs.forEach(sub => sub.dispose());
            subs = [];
        });

        it('should create public and private channels', () => {
            should.exist(privateChannel.testSubjectPrivate);
            should.not.exist(privateChannel.testSubjectPublic);
            should.not.exist(publicChannel.testSubjectPrivate);
            should.exist(publicChannel.testSubjectPublic);

        });

        it('should send and recieve on default private channel', (done) => {
            const subj = privateChannel.testSubjectPrivate.getSubject();

            const sub = subj.subscribe((body) => {
                should(body).equal('test');
                done();
            });

            subs.push(sub);

            subj.onNext('test');

        });

        it('should send and recieve on custom private channel', (done) => {
            const subj = privateChannel.testSubjectPrivate.getSubject();
            // Public Channel should change the name
            const priv = privateChannel.testSubjectPrivate.getSubject('private');

            const sub = priv.subscribe((body) => {
                should(body).equal('test');
                done();
            });

            subs.push(sub);
            // The following should not be recieved
            subj.onNext('this-should-fail');
            priv.onNext('test');

        });

        it('should send and recieve on public channel', (done) => {
            const subj = publicChannel.testSubjectPublic.getSubject();
            // Public Channel should not change the name
            const priv = publicChannel.testSubjectPublic.getSubject('private');

            let count = 2;

            const sub = subj.subscribe((body) => {
                should(body).equal('test');
                count -= 1;
                if (!count) {
                    done();
                }
            });

            subs.push(sub);

            subj.onNext('test');
            priv.onNext('test');

        });

        it('should throw if onNext is used directly', () => {
            should.throws(publicChannel.testSubjectPublic.onNext, Error)
        });

        it('should throw if subscribe is used directly', () => {
            should.throws(publicChannel.testSubjectPublic.subscribe, Error)
        });

    });

});

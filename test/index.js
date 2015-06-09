/* global describe, it */
// imports
import should from 'ecc-test-helpers';

// import module
import postal from '../index.js';

// main test suite
describe('Postal.js', function() {
    it('should exist', function() {
        // check object
        should.exist(postal);
    });

    it('should work with normal postal workflow', function(done) {
        const channel = postal.channel('test1');
        channel.subscribe('test', (msg) => {
            should(msg).equal('test');
            done();
        });
        channel.publish('test', 'test');
    });

    it('should work with request-response workflow', function(done) {
        const channel = postal.channel('test2');
        channel.subscribe('test', (msg, envelop) => {
            should(msg).equal('test');
            envelop.reply(null, 'ok');
        });
        channel.request({
            topic: 'test',
            data: 'test',
            timeout: 2000
        }).then((data) => {
            should(data).equal('ok');
            done();
        }, (err) => { throw err; });
    });

    it('should work with Rx.Observable workflow', function(done) {
        const channel = postal.channel('test3');
        // rx workflow
        const source = channel.rxSubscribe('test');
        source.skip(1).take(1).delay(100).subscribe(
        (body) => {
            should(body).equal('test2');
        }, (err) => { throw err; }, () => done());

        // dispatch messages
        channel.publish('test', 'test');
        channel.publish('test', 'test2');
        channel.publish('test', 'test3');
    });
});

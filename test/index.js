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
        channel.subject('test').subscribe((msg) => {
            should(msg).equal('test');
            done();
        });
        channel.subject('test').onNext('test');
    });

    it('should work with request-response workflow', function(done) {
        const channel = postal.channel('test2');
        channel.subject('test').subscribe(({data, replySubject}) => {
            should(data).equal('test');
            replySubject.onNext('ok');
            replySubject.onCompleted();
        });
        channel.request('test', {
            data: 'test',
        }).subscribe((data) => {
            should(data).equal('ok');
            done();
        });
    });

    it('should work with Rx.Observable workflow', function(done) {
        const channel = postal.channel('test3');
        // rx workflow
        const source = channel.subject('test');
        source.skip(1).take(1).delay(100).subscribe(
        (body) => {
            should(body).equal('test2');
        }, (err) => { throw err; }, () => done());

        // dispatch messages
        channel.subject('test').onNext('test');
        channel.subject('test').onNext('test2');
        channel.subject('test').onNext('test3');
    });
});

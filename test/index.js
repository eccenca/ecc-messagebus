/* global describe, it */
// imports
import should from 'should';

// import module
import rxmq, {Rx} from '../index';

// main test suite
describe('rxmq.js', () => {
    it('should exist', () => {
        // check object
        should.exist(rxmq);
    });

    it('should work with normal rxmq workflow', done => {
        const channel = rxmq.channel('test1');
        channel.subject('test').subscribe(msg => {
            should(msg).equal('test');
            done();
        });
        channel.subject('test').next('test');
    });

    it('should work with request-response workflow', done => {
        const channel = rxmq.channel('test2');
        channel.subject('test').subscribe(({data, replySubject}) => {
            should(data).equal('test');
            replySubject.next('ok');
            replySubject.complete();
        });
        channel
            .request({
                topic: 'test',
                data: 'test',
            })
            .subscribe(data => {
                should(data).equal('ok');
                done();
            });
    });

    it('should work with Rx.Observable workflow', done => {
        const channel = rxmq.channel('test3');
        // rx workflow
        const source = channel.subject('test');
        source
            .skip(1)
            .take(1)
            .delay(100)
            .subscribe(
                body => {
                    should(body).equal('test2');
                },
                err => {
                    throw err;
                },
                () => done()
            );

        // dispatch messages
        channel.subject('test').next('test');
        channel.subject('test').next('test2');
        channel.subject('test').next('test3');
    });

    it('should expose Rx ', done => {
        Rx.Observable.of(1).subscribe(data => {
            should(data).equal(1);
            done();
        });
    });
});

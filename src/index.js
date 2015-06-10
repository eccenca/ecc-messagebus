import postal from 'postal';
import postalRequestResponse from 'postal.request-response';
import postalObserve from 'postal.observe';
import Promise from 'bluebird';

// apply postal observe addon
postalObserve(postal);
// apply postal request-response addon
postalRequestResponse(postal);
// We have to tell postal how to get an deferred instance
postal.configuration.promise.createDeferred = function() {
    var defer = function() {
        var resolve, reject;
        var promise = new Promise(function() {
            resolve = arguments[0];
            reject = arguments[1];
        });
        return {
            resolve: resolve,
            reject: reject,
            promise: promise,
        };
    };
    return defer();
};
// We have to tell postal how to get a "public-facing"/safe promise instance
postal.configuration.promise.getPromise = function(dfd) {
    return dfd.promise;
};

export default postal;

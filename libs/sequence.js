function Sequence ( fn ) {
    var self = this;
    var fns = [];
    var done = function () {
        fns.shift();
        if (fns.length > 0) { triggerFn(fns[0]); }
        return self;
    };
    this.then = function (fn) {
        fns.push(fn);
        return self;
    };
    this.delay = function (ms) {
        self.then(function (done) {
            setTimeout(done, ms);
        });
        return self;
    };
    this.start = function () {
        triggerFn(fns[0]);
        return self;
    };
    function triggerFn (fn) {
        // it expects an done object
        if (fn.length > 0) {
            fn(done);
        } else {
            fn();
            done();
        }
    }
    if (typeof fn === 'function') {
        this.then(fn);
    }
    return this;
}

module.exports = Sequence;
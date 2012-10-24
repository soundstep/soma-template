/*
 * - BUNYIP - http://github.com/ryanseddon/bunyip
 * Yeti Jasmine adaptor, drop this in a test suite that will run through Yeti.
 * See readme.md for specific instructions.
 * MIT License - Copyright (c) 2012 Ryan Seddon
 * http://github.com/ryanseddon/yeti-adpators
*/

var BUNYIP = BUNYIP || {};

(function(win, undef){

    var testsuite = {}, spec,
        tostring = {}.toString;
    
    BUNYIP = testsuite;
    
    /* Yeti uses socket.io and emits a results event when test suite has completed */
    function complete(results) {
        //console.log(results);
        if (win.$yetify !== undef) {
            $yetify.tower.emit("results", results);
        }
    }
    
    function type(obj) {
        return tostring.call(obj).match(/^\[object\s+(.*?)\]$/)[1];
    }
    
    function message(result) {
        if(!result.passed_) {
            if(result.actual != undef && result.expected != undef) {
                result.message = result.message + "\nExpected: " + result.expected.toString() + " (" + type(result.expected) + ")\nActual: " + result.actual.toString() + " (" + type(result.actual) + ")";
                
                // Delete props so we don't get any circular refs
                delete result.actual;
                delete result.expected;
            }
        }
        return result.message;
    }
    
    BUNYIP.hookup = function(env) {
        // Create a JsApiReporter instance so we can hook into the test runner
        var jsAPI = new jasmine.JsApiReporter();
        env.addReporter(jsAPI);
        
        jsAPI.reportRunnerStarting = function(runner) {
            spec = runner.queue.blocks[0].description;
        };
        
        // This will fire for each test passing an object of lot's of juicy info
        jsAPI.reportSpecResults = function(runner) {
            var suite = runner.suite,
                suiteName = suite.description,
                results = suite.results(),
                test = runner.results_.items_[0];
            
            // If suite already exists update object info, otherwise create it
            if(BUNYIP[suiteName]) {
                BUNYIP[suiteName].passed = results.passedCount;
                BUNYIP[suiteName].failed = results.failedCount;
                BUNYIP[suiteName].total = results.totalCount;
            } else {
                BUNYIP[suiteName] = {
                    name: suiteName,
                    passed: results.passedCount,
                    failed: results.failedCount,
                    total: results.totalCount
                };
            }

            BUNYIP[suiteName][runner.description] = {
                result: (test && test.passed_) ? test.passed_ : "fail",
                message: test ? message(test):'',
                name: runner.description
            };
        };
        
        // Fires when test runner has completed
        jsAPI.reportRunnerResults = function(suite) {
            var tests = suite.results();
            
            var results = BUNYIP;
            
            results.passed = tests.passedCount || 0;
            results.failed = tests.failedCount || 0;
            results.total = tests.totalCount;
            // TODO: How do I get the test suite runtime?
            results.duration = 0;
            results.name = spec;
            // Delete the hookup prop once complete
            delete results.hookup;

            complete(results);
        };
    };

})(this);
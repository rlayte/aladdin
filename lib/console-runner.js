/**
 Jasmine Reporter that outputs test results to the browser console. 
 Useful for running in a headless environment such as PhantomJs, ZombieJs etc.

 Usage:
 // From your html file that loads jasmine:  
 jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
 jasmine.getEnv().execute();
*/

(function(jasmine, console) {
  if (!jasmine) {
    throw "jasmine library isn't loaded!";
  }

  var ANSI = {}
  ANSI.color_map = {
      "green" : 32,
      "red"   : 31
  }

  ANSI.colorize_text = function(text, color) {
    var color_code = this.color_map[color];
    return "\033[" + color_code + "m" + text + "\033[0m";
  }
  
  var ConsoleReporter = function() {
    if (!console || !console.log) { throw "console isn't present!"; }
    this.status = this.statuses.stopped;
  };

  var proto = ConsoleReporter.prototype;
  proto.statuses = {
    stopped : "stopped",
    running : "running",
    fail    : "fail",
    success : "success"
  };

  var fails = [];

  var indent = function(str, amount) {
    var indentation = "";
    var amount = amount || 2;

    for(var i = 0; i < amount; i++) {
      indentation += " ";
    }

    return indentation + str;
  }

  proto.reportRunnerStarting = function(runner) {
    this.status = this.statuses.running;
    this.start_time = (new Date()).getTime();
    this.executed_specs = 0;
    this.passed_specs = 0;
    this.log("Starting...");
    this.log("");
  };

  proto.reportRunnerResults = function(runner) {
    var failed = this.executed_specs - this.passed_specs;
    var spec_str = this.executed_specs + (this.executed_specs === 1 ? " spec, " : " specs, ");
    var fail_str = failed + (failed === 1 ? " failure" : " failures");
    var color = (failed > 0)? "red" : "green";
    var dur = (new Date()).getTime() - this.start_time;

    this.log("");
    this.log("Finished in " + (dur/1000) + " seconds");
    this.log(spec_str + fail_str, color);

    this.status = (failed > 0)? this.statuses.fail : this.statuses.success;

    /* Print something that signals that testing is over so that headless browsers
       like PhantomJs know when to terminate. */
    this.log("");
    this.log("ConsoleReporter finished");
  };


  proto.reportSpecStarting = function(spec) {
    this.executed_specs++;
  };

  proto.reportSpecResults = function(spec) {
    if (spec.results().passed()) {
      this.passed_specs++;
      return;
    }

    if (!fails.length) {
      this.log("Failures:");
      this.log("");
    }

    fails.push(spec);

    var resultText = (fails.length) + ') ' + spec.getFullName();
    this.log(indent(resultText));

    var items = spec.results().getItems()
    for (var i = 0; i < items.length; i++) {
      var trace = items[i].trace.stack || items[i].trace;
      this.log(indent(items[i].trace.message, 5), 'red');
    }

    this.log("");
  };

  proto.reportSuiteResults = function(suite) {
  };

  proto.log = function(str, color) {
    var text = (color != undefined)? ANSI.colorize_text(str, color) : str;
    console.log(text)
  };

  jasmine.ConsoleReporter = ConsoleReporter;
})(jasmine, console);


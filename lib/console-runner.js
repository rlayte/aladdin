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
      "red"   : 31,
      "teal"  : 36
  }

  ANSI.colorize_text = function(text, color) {
    var color_code = this.color_map[color];
    return "\033[" + color_code + "m" + text + "\033[0m";
  }
  
  var ConsoleReporter = function() {
    if (!console || !console.log) { throw "console isn't present!"; }
    this.status = this.statuses.stopped;
    this.finished = false;
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

    this.log("");
    this.log("Specs:");
    this.log("");
  };

  proto.reportRunnerResults = function(runner) {
    var results = runner.results();
    var failed = results.failedCount;
    var spec_str = results.totalCount + (results.totalCount === 1 ? " spec, " : " specs, ");
    var fail_str = failed + (failed === 1 ? " failure" : " failures");
    var color = (failed > 0)? "red" : "green";
    var dur = (new Date()).getTime() - this.start_time;

    if (failed) {
      this.log("");
      this.log("");
      this.log("Failures:");
      this.log("");
    }

    var specs = runner.specs();
    var failedSpecs = [];

    for(var i = 0; i < specs.length; i++) {
      var spec = specs[i];

      if (!spec.results().passed()) {
        failedSpecs.push(spec);
      }
    }

    for(var i = 0; i < failedSpecs.length; i++) {
      var spec = failedSpecs[i];
      var resultText = (i + 1) + ') ' + spec.getFullName();
      this.log(indent(resultText));

      var items = spec.results().getItems()
      for (var j = 0; j < items.length; j++) {
        var message = items[j].trace.stack || items[j].trace.message;

        if (message) {
          var lines = message.split('\n');

          if (trace) {
            this.log(indent(lines.shift(), 5), 'red');
            this.log(indent(lines.join('\n   '), 3), 'teal');
          }
          else {
            this.log(indent(lines[0], 5), 'red');
          }
        }
      }

      this.log('');
    }
    
    this.log("");
    this.log("Finished in " + (dur/1000) + " seconds");
    this.finished = true;
    this.log(spec_str + fail_str, color);

    this.status = (failed > 0)? this.statuses.fail : this.statuses.success;
  };

  proto.reportSpecResults = function(spec) {
    var color = spec.results().passed() ? 'green' : 'red';
    this.log(indent('- ' + spec.getFullName()), color);
  };

  proto.reportSuiteResults = function(suite) {
  };

  proto.log = function(str, color) {
    var text = (color != undefined)? ANSI.colorize_text(str, color) : str;
    console.log(text)
  };

  jasmine.ConsoleReporter = ConsoleReporter;
})(jasmine, console);


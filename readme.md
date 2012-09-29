Aladdin
=======

A whole new world of javascript testing.


Installation
-------------------

    brew install phantomjs
    sudo npm install aladdin -g


Loading source files
--------------------

By default phantom-jasmine will look for a json file in `spec/config.json`. Use this to list all the scripts you want to load before your specs. e.g.

    [ 
      'lib/jquery.js',
      'app/**/*.js'
	]

If you want to put this file elsewhere use the `--config` flag, e.g.

    aladdin --config tests/config.json


Running Tests
-------------------

    aladdin

Or run specific specs

    aladdin spec/path/my_spec.js
    aladdin spec/path/

If everything works you should see output like this in your terminal:

    Starting...

    Failures:

      1) failure should fail for the example.
         Expected false to be truthy.

    Finished in 0.009 seconds
    21 specs, 1 failures

Options
-------

    --format, -f [type]   Specify a format type for the spec output. Options "doc"
    --config, -c [file]   Path to config file
    --trace, -t           Show full stack traces
    --defer, -d           Defers execution of tests, requiring a manual call to `jasmine.getEnv().execute();`

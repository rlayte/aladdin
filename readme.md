Installation
-------------------

    brew install phantomjs
    sudo npm install phantom-jasmine -g


Loading source files
--------------------

By default phantom-jasmine will look for a json file in `spec/config.json`. Use this to list all the scripts you want to load before your specs. e.g.

    [ 
      'lib/jquery.js',
      'app/**/*.js'
	]

If you want to put this file elsewhere use the `--config` flag, e.g.

    phantom-jasmine --config tests/config.json


Running Tests
-------------------

    phantom-jasmine

Or run specific specs

    phantom-jasmine spec/path/my_spec.js
    phantom-jasmine spec/path/

If everything works you should see output like this in your terminal:
Starting...

    Failures:

      1) failure should fail for the example.
         Expected false to be truthy.


    Finished in 0.009 seconds
    21 specs, 15 failures

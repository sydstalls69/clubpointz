/**
 * Gruntfile
 *
 * If you created your Sails app with `sails new foo --linker`, 
 * the following files will be automatically injected (in order)
 * into the EJS and HTML files in your `views` and `assets` folders.
 *
 * At the top part of this file, you'll find a few of the most commonly
 * configured options, but Sails' integration with Grunt is also fully
 * customizable.  If you'd like to work with your assets differently 
 * you can change this file to do anything you like!
 *
 * More information on using Grunt to work with static assets:
 * http://gruntjs.com/configuring-tasks
 */

var fs = require('fs');
var path = require('path');
var wrench = require('wrench');
var Mocha = require('mocha');

var SCRAPER_DIR = 'tasks/scraper';
var SCRAPER_DATA_DIR = 'tasks/scraper/data';
var TEST_DIR = 'tests';

module.exports = function (grunt) {

  /**
   * CSS files to inject in order
   * (uses Grunt-style wildcard/glob/splat expressions)
   *
   * By default, Sails also supports LESS in development and production.
   * To use SASS/SCSS, Stylus, etc., edit the `sails-linker:devStyles` task 
   * below for more options.  For this to work, you may need to install new 
   * dependencies, e.g. `npm install grunt-contrib-sass`
   */

  var cssFilesToInject = [
    'linker/**/*.css'
  ];


  /**
   * Javascript files to inject in order
   * (uses Grunt-style wildcard/glob/splat expressions)
   *
   * To use client-side CoffeeScript, TypeScript, etc., edit the 
   * `sails-linker:devJs` task below for more options.
   */

  var jsFilesToInject = [

    // Below, as a demonstration, you'll see the built-in dependencies 
    // linked in the proper order order

    // Bring in the socket.io client
    //'linker/js/socket.io.js',

    // then beef it up with some convenience logic for talking to Sails.js
    //'linker/js/sails.io.js',
   
    // *->    put other dependencies here   <-*

    // All of the rest of your app scripts imported here
    //'linker/**/*.js'
   
    // chris is playing around with this
    
    // load all the 3rd party stuff first
    'linker/js/3p/jquery*.js',
    'linker/js/3p/underscore*.js',
    'linker/js/3p/*.js',

    'linker/js/app.js',

    // adding in the backbone app stuff
    'linker/js/app/*.js',
    'linker/js/app/models/*.js',
    'linker/js/app/collections/*.js',
    'linker/js/app/views/*.js'
  ];


  /**
   * Client-side HTML templates are injected using the sources below
   * The ordering of these templates shouldn't matter.
   * (uses Grunt-style wildcard/glob/splat expressions)
   * 
   * By default, Sails uses JST templates and precompiles them into 
   * functions for you.  If you want to use jade, handlebars, dust, etc.,
   * edit the relevant sections below.
   */

  var templateFilesToInject = [
    'linker/**/templates/*'
  ];



  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  //
  // DANGER:
  //
  // With great power comes great responsibility.
  //
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  // Modify css file injection paths to use 
  cssFilesToInject = cssFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
  });

  // Modify js file injection paths to use 
  jsFilesToInject = jsFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
  });
  
  
  templateFilesToInject = templateFilesToInject.map(function (path) {
    return 'assets/' + path;
  });


  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
  grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
  grunt.loadTasks(depsPath + '/grunt-sails-linker/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-jst/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-uglify/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-coffee/tasks');

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dev: {
        files: [
          {
          expand: true,
          cwd: './assets',
          src: ['**/*.!(coffee)'],
          dest: '.tmp/public'
        }
        ]
      },
      build: {
        files: [
          {
          expand: true,
          cwd: '.tmp/public',
          src: ['**/*'],
          dest: 'www'
        }
        ]
      }
    },

    clean: {
      dev: ['.tmp/public/**'],
      build: ['www']
    },

    jst: {
      dev: {

        // To use other sorts of templates, specify the regexp below:
        // options: {
        //   templateSettings: {
        //     interpolate: /\{\{(.+?)\}\}/g
        //   }
        // },

        files: {
          '.tmp/public/jst.js': templateFilesToInject
        }
      }
    },

    sass: {
      dev: {
        files: [
          {
          expand: true,
          cwd: 'assets/styles/',
          src: ['*.scss'],
          dest: '.tmp/public/styles/',
          ext: '.css'
        }, {
          expand: true,
          cwd: 'assets/linker/styles/',
          src: ['*.scss'],
          dest: '.tmp/public/linker/styles/css/',
          ext: '.css'
        }
        ]
      }
    },

    jshint: {
       src: ['*.js', 'api/**/*.js', 'tasks/**/*.js', 'tests/**/*.js']
    },

    coffee: {
      dev: {
        options:{
          bare:true
        },
        files: [
          {
            expand: true,
            cwd: 'assets/js/',
            src: ['**/*.coffee'],
            dest: '.tmp/public/js/',
            ext: '.js'
          }, {
            expand: true,
            cwd: 'assets/linker/js/',
            src: ['**/*.coffee'],
            dest: '.tmp/public/linker/js/',
            ext: '.js'
          }
        ]
      }
    },

    concat: {
      js: {
        src: jsFilesToInject,
        dest: '.tmp/public/concat/production.js'
      },
      css: {
        src: cssFilesToInject,
        dest: '.tmp/public/concat/production.css'
      }
    },

    uglify: {
      dist: {
        src: ['.tmp/public/concat/production.js'],
        dest: '.tmp/public/min/production.js'
      }
    },

    cssmin: {
      dist: {
        src: ['.tmp/public/concat/production.css'],
        dest: '.tmp/public/min/production.css'
      }
    },

    'sails-linker': {

      devJs: {
        options: {
          startTag: '<!--SCRIPTS-->',
          endTag: '<!--SCRIPTS END-->',
          fileTmpl: '<script src="%s"></script>',
          appRoot: '.tmp/public'
        },
        files: {
          '.tmp/public/**/*.html': jsFilesToInject,
          'views/**/*.html': jsFilesToInject,
          'views/**/*.ejs': jsFilesToInject
        }
      },

      prodJs: {
        options: {
          startTag: '<!--SCRIPTS-->',
          endTag: '<!--SCRIPTS END-->',
          fileTmpl: '<script src="%s"></script>',
          appRoot: '.tmp/public'
        },
        files: {
          '.tmp/public/**/*.html': ['.tmp/public/min/production.js'],
          'views/**/*.html': ['.tmp/public/min/production.js'],
          'views/**/*.ejs': ['.tmp/public/min/production.js']
        }
      },

      devStyles: {
        options: {
          startTag: '<!--STYLES-->',
          endTag: '<!--STYLES END-->',
          fileTmpl: '<link rel="stylesheet" href="%s">',
          appRoot: '.tmp/public'
        },

        // cssFilesToInject defined up top
        files: {
          '.tmp/public/**/*.html': cssFilesToInject,
          'views/**/*.html': cssFilesToInject,
          'views/**/*.ejs': cssFilesToInject
        }
      },

      prodStyles: {
        options: {
          startTag: '<!--STYLES-->',
          endTag: '<!--STYLES END-->',
          fileTmpl: '<link rel="stylesheet" href="%s">',
          appRoot: '.tmp/public'
        },
        files: {
          '.tmp/public/index.html': ['.tmp/public/min/production.css'],
          'views/**/*.html': ['.tmp/public/min/production.css'],
          'views/**/*.ejs': ['.tmp/public/min/production.css']
        }
      },

      // Bring in JST template object
      devTpl: {
        options: {
          startTag: '<!--TEMPLATES-->',
          endTag: '<!--TEMPLATES END-->',
          fileTmpl: '<script type="text/javascript" src="%s"></script>',
          appRoot: '.tmp/public'
        },
        files: {
          '.tmp/public/index.html': ['.tmp/public/jst.js'],
          'views/**/*.html': ['.tmp/public/jst.js'],
          'views/**/*.ejs': ['.tmp/public/jst.js']
        }
      },


      /*******************************************
       * Jade linkers (TODO: clean this up)
       *******************************************/

      devJsJADE: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': jsFilesToInject
        }
      },

      prodJsJADE: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': ['.tmp/public/min/production.js']
        }
      },

      devStylesJADE: {
        options: {
          startTag: '// STYLES',
          endTag: '// STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': cssFilesToInject
        }
      },

      prodStylesJADE: {
        options: {
          startTag: '// STYLES',
          endTag: '// STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': ['.tmp/public/min/production.css']
        }
      },

      // Bring in JST template object
      devTplJADE: {
        options: {
          startTag: '// TEMPLATES',
          endTag: '// TEMPLATES END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/**/*.jade': ['.tmp/public/jst.js']
        }
      }
      /************************************
       * Jade linker end
       ************************************/
    },

    watch: {
      api: {

        // API files to watch:
        files: ['api/**/*']
      },
      assets: {

        // Assets to watch:
        files: ['assets/**/*'],

        // When assets are changed:
        tasks: ['compileAssets', 'linkAssets']
      }
    }
  });

  // When Sails is lifted:
  grunt.registerTask('default', [
    'compileAssets',
    'linkAssets',
    'watch'
  ]);

  grunt.registerTask('compileAssets', [
    'clean:dev',
    'jst:dev',
    'sass:dev',
    'copy:dev',    
    'coffee:dev'
  ]);

  grunt.registerTask('linkAssets', [

    // Update link/script/template references in `assets` index.html
    'sails-linker:devJs',
    'sails-linker:devStyles',
    'sails-linker:devTpl',
    'sails-linker:devJsJADE',
    'sails-linker:devStylesJADE',
    'sails-linker:devTplJADE'
  ]);


  // Build the assets into a web accessible folder.
  // (handy for phone gap apps, chrome extensions, etc.)
  grunt.registerTask('build', [
    'compileAssets',
    'linkAssets',
    'clean:build',
    'copy:build'
  ]);

  // When sails is lifted in production
  grunt.registerTask('prod', [
    'clean:dev',
    'jst:dev',
    'sass:dev',
    'copy:dev',
    'coffee:dev',
    'concat',
    'uglify',
    'cssmin',
    'sails-linker:prodJs',
    'sails-linker:prodStyles',
    'sails-linker:devTpl',
    'sails-linker:prodJsJADE',
    'sails-linker:prodStylesJADE',
    'sails-linker:devTplJADE'
  ]);

  grunt.registerTask('scrape', 'Scrapes recent race results from web\n' +
        '":from_file" parses races from tasks/scraper/races.json\n' +
        '":cp" (with from_file) parses club points races from tasks/scraper/data/clubPointsRaces.json\n' +
        '":max_results=n" sets max results to n\n' +
        '":mail" send email notifications',
        function (arg1, arg2, arg3, arg4) {
    var args = [arg1, arg2, arg3, arg4].join(',');
    var quietReporter = require('./' + path.join(SCRAPER_DIR, 'quietMochaReporter')).quietReporter;

    if (args.indexOf('from_file') !== -1) {
      var fileName = 'races.json';
      if (args.indexOf('cp') !== -1) {
        fileName = 'clubPointsRaces.json';
      } 
      var file = fs.readFileSync(path.join(SCRAPER_DATA_DIR, fileName));
      process.env.RACES = file;
    }

    if (args.indexOf('max_results') !== -1) {
      var maxResults = args.match(/max_results=([0-9]+)(,|$)/)[1];
      process.env.MAX_RESULTS = maxResults;
    }

    if (args.indexOf('mail') === -1) {
      process.env.NO_MAIL = true;
    }

    var done = this.async();
    var mocha = new Mocha({
      reporter: quietReporter,
      timeout: 99999999,
      bail: true
    });
    mocha.addFile(path.join(SCRAPER_DIR, 'scraper.js'));
    mocha.run(function (failures) {
      done();
    });
  });

  grunt.registerTask('test', "Runs all tests", function () {
    var mocha = new Mocha({
      require: path.join(TEST_DIR, 'common'),
      reporter: 'spec'
    });
    wrench.readdirSyncRecursive(TEST_DIR).filter(function (file) {
      return file.substr(-3) === '.js';
    }).forEach(function (file) {
      mocha.addFile(path.join(TEST_DIR, file));
    });
    var done = this.async();
    mocha.run(function (failures) {
      done();
    });
  });

  // When API files are changed:
  // grunt.event.on('watch', function(action, filepath) {
  //   grunt.log.writeln(filepath + ' has ' + action);

  //   // Send a request to a development-only endpoint on the server
  //   // which will reuptake the file that was changed.
  //   var baseurl = grunt.option('baseurl');
  //   var gruntSignalRoute = grunt.option('signalpath');
  //   var url = baseurl + gruntSignalRoute + '?action=' + action + '&filepath=' + filepath;

  //   require('http').get(url)
  //   .on('error', function(e) {
  //     console.error(filepath + ' has ' + action + ', but could not signal the Sails.js server: ' + e.message);
  //   });
  // });
};

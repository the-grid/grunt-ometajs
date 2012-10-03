(function() {

  module.exports = function(grunt) {
    "use strict";

    var compileOmeta;
    grunt.util = grunt.util || grunt.utils;
    compileOmeta = function(srcFile, options) {
      var srcCode;
      srcCode = grunt.file.read(srcFile);
      try {
        return require('ometajs').translateCode(srcCode);
      } catch (e) {
        grunt.log.error(e);
        return grunt.fail.warn('Ometajs failed to compile.');
      }
    };
    return grunt.registerMultiTask('ometa', 'Compile Ometa Files.', function() {
      var helpers, options, path;
      path = require('path');
      helpers = require('grunt-contrib-lib').init(grunt);
      options = helpers.options(this, {
        bare: false,
        basePath: false,
        flatten: false
      });
      this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);
      return this.files.forEach(function(file) {
        var srcFiles, taskOutput;
        file.dest = path.normalize(file.dest);
        srcFiles = grunt.file.expandFiles(file.src);
        if (srcFiles.length === 0) {
          grunt.log.writeln('Unable to compile; no valid source files were found.');
          return;
        }
        taskOutput = [];
        return srcFiles.forEach(function(srcFile) {
          var basePath, newFileDest, srcCompiled;
          srcCompiled = compileOmeta(srcFile);
          if (helpers.isIndividualDest(file.dest)) {
            basePath = helpers.findBasePath(srcFiles, options.basePath);
            newFileDest = helpers.buildIndividualDest(file.dest, srcFile, basePath, options.flatten);
            grunt.file.write(newFileDest, srcCompiled || '');
            grunt.log.writeln('File ' + newFileDest.cyan + ' created.');
          } else {
            taskOutput.push(srcCompiled);
          }
          if (taskOutput.length > 0) {
            grunt.file.write(file.dest, taskOutput.join('\n') || '');
            return grunt.log.writeln('File ' + file.dest.cyan + ' created.');
          }
        });
      });
    });
  };

}).call(this);

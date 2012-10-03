module.exports = (grunt) ->
  "use strict"

  # TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util or grunt.utils
  
  # Ometa Compile Helper
  compileOmeta = (srcFile, options) ->
    
    srcCode = grunt.file.read(srcFile)
    
    try
      return require('ometajs').translateCode srcCode

    catch e
      grunt.log.error(e)
      grunt.fail.warn('Ometajs failed to compile.')
  
  # Ometa grunt task
  grunt.registerMultiTask 'ometa', 'Compile Ometa Files.', () ->
    path = require('path')
    
    helpers = require('grunt-contrib-lib').init(grunt)
    
    options = helpers.options this, {
      bare: false,
      basePath: false,
      flatten: false
    }
    
    # TODO: ditch this when grunt v0.4 is released
    @files = @files or helpers.normalizeMultiTaskFiles(@data, @target)
    
    @files.forEach (file) ->
      file.dest = path.normalize file.dest
      srcFiles  = grunt.file.expandFiles file.src

      if srcFiles.length is 0 
        grunt.log.writeln('Unable to compile; no valid source files were found.')
        return
      
      taskOutput = []

      srcFiles.forEach (srcFile) ->
        srcCompiled = compileOmeta(srcFile)

        if helpers.isIndividualDest(file.dest)
          basePath = helpers.findBasePath(srcFiles, options.basePath)
          
          newFileDest = helpers.buildIndividualDest(file.dest, srcFile, basePath, options.flatten)

          grunt.file.write(newFileDest, srcCompiled or '')
          grunt.log.writeln('File ' + newFileDest.cyan + ' created.')
        
        else 
          taskOutput.push(srcCompiled)

        if taskOutput.length > 0
          grunt.file.write(file.dest, taskOutput.join('\n') or '')
          grunt.log.writeln('File ' + file.dest.cyan + ' created.')
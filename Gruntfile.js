
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // CONFIG ===================================/
    watch: {
      compass: {
        files: ['app/sass/**/*.{scss,sass}'],
        tasks: ['compass:dev']
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: ['app/sass'],
          cssDir: ['app/stylesheets'],
          environment: 'development'
        }
      },
      prod: {
        options: {
          sassDir: ['sass'],
          cssDir: ['css'],
          environment: 'production'
        }
      }
    }
  });
  // DEPENDENT PLUGINS =========================/

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // TASKS =====================================/

  grunt.registerTask('default', [
    'compass:dev',
    'watch'
  ]);

};

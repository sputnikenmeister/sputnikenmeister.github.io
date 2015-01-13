/*global module*/
module.exports = function (grunt) {
	"use strict";

	// grunt.initConfig({});
	grunt.config("pkg", grunt.file.readJSON("package.json"));
	
	grunt.loadNpmTasks("grunt-http");
	grunt.config("http", {
		index: {
			options: { url: 'http://folio.localhost/' },
			dest: 'index.html'
		},
		styles: {
			options: { url: 'http://folio.localhost/workspace/assets/css/folio.css' },
			dest: 'workspace/assets/css/folio.css'
		},
		data: {
			options: { url: 'http://folio.localhost/json' },
			dest: 'workspace/assets/js/folio-data.js'
		},
		vendor: {
			options: { url: 'http://folio.localhost/workspace/assets/js/folio-vendor.js' },
			dest: 'workspace/assets/js/folio-vendor.js'
		},
		client: {
			options: { url: 'http://folio.localhost/workspace/assets/js/folio-client.js' },
			dest: 'workspace/assets/js/folio-client.js'
		},
	});
	
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.config("string-replace", {
		"data-url": {
			files: {
				'./': ['index.html']
			},
			options: {
				replacements: [{
					pattern: /http:\/\/folio.localhost\/json/,
					replacement: '/workspace/assets/js/folio-data.js'
				}]
			}
		},
		"root-url": {
			files: {
				'./': ['index.html','workspace/assets/css/folio.css','workspace/assets/js/folio-data.js']
			},
			options: {
				replacements: [{
					pattern: /http:\/\/folio.localhost\//g,
					replacement: '/'
				}]
			}
		}
	});
	
	grunt.registerTask("http-folio-get", ["http:index", "http:styles"]);
	grunt.registerTask("build", ["http", "string-replace"]);
	grunt.registerTask("default", ["build"]);
};

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
		// vendor: {
		// 	options: { url: 'http://folio.localhost/workspace/assets/js/folio-vendor.js' },
		// 	dest: 'build/folio-vendor.js'
		// },
		// client: {
		// 	options: { url: 'http://folio.localhost/workspace/assets/js/folio-client.js' },
		// 	dest: 'build/folio-client.js'
		// },
	});
	
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.config("string-replace", {
		"root-url": {
			files: {
				'./': ['index.html','workspace/assets/css/folio.css']
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
	grunt.registerTask("build", ["http", "string-replace:root-url"]);
	grunt.registerTask("default", ["build"]);
};

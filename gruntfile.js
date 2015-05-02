/*global module*/
module.exports = function (grunt) {
	"use strict";

	// grunt.initConfig({});
	grunt.config("pkg", grunt.file.readJSON("package.json"));

	grunt.config("srcRoot", "http://krupp.local/projects/folio-sym");
	grunt.config("srcAssets", "workspace/assets");
	grunt.config("destAssets", "workspace/assets");

	grunt.loadNpmTasks("grunt-http");
	grunt.config("http", {
		options: {
			ignoreErrors: true
		},
		index: {
			options: { url: "<%= srcRoot %>/" },
			dest: "index.xhtml"
		},
		styles: {
			options: { url: "<%= srcRoot %>/<%= srcAssets %>/css/folio.css" },
			dest: "<%= destAssets %>/css/folio.css"
		},
		fonts: {
			options: { url: "<%= srcRoot %>/<%= srcAssets %>/css/fonts.css" },
			dest: "<%= destAssets %>/css/fonts.css"
		},
//		"js-vendor": {
//			options: { url: "<%= srcRoot %>/<%= srcAssets %>/js/folio-vendor.js" },
//			dest: "<%= destAssets %>/js/folio-vendor.js"
//		},
//		"js-client": {
//			options: { url: "<%= srcRoot %>/<%= srcAssets %>/js/folio-client.js" },
//			dest: "<%= destAssets %>/js/folio-client.js"
//		},
		"js-dist": {
			options: { url: "<%= srcRoot %>/<%= srcAssets %>/js/folio.js" },
			dest: "<%= destAssets %>/js/folio.js"
		}
	});

	grunt.loadNpmTasks("grunt-string-replace");
	grunt.config("string-replace", {
//		"data-url": {
//			files: {
//				"./": ["index.xhtml"]
//			},
//			options: {
//				replacements: [{
//					pattern: /http:\/\/folio.localhost\/json/,
//					replacement: "<%= destAssets %>/js/folio-data.js"
//				}]
//			}
//		},
		"root-urls": {
			files: {
				"./": ["index.xhtml",
					   "<%= destAssets %>/css/*.css",
					   "<%= destAssets %>/js/*.js"]
			},
			options: {
				replacements: [
//					{
//						pattern: "<%= srcAssets %>",
//						replacement: "<%= destAssets %>"
//					},
					{
						// pattern: /https?:\/\/[^\/\"\']+/g,
						pattern: "<%= srcRoot %>",
						// pattern: /https?:\/\/folio\.(local\.|localhost)/g,
						replacement: "."
					}
				]
			}
		}
	});

	grunt.registerTask("build", ["http", "string-replace"]);
	grunt.registerTask("default", ["build"]);
};

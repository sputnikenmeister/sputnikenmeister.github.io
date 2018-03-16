/*global module*/
module.exports = function(grunt) {
	"use strict";

	grunt.config("pkg", grunt.file.readJSON("package.json"));

	grunt.config("paths", {
		"srcRoot": "http://localhost/projects/folio-sym",
		"srcAssets": "workspace/assets",
		"destAssets": "workspace/assets",
	});

	// grunt.loadNpmTasks('grunt-git');
	// grunt.config("gitcommit")

	grunt.loadNpmTasks("grunt-http");
	grunt.config("http", {
		options: {
			ignoreErrors: true
		},
		index: {
			options: { url: "<%= paths.srcRoot %>/" },
			dest: "index.html"
		},
		styles: {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/css/folio.css" },
			dest: "<%= paths.destAssets %>/css/folio.css"
		},
		fonts: {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/css/fonts.css" },
			dest: "<%= paths.destAssets %>/css/fonts.css"
		},
		"scripts-dist": {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/js/folio.js" },
			dest: "<%= paths.destAssets %>/js/folio.js"
		},
		// "scripts-vendor": {
		// 	options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/js/folio-vendor.js" },
		// 	dest: "<%= paths.destAssets %>/js/folio-vendor.js"
		// },
		// "scripts-client": {
		// 	options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/js/folio-client.js" },
		// 	dest: "<%= paths.destAssets %>/js/folio-client.js"
		// },
	});

	function toPattern(s) {
		s = grunt.template.process(s, grunt.config());
		s = s.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		return new RegExp(s, "g");
	}
	grunt.loadNpmTasks("grunt-string-replace");
	grunt.config("string-replace", {
		"http-root": {
			files: {
				"./": [
					"index.html",
					"<%= paths.destAssets %>/css/*.css",
					"<%= paths.destAssets %>/js/*.js"
				]
			},
			options: {
				replacements: [
					// { pattern: "<%= paths.srcAssets %>", replacement: "<%= paths.destAssets %>"},
					// { pattern: /https?:\/\/[^\/\"\']+/g}, replacement: "./" },
					// { pattern: /https?:\/\/folio\.(local\.|localhost)/g}, replacement: "./" },
					{ pattern: toPattern("<%= paths.srcRoot %>/"), replacement: "./" },
				]
			}
		}
	});

	grunt.registerTask("build", ["http", "string-replace:http-root"]);
	grunt.registerTask("default", ["build"]);
};

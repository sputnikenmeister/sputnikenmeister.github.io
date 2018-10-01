/*global module*/
module.exports = function(grunt) {
	"use strict";

	grunt.config("pkg", grunt.file.readJSON("package.json"));
	grunt.config("properties", grunt.file.readJSON("properties.json"));
	grunt.config("CNAME", grunt.file.read("CNAME", { encoding: 'utf8' }));

	grunt.config("paths", {
		"destAssets": "workspace/assets",
		"srcAssets": "workspace/assets",
		"destRoot": "",
		"srcRoot": "http://localhost/projects/folio-sym",
		"fontFiles": "{eot,otf,svg,ttf,woff,woff2}",
		"mediaFiles": "{ico,gif,jpg,jpeg,mp4,png,svg,webp,webm}",
	});

	/* --------------------------------
	/* clean:resources
	/* -------------------------------- */

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.config("clean", {
		resources: {
			src: [
				"workspace/assets/fonts",
				"workspace/assets/images"
			]
		},
		uploads: {
			src: [
				"workspace/uploads"
			]
		},
	});

	/* --------------------------------
	 * copy:resources
	 * -------------------------------- */

	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.config("copy", {
		resources: {
			files: [{
				expand: true,
				dest: "workspace/assets/",
				cwd: "node_modules/@folio/workspace-assets/",
				src: [
					"fonts/**/*.<%= paths.fontFiles %>",
					"images/*.<%= paths.mediaFiles %>",
					"images/{mockup,favicons/black,symbols}/*.<%= paths.mediaFiles %>",
				]
			}]
		},
		uploads: {
			files: [{
				expand: true,
				dest: "workspace/uploads/",
				cwd: "node_modules/@folio/workspace-uploads/",
				src: "*.<%= paths.mediaFiles %>"
			}]
		},
	});

	/* --------------------------------
	 * grunt-http
	 * -------------------------------- */

	grunt.loadNpmTasks("grunt-http");
	grunt.config("http", {
		options: {
			ignoreErrors: true
		},
		"index": {
			options: { url: "<%= paths.srcRoot %>/?force-nodebug=yes" },
			dest: "index.html"
		},
		// "data-json": {
		// 	options: { url: "<%= paths.srcRoot %>/json" },
		// 	dest: "<%= paths.destAssets %>/js/data.json"
		// },
		// "data-jsonp": {
		// 	options: { url: "<%= paths.srcRoot %>/json?callback=bootstrap" },
		// 	dest: "<%= paths.destAssets %>/js/data.js"
		// },
		"scripts": {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/js/folio.js" },
			dest: "<%= paths.destAssets %>/js/folio.js"
		},
		"scripts-map": {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/js/folio.js.map" },
			dest: "<%= paths.destAssets %>/js/folio.js.map"
		},
		"styles": {
			options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/css/folio.css" },
			dest: "<%= paths.destAssets %>/css/folio.css"
		},
		// "fonts": {
		// 	options: { url: "<%= paths.srcRoot %>/<%= paths.srcAssets %>/css/fonts.css" },
		// 	dest: "<%= paths.destAssets %>/css/fonts.css"
		// },
	});

	/* --------------------------------
	 * copy/process
	 * -------------------------------- */

	var toPattern = function(s) {
		s = grunt.template.process(s, grunt.config());
		s = s.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		s += "\\/?";
		grunt.log.writeln("RegExp: /" + s + "/g");
		return new RegExp(s, "g");
	};

	grunt.loadNpmTasks("grunt-string-replace");
	grunt.config("string-replace", {
		"http-root": {
			files: {
				"./": [
					"index.html",
					"<%= paths.destAssets %>/css/*",
					"<%= paths.destAssets %>/js/*"
				]
			},
			options: {
				replacements: [
					{
						pattern: toPattern("<%= paths.srcRoot %>"),
						replacement: "<%= paths.destRoot %>"
					},
					{
						pattern: "UA-0000000-0",
						replacement: "<%= properties.ga.id %>"
					},
				]
			}
		}
	});

	/* --------------------------------
	 * minify html
	 * -------------------------------- */

	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.config("htmlmin", {
		main: {
			options: {
				minifyCSS: true,
				minifyJS: true,
				removeComments: true,
				collapseWhitespace: true,
				// collapseInlineTagWhitespace: true,
				preserveLineBreaks: true,
				keepClosingSlash: true,
			},
			files: {
				'index.html': 'index.html',
			}
		},
	});

	grunt.registerTask("build", ["clean", "copy", "http", "string-replace:http-root"]);
	grunt.registerTask("default", ["build"]);
};

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
		scripts: {
			src: [
				"workspace/assets/js",
				"workspace/assets/css"
			]
		},
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
					"images/{mockup,symbols,favicons/black}/*.<%= paths.mediaFiles %>",
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
	grunt.config("http", [
		"css/folio.css",
		"css/folio.css.map",
		"js/folio.js",
		"js/folio.js.map"
		].reduce((o, s, i, a) => {
		o[s.replace(/[\/\.]/g, "-")] = {
			options: { url: `<%= paths.srcRoot %>/<%= paths.srcAssets %>/${s}` },
			dest: `<%= paths.destAssets %>/${s}`
		};
		return o;
	}, {
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
	}));

	grunt.registerTask("http-assets",
		Object.keys(grunt.config("http"))
		.filter(key => key !== "options")
		.map(key => `http:${key}`)
	);

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

	grunt.registerTask("build", ["clean:resources", "clean:scripts", "copy", "http-assets", "http:index", "string-replace", "htmlmin"]);
	grunt.registerTask("default", ["build"]);
};

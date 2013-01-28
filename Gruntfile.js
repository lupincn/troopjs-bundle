	/*global module:false*/
module.exports = function(grunt) {

	grunt.loadNpmTasks("grunt-contrib");
	grunt.loadNpmTasks("grunt-buster");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-git-describe");
	grunt.loadNpmTasks("grunt-github-upload");
	grunt.loadNpmTasks("grunt-lexicon");

	grunt.registerTask("lint", ["jshint"]);
	grunt.registerTask("test", ["lint", "buster"]);
	grunt.registerTask("dist", ["describe", "requirejs", "concat", "min"]);
	grunt.registerTask("default", ["test", "clean", "dist"]);

	grunt.config.init({
		meta : {
			version : "SNAPSHOT",
			banner : "/*!\n" +
				"* TroopJS Bundle - <%= meta.version %>\n" +
				"* http://troopjs.com/\n" +
				"* Copyright (c) <%= grunt.template.today('yyyy') %> " + "Mikael Karon <mikael@karon.se>\n" +
				"* Licensed MIT\n" +
				"*/",
			dist : {
				max : "dist/troopjs-bundle.js",
				min : "dist/troopjs-bundle.min.js"
			},
			auth : "<json:auth.json>"
		},
		clean : "<config:meta.dist>",
		jshint: {
			src: ["Gruntfile.js", "src/lib/troopjs-*/src/**/*.js"]
		},
		requirejs : {
			dist : {
				options : {
					out : "<config:meta.dist.max>",
					baseUrl : "src/lib",
					"packages" : [{
						"name" : "jquery",
						"location" : "empty:"
					}, {
						"name" : "compose",
						"location" : "compose",
						"main" : "compose"
					}, {
						"name" : "when",
						"location" : "when",
						"main" : "when"
					}, {
						"name" : "poly",
						"location" : "poly",
						"main" : "poly"
					}, {
						"name" : "troopjs-core",
						"location" : "troopjs-core/src"
					}, {
						"name" : "troopjs-data",
						"location" : "troopjs-data/src"
					}, {
						"name" : "troopjs-browser",
						"location" : "troopjs-browser/src"
					}, {
						"name" : "troopjs-jquery",
						"location" : "troopjs-jquery/src"
					}, {
						"name" : "troopjs-requirejs",
						"location" : "troopjs-requirejs/src"
					}, {
						"name" : "troopjs-utils",
						"location" : "troopjs-utils/src"
					}],
					include : grunt.file.expand({filter:"src/lib/troopjs-*/src/**/*.js"}, 'isFile').map(function (file) {
						return file.replace(/.*\/(troopjs-\w+)\/src\/(.+)\.js$/, "$1/$2");
					}),
					optimize : "none"
				}
			}
		},
		concat : {
			dist : {
				src : [ "<banner>", "<config:requirejs.dist.options.out>" ],
				dest : "<config:meta.dist.max>"
			}
		},
		min : {
			dist : {
				src : [ "<banner>", "<config:concat.dist.dest>" ],
				dest : "<config:meta.dist.min>"
			}
		},
		upload : {
			"troopjs-bundle.js" : {
				repo : "troopjs/troopjs-bundle",
				auth : "<%= [ meta.auth.username, meta.auth.password ].join(':') %>",
				file : "<config:meta.dist.max>",
				description : "TroopJS bundle - <%= meta.version %>"
			},
			"troopjs-bundle.min.js" : {
				repo : "troopjs/troopjs-bundle",
				auth : "<%= [ meta.auth.username, meta.auth.password ].join(':') %>",
				file : "<config:meta.dist.min>",
				description : "TroopJS bundle - <%= meta.version %> (minified)"
			}
		},
		lexicon: {
			all: {
				src: [
					"src/lib/composejs/compose.js",
					"src/lib/troopjs-*/src/**/*.js"
				],
				dest: "docs",
				options: {
					format: "html"
				}
			}
		}
	});
};
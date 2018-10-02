module.exports = {
	"extends": "eslint:recommended",
	"root": true,
	"overrides": [{
		"files": [
			"gruntfile.js"
		],
		"env": {
			"node": true,
			"es6": true
		},
	}],
	"rules": {
		"no-cond-assign": "off",
		"no-console": "off",
		"no-empty": "warn",
		"no-fallthrough": "off", // allow fallthrough in switch
		"no-delete-var": "warn",
		"no-unused-vars": ["warn", { "args": "none" }],
		"no-useless-escape": "off",
	}
};

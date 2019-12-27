module.exports = {
	presets: [
		'@babel/env',
		'@babel/react',
	],
	plugins: ['@babel/transform-runtime', ["istanbul", {
		"include": [
			"src/components/**/**.js"
		],
		"exclude": [
			"**/mocks/**"
		]
	}]]
};

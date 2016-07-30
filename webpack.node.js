const webpack = require('webpack');
const path = require('path');

module.exports = {
	devtool: 'hidden-source-map',
	context: path.join(__dirname, './source'),
	entry: {
		node: [
			'index'
		]
	},
	output: {
		path: path.join(__dirname, 'distribution'),
		filename: 'index.js',
		libraryTarget: 'commonjs2'
	},
	externals: {
		'lodash': 'lodash',
		'immutable': 'immutable',
		'tracery-grammar': 'tracery-grammar'
	},
	module: {
		loaders: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				loaders: [
					{
						loader: 'babel',
						query: {
							cacheDirectory: true,
							presets: ['es2015'],
							plugins: ['add-module-exports']
						},
						
					}
				],

			},
			{
				test: /\.json$/,
				loaders: [
					'json'
				]
			},
		],
	},
	resolve: {
		extensions: ['', '.js'],
		modules: [
			path.resolve('./source'),
			'node_modules'
		]
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		})
	]
}
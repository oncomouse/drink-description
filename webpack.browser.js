const webpack = require('webpack');
const path = require('path');
module.exports = {
	devtool: 'hidden-source-map',
	context: path.join(__dirname, './source'),
	entry: {
		browser: [
			'index'
		]
	},
	output: {
		path: path.join(__dirname, 'browser'),
		filename: 'drink-description.min.js',
		library: 'drinkDescription',
		libraryTarget: 'umd'
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
							presets: ['es2015-native-modules'],
							plugins: ['transform-runtime']
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
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			output: {
				comments: false
			},
			sourceMap: false
		})
	]
}
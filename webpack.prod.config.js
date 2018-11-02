const webpack = require('webpack');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcssPlugins = require('./postcss.prod.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

require('pretty-error').start();

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const developmentPath = path.resolve(__dirname, 'public', 'development');
const productionPath = path.resolve(__dirname, 'public', 'production');
const mainJSPath = path.resolve(__dirname, 'public', 'development', 'main.js');

module.exports = {
	entry: [mainJSPath],
	output: {
		path: productionPath,
		publicPath: './',
		filename: 'bundle.js'
	},
	stats: {
		children: false
	},
	module: {
		rules: [
			{
				test: /\.(ttf|otf|eot|woff|woff2)$/,
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]'
				},
				exclude: [nodeModulesPath]
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				loaders: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[ext]'
						}
					}
				],
				exclude: [nodeModulesPath]
			},
			{
				test: /\.svg$/,
				loader: 'svg-sprite-loader'
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				exclude: [nodeModulesPath]
			},
			{
				test: /(\.scss|\.pcss|\.css)$/,
				use: [
					{
						loader: 'vue-style-loader'
					},
					'css-loader',
					'sass-loader',
					{
						loader: 'postcss-loader',
						options: {
							syntax: 'postcss-scss',
							map: false,
							plugins: postcssPlugins
						}
					},
					{
						loader: 'sass-resources-loader',
						options: {
							resources: [`${developmentPath}/assets/notcss/_utils/_all-utils.scss`]
						}
					}
				],
				exclude: [nodeModulesPath]
			},
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader'
				},
				exclude: [nodeModulesPath]
			}
		]
	},
	mode: 'production',
	plugins: [
		new HtmlWebpackPlugin({
			template: 'views/index-prod.html',
			inject: false,
			filename: 'index.html'
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			quiet: true
		}),
		new VueLoaderPlugin(),
		new BundleAnalyzerPlugin()
	],
	resolve: {
		alias: {
			vue$: 'vue/dist/vue.esm.js',
			$images: path.resolve(__dirname, 'public/development/assets/images'),
			$icons: path.resolve(__dirname, 'public/development/components/icons'),
			$notcss: path.resolve(__dirname, 'public/development/assets/notcss'),
			$components: path.resolve(__dirname, 'public/development/components'),
			$store: path.resolve(__dirname, 'public/development/store'),
			$services: path.resolve(__dirname, 'public/development/services'),
			$root: path.resolve(__dirname, 'public/development/')
		}
	},
	optimization: {
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			maxSize: 0,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~',
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		}
	}
};

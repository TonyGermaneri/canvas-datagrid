const path = require('path');
const webpack = require('webpack');

const productionConfig = {
  mode: 'production',
  
  entry: './lib/main.js',

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" }
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'canvasDatagrid',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: 'canvas-datagrid.js'
  },

};

const productionModuleConfig = {
	...productionConfig,

	plugins: [
		new webpack.ProvidePlugin({
			'window.canvasDatagrid':[path.resolve(path.join(__dirname, 'esFill.js')),'exports','canvasDatagrid'],
			'window.customElements.define':[path.resolve(path.join(__dirname, 'esFill.js')),'exports','define'],
			'window.customElements':[path.resolve(path.join(__dirname, 'esFill.js')),'exports','customElements']
		}),
	],
	devtool: 'source-map',
	module: {
	  rules: [
		/* { test: /\.js$/, exclude: /node_modules/,type: 'javascript/esm', use: [{
			loader:"babel-loader",
			options: {
				presets: [['@babel/preset-env',{
					modules:false,
					bugfixes: true,
					spec: true,
					useBuiltIns: 'usage',
					corejs: 3,
					targets: {
						esmodules: true
					}
				}]]
			}
		}]} */
	  ]
	},
	experiments: {outputModule: true},
	target: 'es6',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'canvas-datagrid.module.js',
		sourceMapFilename: 'canvas-datagrid.module.map'
	}
}

const developmentConfig = {
  ...productionConfig,
  
  mode: 'development',
  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'canvasDatagrid',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: 'canvas-datagrid.debug.js',
    sourceMapFilename: 'canvas-datagrid.debug.map'
  },
};

module.exports = [productionConfig, developmentConfig, productionModuleConfig];

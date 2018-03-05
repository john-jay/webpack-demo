const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: "[name].css",
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: {
    output: './src/index.js',
    jOutput: './src/jIndex.js'
  },
  output: {
    path: path.resolve(__dirname, './public'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.css', '.jpeg', '.jpg', '.gif', '.png'],
    alias: {
      images: path.resolve(__dirname, 'src/assets/images')
    }
  },
  module: {
    rules: [{ // loader rules
        test: /\.jsx?$/, // files ending with .js or .jsx
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/, // files ending with .scss
        use: ['css-hot-loader'].concat(extractSass.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader', 'postcss-loader'],
        })),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i, // Image Loader
        loaders: ['file-loader?context=src/assets/images/&name=images/[path][name].[ext]', {
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 4,
            },
            pngquant: {
              quality: '75-90',
              speed: 3,
            },
          },
        }],
        exclude: /node_modules/,
        include: __dirname,
      },
    ]
  },
  plugins: [
    extractSass,
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    historyApiFallback: true,
    inline: true,
    open: true
  },
  devtool: 'eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeCSSAssets()
  )
}
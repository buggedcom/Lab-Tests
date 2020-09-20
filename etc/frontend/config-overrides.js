const rewireReactHotLoader = require('react-app-rewire-hot-loader');

module.exports = function override(config, env) {
    config = rewireReactHotLoader(config, env);

    config.module.rules.push({
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'url-loader', // file-loader for production
    });

    config.externals = {
        'cheerio': 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
    };

    return config;
}
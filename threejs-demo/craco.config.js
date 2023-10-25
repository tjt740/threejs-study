module.exports = {
    plugins: [
        {
            plugin: require('craco-cesium')(),
        },
        {
            plugin: require('craco-wasm')(),
        },
    ],
};

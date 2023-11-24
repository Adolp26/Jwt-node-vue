const path = require('path');

module.exports = {
    // ... outras configurações ...

    resolve: {
        fallback: {
            //"buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            //"stream": require.resolve("stream-browserify"),
            //S"util": require.resolve("util/")
        }
    }
};

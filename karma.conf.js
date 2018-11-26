var configuration = {
    frameworks: ["jasmine", "karma-typescript"],

    files: [
        'ngx-csv.spec.ts',
        'ngx-csv.ts'
    ],

    preprocessors: {
        "**/*.ts": ["karma-typescript"]
    },

    reporters: ["progress", "karma-typescript"],
    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },
    browsers: ["Chrome"]
};

if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
}


module.exports = function (config) {
    config.set(configuration);
};



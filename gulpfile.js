const { src, dest, series, watch } = require(`gulp`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    CSSLinter = require(`gulp-stylelint`),
    htmlCompressor = require(`gulp-htmlmin`),
    jsCompressor = require(`gulp-uglify`),
    babel = require(`gulp-babel`),
    sass = require(`gulp-sass`)(require(`sass`)),
    htmlValidator = require(`gulp-html`),
    reload = browserSync.reload;

let browserChoice = `default`;



//Dev Track
let lintCSS = () => {
    return src(`dev/css/*.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
};

let compileCSSForDev = () => {
    return src(`dev/css/*.css`)
        .pipe(sass.sync({
            outputStyle: `expanded`,
            precision: 10
        }).on(`error`, sass.logError))
        .pipe(dest(`temp/styles`));
};

let validateHTML = () => {
    return src([`dev/html/index.html`])
        .pipe(htmlValidator(undefined));
};

let lintJS = () => {
    return src(`dev/js/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach(`compact`));
};

let transpileJSForDev = () => {
    return src(`dev/js/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/scripts`));
};


async function allBrowsers () {
    browserChoice = [
        `brave browser`,
        `google chrome`,
        `microsoft edge`, // Note: In Windows, this might need to be microsoft-edge
        `firefox`,
        `opera`,
        `safari`,
        `vivaldi`
    ];
}

//prod track
let compileCSSForProd = () => {
    return src(`styles/main.css`)
        .pipe(sass.sync({
            outputStyle: `compressed`,
            precision: 10
        }).on(`error`, sass.logError))
        .pipe(dest(`prod/styles`));
};

let transpileJSForProd = () => {
    return src(`scripts/main.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/scripts`));
};

let compressHTML = () => {
    return src([`index.html`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `./`,
                `dev`,
                `dev/html`
            ]
        }
    });

    watch(`dev/js/*.js`, series(lintJS, transpileJSForDev))
        .on(`change`, reload);

    watch(`dev/css/*.css`, compileCSSForDev)
        .on(`change`, reload);

    watch(`dev/html/index.html`, validateHTML)
        .on(`change`, reload);

};

exports.validateHTML = validateHTML;
exports.lintJS = lintJS;
exports.lintCSS = lintCSS;
exports.compileCSSForDev = compileCSSForDev;
exports.compileCSSForProd = compileCSSForProd;
exports.transpileJSForProd = transpileJSForProd;
exports.compressHTML = compressHTML;


exports.allBrowsers = series(allBrowsers, serve);
exports.serve = series(
    validateHTML,
    compileCSSForDev,
    lintJS,
    transpileJSForDev,
    serve
);

exports.build = series(
    compressHTML,
    compileCSSForProd,
    transpileJSForProd
);

const scanInvChars = require('./index');

/* New report */
const report = scanInvChars({
    path: __dirname,
    filter: () => true,
    verbose: false
});

/* Check */
try {
    if (
        report.length &&
        report.filter(({ file }) => file.indexOf('.git') < 0).length === 1
    ) {
        console.log('SUCCESS');
    } else {
        console.log('FAILED');
    }
} catch (e) {
    console.log('FAILED');
}

import fs from "fs";
import path from "path";
import { expect, assert } from "chai";
import gm from "gm";

const gmClass = gm.subClass({ imageMagick: false });

const compareScreenshot = async (goldenPath, page) => {
    const scriptDirectory = path.dirname(goldenPath) + '/';

    const testTempPath = scriptDirectory + path.basename(goldenPath, '.png') + '~actual.png';
    await page.screenshot({path: testTempPath});

    try {
        const testFailDiffPath = scriptDirectory + path.basename(goldenPath, '.png') + '~diff.png';
        return new Promise((resolve) => {
            gmClass().compare(
                testTempPath,
                goldenPath,
                {
                    tolerance: 0.00003,
                    file: testFailDiffPath,
                },
                function(err, isEqual, equality) {
                    if(isEqual === true) {
                        fs.unlink(testTempPath, ()=>{}); // doesn't need to be sync
                        fs.unlink(testFailDiffPath, ()=>{}); // doesn't need to be sync
                    }

                    expect(isEqual, `The screenshot has differences. Check "${testTempPath}" and "${testFailDiffPath}" for more details.`).is.true;

                    resolve();
                }
            );
        });
    } catch(e) {
        console.log(e);
        if(fs.existsSync(testTempPath) === true) {
            fs.unlink(testTempPath, ()=>{}); // doesn't need to be sync
        }
        assert.fail(e);
    }
};

export const testHtml = async (scriptDirectory, scriptName, page) => {
    const html = await page.content();

    const scriptBaseName = path.basename(scriptName, '.js');
    const htmlPath = `${scriptDirectory}/${scriptBaseName}.html`;

    // check if file exists, if it does not we assume that this is the
    // first run of the test and simply create the test html.
    const saving = fs.existsSync(htmlPath) === false
        ? 'new' : (process.argv.indexOf('--rebuild-html') > -1
        ? 'rebuild'
        : false);
    if(saving !== false) {
        fs.writeFileSync(htmlPath, html);
        if(saving === 'new') {
            console.log('    There was nothing to compare, html saved as default.');
        } else {
            console.log('    Rebuilding html as per --rebuild-html directive.');
        }
    } else {
        const result = html === fs.readFileSync(htmlPath, 'utf-8');
        if(!result) {
            const actualHtmlPath = `${scriptDirectory}/${scriptBaseName}~actual.html`;
            fs.writeFileSync(actualHtmlPath, html);
            throw new Error(`The html does not match the expected output. Compare "${htmlPath}" and "${actualHtmlPath}" for more details.`);
        }
    }
};

export const testBreakpointedScreenshots = async (scriptDirectory, scriptName, page, width, height) => {
    try {
        const testSizeName = `${width}x${height}`;
        const screenshotPath = `${scriptDirectory}/${testSizeName}.png`;

        const watchDog = page.waitForFunction(`window.innerWidth >= ${width}`);
        await page.setViewport({width: width, height: height});
        await watchDog;

        // we must allow for css transitions to complete between window resizes
        // and therefore have a pauseslightly more than any transition period
        await page.waitFor(350);

        // check if file exists, if it does not we assume that this is the
        // first run of the test and simply create the test png.
        const saving = fs.existsSync(screenshotPath) === false
            ? 'new' : (process.argv.indexOf('--rebuild-screenshots') > -1
            ? 'rebuild'
            : false);
        if(saving !== false) {
            await page.screenshot({path: screenshotPath});
            if(saving === 'new') {
                console.log('    There was nothing to compare, png saved as default.');
            } else {
                console.log('    Rebuilding html as per --rebuild-screenshots directive.');
            }
            return;
        }

        await compareScreenshot(screenshotPath, page);
    } catch(e) {
        assert.fail(e);
    }
};
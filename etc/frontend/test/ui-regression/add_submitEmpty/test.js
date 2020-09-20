import { expect, assert } from "chai";
import path from "path";
import Breakpoints from "../../../src/bootstrap/BreakPoints";
import { testPage } from "../chrome";
import { testBreakpointedScreenshots, testHtml } from "../helper";

const scriptName = path.basename(__filename);
const scriptDirectory = path.dirname(__filename);

describe('Screenshot /add submit empty', function() {

    let page;
    before(async function() {
        this.timeout(60000);

        page = await testPage();
        await page.click('#root > section > header > span > button._Button._Button--size-medium._Button--theme-secondary._Button--theme-secondary._Button--stripe._ButtonAction._ButtonAction--primary');
        await page.waitFor(1500);
        await page.click('body > div.ReactModalPortal > div > div > section > footer > div.buttons.buttons--right > button');
        await page.waitFor(100);
    });

    after(async function() {
        page.close();
    });

    it('html', function(done) {
        testHtml(scriptDirectory, scriptName, page)
            .then(done)
            .catch(e => {
                throw e;
            });
    }).timeout(30000);

    const height = 640;
    const sizes = Object.values(Breakpoints.defaults);
    sizes.forEach((width) => {
        it(`screenshot at ${width}x${height}`, function(done) {
            testBreakpointedScreenshots(scriptDirectory, scriptName, page, width, height).then(done);
        }).timeout(30000);
    });

});
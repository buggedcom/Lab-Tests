import puppeteer from "puppeteer";
import Breakpoints from "../../src/bootstrap/BreakPoints";
import fs from "fs";
import path from "path";

let chromeInstance = null;

export const chrome = async () => {
    if(chromeInstance === null) {
        chromeInstance = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
        });
    }
    return chromeInstance;
};

export const testPage = async () => {
    const testDir = path.dirname(__filename) + '/';
    fs.copyFileSync(testDir + 'laboratoryTests.json', '../data/testing/laboratoryTests.json');

    const initialWidth = Object.values(Breakpoints.defaults)[0];
    const browser = await chrome();
    const page = await browser.newPage();
    await page.goto('http://192.168.33.10' + (testServerPort === 80 ? '' : ':' + testServerPort) + '/', {"waitUntil" : "networkidle0"});
    const watchDog = page.waitForFunction(`window.innerWidth >= ${initialWidth}`);
    await page.setViewport({
        width: initialWidth,
        height: 640
    });
    await watchDog;
    await page.waitFor(100);
    return page;
};

export const killChrome = async () => {
    if(chromeInstance !== null) {
        await chromeInstance.close();
        chromeInstance = null;
    }
};

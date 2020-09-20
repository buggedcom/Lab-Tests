import Mocha from "mocha";
import glob from "glob";
import { JSDOM } from "jsdom";

console.log('> Setting up jsdom.');
const exposedProperties = ['window', 'navigator', 'document'];

const { document } = (new JSDOM('<!doctype html><html><body></body></html>', {url:'http://localhost/'})).window;
global.document = document;
global.window = document.defaultView;

Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});
global.navigator = {
    userAgent: 'node.js'
};

console.log('> Booting Mocha.');
// Instantiate a Mocha instance.
const mocha = new Mocha();

// check for specific tests
let suiteDirectory = '*';
const suiteIndex = process.argv.indexOf('suite');
if(suiteIndex >= 0) {
    suiteDirectory = process.argv[suiteIndex + 1];
}

console.log('> Finding test files.');
const testDir = './src/components/';
glob.sync(testDir + suiteDirectory + '/test.js')
    .forEach((file) => {
        console.log('  -- ' + file);
        mocha.addFile(file);
    });

console.log(`> Starting component tests`);
mocha.run(async (failures) => {
    return process.exitCode = failures ? 1 : 0;
});

import { chrome, killChrome } from "./chrome";
import shell from "shelljs";
import Mocha from "mocha";
import fs from "fs";
import glob from "glob";
import path from "path";
import "str-trim";

global.testServerPort = 80;

const continueBoot = () => {
    console.log('> Removing any previous ~actual and ~diff files.');
    const testDir = './test/ui-regression/';
    glob.sync(testDir + '*/*~*.*')
        .forEach((file) => {
            console.log('  -- ' + file);
            fs.unlink(file, () => {
            });
        });

    console.log('> Killing any existing open Chrome processes.');
    shell.exec('killall chrome', {silent:true});

    console.log('> Booting Chrome.');
    chrome().then(() => {
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
        glob.sync(testDir + suiteDirectory + '/test.js')
            .forEach((file) => {
                console.log('  -- ' + file);
                mocha.addFile(file);
            });

        const portIndex = process.argv.indexOf('port');
        if(portIndex >= 0) {
            global.testServerPort = process.argv[portIndex + 1];
        } else if(process.env.NODE_ENV === 'testing') {
            global.testServerPort = 8082;
        }

        console.log(`> Starting ui-regression tests (base=http://192.168.33.10:${testServerPort})`);
        mocha.run(async (failures) => {
            console.log('> Killing test server');
            shell.exec('kill $(ps aux | grep "node ./bin/www" | grep -v grep | awk \'{print $2}\')', {silent:true});

            console.log('> Killing all open Chrome instances.');
            await shell.exec('killall chrome', {silent:true});
            await killChrome();

            return process.exitCode = failures ? 1 : 0;
        });
    });

};

console.log('> Starting test server');

const runningProcesses = shell.exec('ps aux | grep "node ./bin/www" | grep -v grep | awk \'{print $2}\'', {silent:true}).stdout;
// if there are only 1/2 lines then it is just this grep running and therefore
// we must start the server now.
if(!runningProcesses) {
    const child = shell.exec('cd ../node/ && npm run start-test-server', {async:true, silent:true});
    child.stdout.on('data', function(data) {
        if(data.indexOf('App loaded in') !== -1) {
            console.log('  -- Server started');
            continueBoot();
        }
    });
} else {
    console.log(`  -- Server already running (pid=${runningProcess})`);
    continueBoot();
}
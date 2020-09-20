import express from "express";
import colors from "colors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import path from "path";
import indexRouter from "./routes/index";
import laboratoryTestsRouter from "./routes/1.0.0/laboratoryTests";
import devRouter from "./routes/development";
import paths from "./paths";
import errorhandler from "errorhandler";
import cors from "cors";
import helmet from "helmet";
import JsonPayloadError from "./classes/JsonPayloadError";
import beep from "beepbeep";

process.env.NODE_ENV = process.env.NODE_ENV || 'production'; // force production if no ENV is found to prevent accidental leakage.

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTesting = process.env.NODE_ENV === 'testing';

const app = express();

if (!isProduction) {
    app.use(errorhandler());
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(paths.ROOT, 'public')));

if(isTesting === false) {
    app.use(logger('dev'));
}

// force disable etags
if (!isProduction) {
    app.disable('etag');
    app.get(
        '/*',
        function(reqest, response, next) {
            response.set({
                'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 'Tue, 25 Mar 2003 05:00:00 GMT',
                'Last-Modified': (new Date()).toUTCString()
            });
            next();
        }
    );
}

app.use('/', indexRouter);
app.use('/api/1.0.0/laboratory-tests', laboratoryTestsRouter);
if(isProduction === false) {
    app.use('/', devRouter);
}
app.use('/assets/', express.static(path.join(paths.ETC, 'frontend/dist/assets')));

/// catch 404 and forward to error handler
app.use(
    function(request, response, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
);

// development error handler
// will print stacktrace
if (isDevelopment) {
    app.use(
        function(error, request, response, next) {
            console.log(error);
            console.log(error.stack);

            const payload = new JsonPayloadError(error.message, 'trace');
            payload.meta = {
                status: error.status,
                stack: error.stack.split('\n')
            };

            response.status(error.status || 500);
            response.json(
                payload.toObject()
            );
        }
    );
}

// production error handler
// no stacktraces leaked to user
app.use(
    function(error, request, response, next) {
        const payload = new JsonPayloadError(error.message, 'trace');
        payload.meta = {
            error
        };

        response.status(error.status || 500);
        response.json(
            payload.toObject()
        );
    }
);

const env = process.env.NODE_ENV;
console.log('App loaded in ' + (env.toUpperCase().underline[['development', 'test'].indexOf(env) >= 0 ? 'red' : 'green']) + ' mode.');
beep();

module.exports = app;

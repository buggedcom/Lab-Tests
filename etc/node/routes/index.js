import express from 'express';
import path from 'path';
import paths from '../paths';

const router = express.Router();

/**
 * Sets up the index page.
 *
 * @author Oliver Lillie
 */
router.get(
    '/',
    function(request, response, next) {
        response.set('Content-Type', 'text/html; charset=utf-8');
        response.sendFile(
            path.join(
                paths.ETC,
                'frontend/dist/index.html'
            )
        );
    }
);

module.exports = router;

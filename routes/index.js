module.exports = function(req, res) {
    var base = req.params.base || '',
        page = req.params.page;

    if ( base !== '' ) base += '/';

    if( page !== 'index' ) {
        try {
            var func = require('./' + base + page);
            console.log(func);
        } catch ( e ) {
            console.log('API: FAILURE - invalid mobile request: ' + page );
            fail();
        }

        if( func ) {
            func(req,res);
        }

    } else {
        console.log('API: FAILURE - requested mobile index' );
        fail();
    }

    function fail() {
        res.sendStatus(404);
    }

};
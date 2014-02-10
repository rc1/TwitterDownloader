// #Modules
var path = require( 'path' );
var fs = require( 'fs' );
var Sequence = require( './sequence' );
var request = require( 'request' );

// #Global
var noop = function (){};

// #Saving
// __Options__
// * `dir<String/Path>` Folder to store the tweet in
// * `tweetData<Object>` Tweet json to save
function save ( options ) {

    // Default 
    var onError = noop;
    var onExists = noop;
    var onSaved = noop;
    var onDone = noop;

    var promise = {
        error : function ( callback ) {
            onError = callback;
            return promise;
        },
        exists : function ( callback ) {
            onExists = callback;
            return promise;
        },
        saved : function ( callback ) {
            onSaved = callback;
            return promise;
        },
        done : function ( callback ) {
            onDone = callback;
            return promise;
        }
    };

    // Start the process of saving the file, later
    process.nextTick( function () {

        var dir = options.dir || "./";

        // Grab the idStr from the tweet data
        var idStr;
        try {
            idStr = options.tweetData.id_str;
        } catch ( err ) {
            console.error( err );
            return onError( "Could not find id in tweet. See console." );
        }

        // Create the target path/filename
        var filename = path.join( dir, idStr+'.id.json' );

        // Grab what should be the image file
        var twitterProfileImage = options.tweetData.user.profile_image_url;
        twitterProfileImage = twitterProfileImage.replace( "_normal", "" );
        twitterProfileImage = twitterProfileImage.replace( "_bigger", "" );
        twitterProfileImage = twitterProfileImage.replace( "_mini", "" );
        var imageFilename = path.join( dir, idStr+'.profile'+path.extname( twitterProfileImage ) );

        var sequence = new Sequence();
        sequence
            // check if the json file exists already
            .then(function ( next ) {
                // get where the file should be stored
                fs.exists( filename, function ( exists ) {
                    if ( exists ) {
                        onExists();
                        return onDone();
                    } else {
                        next();
                    }
                });
            })
            // write the image file
            .then(function (next) {
                var r = request( twitterProfileImage );
                r.pipe( fs.createWriteStream( imageFilename ) );
                r.on( 'error', function ( err ) {
                    console.error( err );
                    onError( err );
                } );
                r.on( 'end', function () {
                    next();
                });
            })
            // write the file
            .then(function ( next ) {
                // Parse the tweet data to a json string
                var tweetDataString = "";
                try {
                    tweetDataString = JSON.stringify( options.tweetData, null, 4);
                } catch ( err ) {
                    console.error( err );
                    onError( "Could not stringify tweet data. See console." );
                    return onDone();
                }

                fs.writeFile( filename, tweetDataString, function( err ) {
                    if ( err ) {
                        onError( err );
                        return onDone();
                    } else {
                        onSaved();
                        onDone();
                    }
                }); 
            })
            // check if the image exsits

            .start();
    });

    return promise;
}

module.exports = save;
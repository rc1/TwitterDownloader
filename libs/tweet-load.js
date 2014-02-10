// #Modules
var path = require( 'path' );
var fs = require( 'fs' );
var Sequence = require( './sequence' );

// #Global
var noop = function (){};

// #Load
// __Options__
// * `dir<String/Path>` Folder to store the tweet in
// * `idStr<String>` The tweet id
function load ( options ) {

    // Default 
    var onError = noop;
    var onLoaded = noop;
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
        created : function ( callback ) {
            onCreated = callback;
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
        fs.readFile( path.join( dir, options.idStr+'.id.json' ), function ( err, data ) {
            if ( err ) {
                onError( err );
                return onDone( err );
            }
            var jsonData = {};
            try {
                jsonData.parse( jsonData );
            } catch ( e ) {
                onError( e );
                return onDone( e );
            }
            onLoaded( jsonData );
            onDone( null, data );
        });
    });
}
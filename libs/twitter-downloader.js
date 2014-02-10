// #Models 
var save = require( './tweet-save' );
var load = require( './tweet-load' );
var Sequence = require( './sequence' );

// #Config
var delayBetweenRequests = 6000;
var tweetsPerRequest = 90;

// #Global
var noop;

// #Get history 
function getHistory( twit, searchTerm, dir ) {

    var onTweet = noop;
    var onTweets = noop;
    var onError = noop;
    var onDone = noop;

    var promise = {
        tweet : function ( callback ) {
            onTweet = callback;
            return promise;
        },
        tweets : function ( callback ) {
            onTweets = callback;
            return promise;
        },
        error : function ( callback ) {
            onError = callback;
            return promise;
        },
        done : function ( callback ) {
            onDone = callback;
            return promise;
        }
    };

    process.nextTick( function () {
        
        twit.get( 'search/tweets', { q: searchTerm, count: tweetsPerRequest }, getTwitResponceHandler( loadAllPages ) );

        function loadAllPages( err, reply ) {
            setTimeout( function () {
                if ( err ) {
                    onError( 'Twit request failed', err );
                    return onDone( err );
                }
                if ( reply.statuses.length > 1 ) {
                    // get the last request id
                    var nextId = reply.statuses[ reply.statuses.length-1 ].id_str;
                    twit.get( 'search/tweets', {
                        max_id : nextId,
                        q: searchTerm, 
                        count: tweetsPerRequest
                    }, getTwitResponceHandler( loadAllPages ));
                } else {
                    return onDone( err );
                }
            }, delayBetweenRequests );
        }

        function getTwitResponceHandler( next ) {
            return function( err, reply ) {
                if ( err ) {
                    onError( err );
                    return onDone( err );
                }
                var saveAlreadyCounter = 0;
                var newCounter = 0;
                var errorCounter = 0;
                var total = 0;

                var sequence = new Sequence();
                reply.statuses.forEach( function ( tweet ) {
                    onTweet( tweet );
                    ++total;
                    sequence.then( function ( done ) {
                        save( {
                            dir : dir,
                            tweetData : tweet
                        })
                        .error( function ( err ) {
                            ++saveAlreadyCounter;
                            onError( err );
                        })
                        .exists( function ( err ) {
                            ++saveAlreadyCounter;
                        })
                        .saved( function ( ) {
                            ++newCounter;
                        })
                        .done( done );
                    });
                });
                sequence.then( function () {
                    console.log( "Batch processed (Total: %s New:%s Exisiting:%s Error:%s)", total, newCounter, saveAlreadyCounter, errorCounter );
                    onTweets( reply );
                    next( err, reply );
                });
                sequence.start();
            };
        }

    });

    return promise;
}

// #Get stream
function streamNew( twit, searchTerm ) {

}


// #Exports
module.exports = {
    getHistory : getHistory,
    streamNew : streamNew
};

Notes...

```javascript
save( { dir : './tweets', json : json } )
	.exists( function () {

	})
	.error( function ( err ) {

	})
	.created( function () {

	})
	.done( function ( err ) {

	});

load( { dir : 'tweets', idStr : idStr } )
	.error( function ( err ) {

	})
	.loaded( function ( data ) {

	})
	.done( function ( err, data ) {

	});

list( { dir : './tweets' } )
	.error( function () {

	})
	.list( function () {

	})
	.done( function () {

	});

// #Twitter downloader

var downloader = require( './libs/downloader' );

downloader
	.get
```

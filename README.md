# Twitter Downloader

A quick 'n' dirty node.js app to download tweets to disk.

To use it you will need your twitter oauth credentials.

## Usage

From the commandline...

## 1. Create a file called `script-download-history`

    $ touch script-download-history

## 2. Make it executable

	$ chmod u+x script-download-history

## 3. Add the following to the file

	#!/bin/sh

	CONSUMER_KEY=your_key \
	CONSUMER_SECRET=your_secret \
	ACCESS_TOKEN_KEY=your_token \
	ACCESS_TOKEN_SECRET=your_token_secret \
	bin/twitter-search-get --query 'tate robots' -g -d './tweets'

Replace the `you_` bits with your data and change the query.
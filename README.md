# EGG LOB

A simple implementation of a popular word game.

## Prerequisites

* Node/npm
* Ruby (only needed if rebuilding the dictionary)

## Build

    make

## Dictionary

The file `public/dictionary.json` is a JSON tree of all possible words. To
rebuild it, you'll need to copy or link a word list as `words.txt` and run
`make dictionary`.

## Play

Run a local webserver:

    make start

Open [localhost:8080](http://localhost:8080/) in a browser.

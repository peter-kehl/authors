"use strict";

//var request= require('request');
var storage = require('node-persist');

storage.init( {
}).then( ()=>{
    let authors= storage.getItemSync('authors');
    if( authors.constructor!==Object ) {
        throw "authors must be a plain object.";
    }
    let authorsByNumberAddons= []; // an array, not an object. Spare entries are undefined (default).
    for( let authorId in authors ) {
        var author= authors[authorId];
        let numberOfAddons= Object.keys(author.addons).length;
        console.log( numberOfAddons );
        if( !(numberOfAddons in authorsByNumberAddons) ) {
            authorsByNumberAddons[numberOfAddons]= [];
        }
        authorsByNumberAddons[numberOfAddons].push( author );/**/
    }
    console.log( 'Max. # of add-ons per author: ' +(authorsByNumberAddons.length-1) );
    storage.setItemSync( 'authorsByNumberAddons', authorsByNumberAddons );
    process.exit();
}
, (error) => {
        console.log( error );
    }
).then( ()=>{
    process.exit();
}, (err)=>{
    console.log( err );
    process.exit();
});
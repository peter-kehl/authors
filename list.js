"use strict";

//var request= require('request');
var storage = require('node-persist');

storage.init( {
}).then( ()=>{
    //let authors= storage.getItemSync('authors');
    let authorsByNumberAddons= storage.getItemSync('authorsByNumberAddons');
    if( authorsByNumberAddons.constructor!==Array ) {
        throw "authorsByNumberAddons must be an array.";
    }
    
    for( let numberOfAddons=0; numberOfAddons<authorsByNumberAddons.length; numberOfAddons++ ) {
        var authors= authorsByNumberAddons[numberOfAddons];
        if( authors ) {
            console.log( '' +numberOfAddons+ ' addons per author <= ' +authors.length+ " author(s)." );
            /*for( let author of authors ) {
                
            }*/
        }
    }
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
"use strict";
// Alternatively: https://github.com/request/request-promise
/*var jwt= require('jsonwebtoken');

// sign with default (HMAC SHA256)
//backdate a jwt 30 seconds
var token = jwt.sign({
  iss: 'user:9825722:719',
  iat: Math.floor(Date.now() / 1000) - 30,
  exp: Math.floor(Date.now() / 1000) + 200,
  jti: '' +Math.random()
}, 'signature');*/

var request= require('request');
var storage = require('node-persist');

storage.init( {
    //dir:
}).then( ()=>{
    let pageNumber= storage.getItemSync('lastPage') || 0;
    let authors= storage.getItemSync('authors') || {};
    const pageSize= 100;
   
    var processOnePage= function() {
        pageNumber++;
        request( {
             // See https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#search
             uri: 'https://addons.mozilla.org/api/v3/addons/search?app=firefox&page_size=' +pageSize+ '&page=' +pageNumber,
             proxy: 'http://proxy.racp.edu.au:3128',
             //headers: {Authorization: 'JWT ' +token },
            },
            function( error, response, body ) {
               if( error ) {
                   console.log( error );
               }
               else {
                   let data= JSON.parse( body );
                   if( 'results' in data ) {
                     for( let addon of data.results ) {
                         if( addon.is_listed ) {
                           for( let author of addon.authors ) {
                               let authorCompound= author.id in authors
                                 ? authors[author.id]
                                 : author;
                               authors[ author.id ]= authorCompound;

                               let addons= 'addons' in authorCompound
                                 ? authorCompound.addons
                                 : {};
                               authorCompound.addons= addons;
                               addons[ addon.id ]= {
                                   id: addon.id,
                                   homepage: addon.homepage
                                       ? ('en-US' in addon.homepage
                                           ? addon.homepage['en-US']
                                           : addon.homepage[ Object.keys(addon.homepage) ]
                                         )
                                       : null,
                                   name: addon.name
                                       ? ('en-US' in addon.name
                                           ? addon.name['en-US']
                                           : addon.name[ Object.keys(addon.name) ]
                                         )
                                       : null
                               };
                           }
                         }
                     }

                     storage.setItemSync( 'authors', authors );
                     storage.setItemSync( 'lastPage', pageNumber );
                     // Repeat (while there is data.results)
                     setImmediate( processOnePage );
                   }
                   else {
                       process.exit();
                   }
               }
            }
        ); 
    };
    processOnePage();
}
, (error) => {
        console.log( error );
    }
);
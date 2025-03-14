
'use strict';

 const mongoose = require('mongoose');
 const app = require('./app.js');
 const port = 3800; 

//conexion data base
 mongoose.Promise = global.Promise;
 mongoose.connect('mongodb://localhost:27017/red_social', {
   useNewUrlParser: true,
   useUnifiedTopology: true
})
 .then(()=>{
    console.log('Conexion a la base de datos ha sido exitosa!');

    //crear servidor
   app.listen(port, ()=> {
      console.log("servidor corriendo en http://localhost:3800");
   });
 })
.catch(err => console.log(err));

require('dotenv').config(); 
import express, { Application } from 'express'; 
import { connect } from 'mongoose'; 
import { urlencoded, json } from 'body-parser'; 

import * as swaggerDocument from './swagger.json'; 
import { serve, setup } from 'swagger-ui-express'; 

import routes from './routes';

// inicializaciones
const app: Application = express();
const opts = { 
    useNewUrlParser : true, useCreateIndex : true, 
    useFindAndModify : false, useUnifiedTopology : true 
};

// middlewares
app.use( urlencoded({ extended: true }) );
app.use( json() );
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://prueba-heroku/');
    res.header('Access-Control-Allow-Headers', 'Authorization, Token, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// routes
app.use(routes);
// swagger
app.use('/api-docs', serve, setup( swaggerDocument ) );

// init server
const main = async () => {
 
    try {
        await connect(String(process.env.MONGOURI), opts);

        app.listen(Number(process.env.PORT), ()  => {
                console.log('Conexion a la base de datos establecida');
                console.log(`Servidor corriendo en el puerto ${ Number(process.env.PORT) }`);
        });
        

    } catch (err) {
        console.log('Error en el servidor', err);
    }

};


main();

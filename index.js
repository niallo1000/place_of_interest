'use strict';

const dotenv = require('dotenv');

const result = dotenv.config();
if (result.error) {
    console.log(result.error.message);
    process.exit(1);
}

var cloudinary = require('cloudinary');
    cloudinary.config({
    cloud_name: 'dsrpqvwij',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});




const Hapi = require('hapi');

const fsConfig = {
    password: process.env.password,
};

const server = Hapi.server({
    port: process.env.PORT || 3000,
});



async function init() {
    await server.register(require('inert'));
    await server.register(require('vision'));
    await server.register(require('hapi-auth-cookie'));

    server.auth.strategy('standard', 'cookie', {
        password: fsConfig.password ,
        cookie: 'donation-cookie',
        isSecure: false,
        ttl: 24 * 60 * 60 * 1000,
        redirectTo: '/',
    });

    server.auth.default({
        mode: 'required',
        strategy: 'standard',
    });

    server.views({
        engines: {
            hbs: require('handlebars'),
        },
        relativeTo: __dirname,
        path: './app/views',
        layoutPath: './app/views/layouts',
        partialsPath: './app/views/partials',
        layout: true,
        isCached: false,
    });

    server.route(require('./routes'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});


require('./app/models/db');
init();
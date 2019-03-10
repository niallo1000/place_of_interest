'use strict';

const Accounts = require('./app/controllers/accounts');
const Pois = require('./app/controllers/pois');
const Comments = require('./app/controllers/comment');

module.exports = [
    { method: 'GET', path: '/', config: Accounts.index },
    { method: 'GET', path: '/signup', config: Accounts.showSignup },
    { method: 'GET', path: '/login', config: Accounts.showLogin },
    { method: 'GET', path: '/addNew', config: Pois.showaddNew },
    { method: 'GET', path: '/adminLogin', config: Accounts.showAdminLogin },
    { method: 'GET', path: '/poilist', config: Pois.showaddNew },

    { method: 'POST', path: '/signup', config: Accounts.signup },
    { method: 'POST', path: '/login', config: Accounts.login },
    { method: 'POST', path: '/adminLogin', config: Accounts.adminLogin },
    //{ method: 'POST', path: '/places', config: Pois.uploadimage },


    { method: 'GET', path: '/logout', config: Accounts.logout },
    { method: 'GET', path: '/places', config: Pois.places },
    { method: 'GET', path: '/reports', config: Pois.reports },


    { method: 'GET', path: '/adminpoisreport', config: Pois.reports },
    { method: 'POST', path: '/poi2', config: Pois.poi },


    { method: 'GET', path: '/updatePoi/{id}', config: Pois.showUpdatePoi },
    { method: 'GET', path: '/deletePoi/{id}', config: Pois.deletePoi },
    { method: 'GET', path: '/viewPoi/{id}', config: Pois.showViewPoi },
    { method: 'GET', path: '/viewPoiAdmin/{id}', config: Pois.showViewPoiAdmin },

    { method: 'POST', path: '/updatePoi/{id}', config: Pois.updatePoi },
    { method: 'POST', path: '/uploadImage', config: Pois.uploadImage },



    { method: 'GET', path: '/settings', config: Accounts.showSettings },
    { method: 'POST', path: '/settings', config: Accounts.updateSettings },
    { method: 'POST', path: '/postComment/{id}', config: Comments.comment },

    { method: 'GET', path: '/viewUser/{id}', config: Accounts.showUser },
    { method: 'GET', path: '/deleteUser/{id}', config: Accounts.deleteuser },


    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public'
            }
        },
        options: { auth: false }
    }
];
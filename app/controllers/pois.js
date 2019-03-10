'use strict';

const POI = require('../models/poi');
const User = require('../models/user');
const Comment = require('../models/comment');

const Joi = require('joi')
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dsrpqvwij',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});




const Pois = {
    home: {
        handler: async function(request, h) {
            //const candidates = await Candidate.find();
           // return h.view('home', { title: 'Add a Place of Interest', candidates: candidates });
            return h.view('home', { title: 'Add a Place of Interest' });
        }
    },


    places: {
        handler: async function(request, h) {
            const pois = await POI.find().populate('poi');
            return h.view('places', {
                title: 'Places of interest',
                pois: pois,
            });
        }
    },

    reports: {
        handler: async function(request, h) {
            const pois = await POI.find().populate('poi');
            const user = await User.find().populate('user');
            return h.view('reports', {
                title: 'Places of interest',
                pois: pois,
                user: user
            });
        }
    },

    poi: {
        validate: {
            payload: {
                name: Joi.string().required(),
                description: Joi.string().required(),
                image: Joi.string().required(),
                catagory: Joi.string().required(),
                location: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('signup', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const data = request.payload;


                const newPoi = new POI({
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    catagory: data.catagory,
                    location: data.location,

                                    });
                await newPoi.save();
                return h.redirect('/places');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }


    },


    showaddNew: {
        handler: function(request, h) {
            return h.view('addNew', { title: 'Add a PP' });
        }
    },


    showUpdatePoi: {
        handler: async function(request, h) {
            try {
                const id = request.params.id;
              //  console.log(id);
                const poi = await POI.findById(id);
               // console.log(poi);
                return h.view('updatePoi', { title: 'View Place of Interest', poi: poi });
            } catch (err) {
                return h.view('places', { errors: [{ message: err.message }] });
            }
        }
    },

    showViewPoi: {
        handler: async function(request, h) {
            try {
                const id = request.params.id;
                const poi = await POI.findById(id);
                return h.view('viewPoi', { title: 'View Place of Interest', poi: poi });
            } catch (err) {
                return h.view('places', { errors: [{ message: err.message }] });
            }
        }
    },

    showViewPoiAdmin: {
        handler: async function(request, h) {
            try {
                const id = request.params.id;
                const poi = await POI.findById(id);
                return h.view('viewPoiAdmin', { title: 'View Place of Interest', poi: poi });
            } catch (err) {
                return h.view('places', { errors: [{ message: err.message }] });
            }
        }
    },
    deletePoi: {
        handler: async function(request, h) {
            try {
                const id = request.params.id;
                const poi = await POI.findById(id);
                await poi.delete();
                const pois = await POI.find().populate('poi');
                const user = await User.find().populate('user');

                return h.view('reports', {
                    title: 'Places of interest',
                    pois: pois,
                    user: user
                });
            } catch (err) {
                return h.view('reports',  { errors: [{ message: err.message }] });
            }
        }
    },
    updatePoi: {
        validate: {
            payload: {
                name: Joi.string().required(),
                image: Joi.string().required(),
                description: Joi.string().required(),
                catagory: Joi.string().required(),
                location: Joi.string().required(),
             //   comment: Joi.string().required(),
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('places', {
                        title: 'Errddsddor',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const poiEdit = request.payload;
                const id = request.params.id;
                const poi = await POI.findById(id);
                poi.name = poiEdit.name;
                poi.image = poiEdit.image;
                poi.description = poiEdit.description;
                poi.catgory = poiEdit.catagory;
                poi.location = poiEdit.location;
             //   poi.comment = poiEdit.comment;
                await poi.save();
                const pois = await POI.find().populate('poi');
                const user = await User.find().populate('user');

                return h.view('reports', {
                    title: 'Places of interest',
                    pois: pois,
                    user: user
                });
            } catch (err) {
                return h.view('reports', { errors: [{ message: err.message }] });
            }
        }
    },

    uploadImage: {
        handler: async function (request, h) {
            const widget = cloudinary.createUploadWidget({
                cloud_name: 'dsrpqvwij',
                upload_preset: 'vbpzd48a',
                sources: ['local', 'url'],

            }, (error, result) => {

                if (result.event === "success") {
                    console.log(result.info.secure_url);
                    widget.close();
                }
            });
        },
    }

};

module.exports = Pois;
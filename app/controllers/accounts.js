'use strict';
const Boom = require('boom');
const User = require('../models/user');
const Admin = require('../models/admin');
const Joi = require('joi');

const Accounts = {
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'Places of Interest' });
        }
    },
    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for Donations' });
        }
    },
    signup: {
        auth: false,
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
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
                const payload = request.payload;
                let user = await User.findByEmail(payload.email);
                if (user) {
                    const message = 'Email address is already registered';
                    throw new Boom(message);
                }
                const newUser = new User({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: payload.password
                });
                user = await newUser.save();
                request.cookieAuth.set({ id: user.id });
                return h.redirect('/places');
            } catch (err) {
                return h.view('signup', { errors: [{ message: err.message }] });
            }
        }
    },


    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login to Donations' });
        }
    },



    login: {
        auth: false,
        validate: {
            payload: {
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('login', {
                        title: 'Sign in error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let user = await User.findByEmail(email);
                if (!user) {
                    const message = 'Email address is not registered';
                    throw new Boom(message);
                }
                user.comparePassword(password);
                request.cookieAuth.set({ id: user.id });
                return h.redirect('/places');
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },

    showSettings: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                return h.view('settings', { title: 'Donation Settings', user: user });
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },

    showUser: {
        handler: async function(request, h) {
            try {
                const id = request.params.id;
                const user = await User.findById(id);
                return h.view('user', { title: 'User Settings', user: user });
            } catch (err) {
                return h.view('user', { errors: [{ message: err.message }] });
            }
        }
    },

    deleteuser: {
        handler: async function(request, h) {
            try {
                const id = request.params.id;
                const users = await User.findById(id);
                 await users.delete();
                const user = await User.find().populate('user');
                const pois = await POI.find().populate('poi');

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



    updateSettings: {
        validate: {
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('settings', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const userEdit = request.payload;
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                user.firstName = userEdit.firstName;
                user.lastName = userEdit.lastName;
                user.email = userEdit.email;
                user.password = userEdit.password;
                await user.save();
                return h.redirect('/settings');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },

    logout: {
        handler: function(request, h) {
            request.cookieAuth.clear();
            return h.redirect('/');
        }
    },

    showAdminLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('adminLogin', { title: 'Admin Login to Donations' });
        }
    },


    adminLogin: {
        auth: false,
        validate: {
            payload: {
                adminEmail: Joi.string()
                    .email()
                    .required(),
                adminPassword: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('adminLogin', {
                        title: 'Sign in error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            const { adminEmail, adminPassword } = request.payload;
            try {
                let admin = await Admin.findByEmail(adminEmail);
                if (!admin) {
                    const message = 'Email address is not registered';
                    throw new Boom(message);
                }
                admin.comparePassword(adminPassword);
                request.cookieAuth.set({ id: admin.id });
                return h.redirect('/reports');
                // need to update this to Admin Report
            } catch (err) {
                return h.view('adminLogin', { errors: [{ message: err.message }] });
            }
        }
    },
};

module.exports = Accounts;
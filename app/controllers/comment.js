'use strict';

const Comment = require('../models/comment');
const User = require('../models/user');
const Pois = require('../models/poi');

const Comments = {


    report: {
        handler: async function(request, h) {
            const donations = await Donation.find().populate('donor').populate('candidate');
            return h.view('report', {
                title: 'Donations to Date',
                donations: donations
            });
        }
    },



    comment: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);

                const data = request.payload;

               console.log(data);

                const newComment = new Comment({
                    text: data.comment,
                    author: user._id,
                });

                await newComment.save();
                return h.redirect('/places');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    }
};

module.exports = Comments;
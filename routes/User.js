require('dotenv').config({path: './config.env'});
const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Details = require('../models/Details');

const signToken = userID => {
    return JWT.sign({
        iss: "Uniqus",
        sub: userID,
    }, process.env.JWT_SECRET, {expiresIn: "1h"})};


router.route("/register").post(async(req, res) => {
    const { username, password, role } = req.body;
    const user = await User.findOne({username});
    if(user) {
        return res.status(400).json({
            message: {
                msgBody: "Username already taken",
                msgError: true,
            },
        });
    }else
    {
        const newUser = new User({username, password, role});
        await newUser.save().then(
            res.status(201).json({
                message: {
                    msgBody: "Account successfully created",
                    msgError: false,
                },
            })
        ).catch((err) => res.status(500).json({
            message: {
                msgBody: err,
                msgError: true,
            },
        }));
    }
});

router.route("/login").post(passport.authenticate('local', {session: false}), (req, res) => {
    if(req.isAuthenticated()){
        const {_id, username, role} = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, {httpOnly: true, sameSite: true});
        res.status(200).json({isAuthenticated: true, user: {username, role}});
    }
}  );

router.route("/logout").post(passport.authenticate('jwt', {session: false}), (req, res) => {
    res.clearCookie('access_token');
    res.json({user : {username: "", role: ""}, success: true});
    } );

router.route("/details").post(passport.authenticate('jwt', {session: false}), async(req, res) => {
      const details = new Details(req.body);
       await details.save().then(
        () =>{ 

            req.user.details.push(details);
             req.user.save().catch((err) => res.status(500).json({
                message: {
                    msgBody: err,
                    msgError: true,
                },
            }));
            res.status(201).json({
            message: {
                msgBody: "Details successfully added",
                msgError: false,
            },
        })
        }
      ).catch((err) => res.status(500).json({  
            message: {
                msgBody: err,
                msgError: true,
            },
        }));
        } );




module.exports = router;
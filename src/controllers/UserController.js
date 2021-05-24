'use strict';
const mongoose = require("mongoose");
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: '.env'});

const createUser = async (req, res) => {
    const {id, profile, name} = req.body;
	const newUser = {
		id,
		name
	}
	
    try {
        const result = await User.create(newUser);
        res.status(201).json({success: true, result});
    } catch(err) {
        console.log(err);
        res.status(400).json({success: false});
    }
};

const loginUser = async (req, res) => {
    const {id} = req.body;
    try {
        const user = await User.findOne({id});
		if (!user) {
			return res.status(401).json({success: false, msg: 'None User'});
		}
		// var token = jwt.sign({ id: user.id }, config.secret, {
		// 	expiresIn: 86400 // 24 hours
		//   });
		return res.status(200).json({
			success: true, 
			token: jwt.sign({id: user.id}, process.env.SECRET)
		});
    } catch(err) {
        throw err;
    }
}

const getProfile = async (req, res) => {
	const {id} = req.user;
	const userInfo = await User.findOne({id});
	res.status(200).json({success: true, user: userInfo});
}

module.exports = {
    createUser,
	loginUser,
	getProfile
}
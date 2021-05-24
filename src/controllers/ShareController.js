'use strict';
const mongoose = require("mongoose");
const Share = require('../models/share');
const {generateData} = require('../lib/convert');

const addLink = async (req, res) => {
    const {name, link, description, category} = req.body;
    const share = {
        userId: req.user.id,
		link,
		category
    }

	generateData(link)
	.then(async(data) => {
		const shareData = Object.assign(share, data);
		const result = await Share.create(shareData);
		res.status(201).json({success: true, result});
	})
	.catch(error => {
		console.log("Error: " + error);
		res.status(400).json({success: false})
	});
};

const getLinks = async (req, res) => {
	const {category, search} = req.query;
	let condition = {userId: req.user.id}

    try {
		if (category) {
			condition = {...condition, category};
		}
		if (search) {
			let regex = RegExp('.*' + search + '.*', 'g');
			condition = {...condition, title: {$regex: regex}};
		}
        const result = await Share.find(condition);
        res.status(200).json({success: true, result});
    } catch(err) {
        console.log(err);
        res.status(400).json({success: false});
    }
}

const removeLink = async (req, res) => {
    const {linkId} = req.params;
    try {
        const result = await Share.remove({_id : mongoose.Types.ObjectId(linkId), userId: req.user.id})
        res.status(201).json({success: true, result});
    } catch(err) {
        console.log(err);
        res.status(400).json({success: false, err});
    }
}

const removeLinkList = async (req, res) => {
	const deleteList = req.body;
	const condition = { _id: { $in: deleteList }, userId: req.user.id };
	
    try {
        const result = await Share.deleteMany(condition);
        res.status(201).json({success: true, result});
    } catch(err) {
        console.log(err);
        res.status(400).json({success: false, err});
    }
}

const updateLink = async (req, res) => {
    const {linkId} = req.params;
    const {title, description, category, image} = req.body;
	let updateData = {
		title,
		description,
		category
	}
	
	if (image) {
		updateData = {...updateData, image};
	}
	
    try {
        const update = await Share.findByIdAndUpdate(linkId, {
            $set: updateData
        }, {new: true});
        res.status(201).json({success: true, update: 1});
    } catch(err) {
        console.log(err);
        res.status(400).json({success: false, err});
    }
}

module.exports = {
    addLink,
    getLinks,
    removeLink,
	removeLinkList,
    updateLink
};
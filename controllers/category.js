const Categories = require('../models/Category');
const errorHandler = require('../utils/errorHandler');
const Position = require('../models/Position');


module.exports.getAll = async function (req, res) {
    try{
        const categories = await Categories.find({
            user: req.user.id
        });

        res.status(200).json(categories);
    } catch(e) {
        errorHandler(res, e);
    }
};

module.exports.getById = async function (req, res) {
    try{
        const categories = await Categories.findById(req.params.id);
        res.status(200).json(categories);

    } catch(e) {
        errorHandler(res, e);
    }
};

module.exports.remove = async function (req, res) {
    try{
       await Categories.remove({
            _id: req.params.id
        });
        await Position.remove({
            category: req.params.id
        });

        res.status(200).json({
            message: 'Category and position were deleted'
        });
    } catch(e) {
        errorHandler(res, e);
    }
};

module.exports.create = async function (req, res) {
    const category = new Categories({
        name: req.body.name,
        user: req.user.id,
        imageSrc: req.file ? req.file.path : ''
    });
    try{

        await category.save();

        res.status(201).json(category);
    } catch(e) {
        errorHandler(res, e);
    }
};

module.exports.update = async function (req, res) {
    try{

        const updated = {
            name: req.body.name
        };

        if (req.file) {
            updated.imageSrc = req.file.path
        }

        const category = await Categories.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true});

        res.status(200).json(category);
    } catch(e) {
        errorHandler(res, e);
    }

};
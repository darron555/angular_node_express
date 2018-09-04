const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');


module.exports.login = async function (req, res) {
    const candiate = await User.findOne({
        email: req.body.email
    });

    if (candiate) {

        const passrResult = bcrypt.compareSync(req.body.password, candiate.password);

        if (passrResult) {
            const token = jwt.sign({
                email: candiate.email,
                userId: candiate._id,
            }, keys.jwt, {expiresIn: 3600});

            res.status(200).json({
                token: `Bearer ${token}`
            });

        } else {
            res.status(401).json({
                message: 'Password is wrong'
            });
        }

    } else {
        res.status(404).json({
            message: 'The user is not created in this system'
        });
    }
};

module.exports.register = async function (req, res) {

    const candidate = await User.findOne({
        email: req.body.email
    });

    if (candidate) {
        res.status(409).json({
           message: 'This email is using.'
        });
    } else {

        const salt = await bcrypt.genSalt(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        });

        try {
            await user.save();
            res.status(201).json(user)
        } catch(e) {
            errorHandler(res, e)
        }
    }
};
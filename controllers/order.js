const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

// get localhost:5000/api/order?offset=2&limit=5
module.exports.getAll = async function (req, res) {
    try {

        const query = {
            user: req.user.id,
        };

        // start date
        if (req.query.start) {
            query.date = {
                $gte: req.query.start
            }
        }

        // end date
        if (req.query.end) {
            if (!query.date) {
                query.date = {};
            }
            query.date['$lte'] = req.query.end;
        }

        if (req.query.order) {
            query.order = +req.query.order;
        }

        const orders = await Order.find(query)
            .sort({date: -1})
            .skip(+req.query.offset)
            .limit(+req.query.limit);

        res.status(200).json(orders);

    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.create = async function (req, res) {
    try {

        const lastOrder = Order.findOne({
            user: req.user.id
        }).sort({date: -1});

        const maxOrder = lastOrder ? lastOrder.order : 0;

        const order = await new Order({
            user: req.user.id,
            list: req.body.list,
            order: maxOrder + 1
        }).save();

        res.status(201).json(order);

    } catch (e) {
        errorHandler(res, e);
    }
};


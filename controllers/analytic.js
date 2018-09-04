module.exports.overview = function (req, res) {
    res.status(200).json({
        overview: 'overview from controller'
    });
};

module.exports.analytic = function (req, res) {
    res.status(200).json({
        analytic: 'analytic from controller'
    });
};
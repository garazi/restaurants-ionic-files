var request = require('request');

module.exports = {
    postReview: postReview
};

function postReview(req, res) {
    request.post('http://api.usergrid.com/YOURORGNAME/sandbox/reviews', {
        form: JSON.stringify(req.body)
    }, function(error, response, body) {
        if (error) {
            res.send(error);
        } else {
            res.set('Content-Type', 'application/json');
            res.send(body);
        }
    });
}
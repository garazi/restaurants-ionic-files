var request = require("request");

module.exports = {
    getRestaurants: getRestaurants
};

function getRestaurants(req, res) {
    request("http://api.usergrid.com/YOURORGNAME/sandbox/restaurants?limit=999", function(err, resp, body) {
        if (err) {
            res.send(err);
        } else {
            body = JSON.parse(body);
            var results = {};
            results.entities = body.entities;
            results.count = body.count;
            res.send(results);
        }
    });
}
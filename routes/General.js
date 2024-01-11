const Joi                       = require('joi');
const Manager                   = require('../manager/General');
const Response                  = require('./response').setup(Manager);

module.exports = {
    getPrice: {
        tags: ["api", "General"],
        description: "get price",
        handler: (req, res) => {
            return Response(req, res, "getPrice");
        },
        validate: {
            query: Joi.object({
                address: Joi.string().required(),
                chain: Joi.string().required()
            })
        },
    },
}
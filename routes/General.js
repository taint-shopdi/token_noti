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
        plugins: {
            'hapi-swagger': {
              responses: {
                200: {
                  schema: Joi.object({
                      message: 'success',
                      data: Joi.object({
                        method: Joi.string(),
                        inputs: Joi.array().items(Joi.object({
                            value: Joi.any(),
                            type: Joi.string()
                        })),
                        abi: Joi.string()
                      })
                  })
                }
              }
            }
          }
    },
}
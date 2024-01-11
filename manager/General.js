"use strict";
const DEXTOOL_API_KEY = process.env.DEXTOOL_API_KEY

module.exports = {
  getPrice: async (req) => {
    const { chain, address } = req.query;
    try {
        const res = await (await fetch(`https://api.dextools.io/v1/pair?chain=${chain}&address=${address}`, {
          headers: {
            "X-API-KEY": DEXTOOL_API_KEY,
          }
        })).json()
        return res
    } catch (e) {
        throw e
    }
  },
};

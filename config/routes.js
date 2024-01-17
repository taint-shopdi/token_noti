/**
 * Created by A on 7/18/17.
 */
'use strict';
const Pac = require('../package.json');

module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      tags: ['api', 'General'],
      description: 'access home',
      handler: (req, res) => {
        return res.response('Welcome to ' + Pac.name + ' !!!').code(200);
      }
    }
  },
    
  ]
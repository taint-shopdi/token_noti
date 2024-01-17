/**
 * Created by A on 7/18/17.
 */
'use strict'
require('dotenv').config()
require('colors');
require('./utils/seed');
// require('./config/mysqldb');
const Logger    = require('./utils/logging');
const Glue      = require('@hapi/glue');
const Routes    = require('./config/routes');
const Manifest  = require('./config/manifest');
const AppConfig = require('./config/app');
const mongoose = require("mongoose");
const parse = require('parse-duration')
const dbUrl = require("./config/mongodb")
const {port}      = Manifest.server

require('./manager/General')

const startServer = async () => {
  try {
    // console.log(dbUrl.connectString)
    // mongoose.connect(dbUrl.connectString, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    //   Logger.info('.------------------------------------------------.'.green);
    //   Logger.info(`|   Server running at: ${port}                      |`.green);
    //   Logger.info("|   Connect MongoDB success !!!                  |".green);
    //   Logger.info('|________________________________________________|'.green);
    // }).catch(err => {
    //   console.log(err)
    //   Logger.error('.------------------------------------------------.'.green);
    //   Logger.error(`|   Server running at: ${port}   |`.green);
    //   Logger.error("|   Can't connect to MongoDB !!!                 |".red);
    //   Logger.error('|________________________________________________|'.green);
    //   Logger.error(err);
    // });
    Logger.info('.------------------------------------------------.'.green);
    Logger.info(`|   Server running at: ${port}                      |`.green);
    Logger.info('|________________________________________________|'.green);
    const server = await Glue.compose(Manifest, {relativeTo: __dirname})
    server.start();
    // server.auth.strategy('jwt', 'jwt', {
    //   keys: AppConfig.jwt.secret,
    //   verify: {
    //     aud: 'urn:audience:prod',
    //     iss: 'urn:issuer:prod',
    //     sub: false,
    //     nbf: true,
    //     exp: true,
    //     maxAgeSec: Number(AppConfig.jwt.expiresIn),
    //     timeSkewSec: 15
    //   },
    //   validate: (artifacts, request, h) => {
    //     return {
    //       isValid: true
    //     };
    //   }
    // });
    // server.auth.strategy('session', 'cookie', {
    //   cookie: {
    //     name: 'sid',
    //     password: process.env.SESSION_SECRET || "123123Aa",
    //     isSecure: false,
    //     // isSameSite: 'Lax',
    //     // keepAlive: true,
    //     // ttl: 60 * 60 *30
    //   },
    //   // redirectTo: false,
    //   validate: async (request, session) => {
    //     // console.log(request)
    //     return {
    //       isValid: true,
    //       credentials: session,
    //     };
    //   },
    // });
    server.route(Routes);
    server.events.on('response', (request) => {
      if(request.response.statusCode <= 304) Logger.info((request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode).green);
      else Logger.error(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
    });

  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();

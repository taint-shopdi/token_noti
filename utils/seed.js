// const UserModel      = require('../models/Users');
// const { hashPassword }    = require('../utils/userFunctions');

// UserModel.findOne({
//     username: process.env.ADMIN_USERNAME,
//     email: process.env.ADMIN_EMAIL,
//     status: 'active',
// }).then(user => {
//     if (!user) {
//         hashPassword(process.env.ADMIN_PASS, (err, hash) => {
//             if (err) throw err;
//             const model = new UserModel({
//                 username: process.env.ADMIN_USERNAME,
//                 password: hash,
//                 email: process.env.ADMIN_EMAIL,
//                 status: 'active',
//                 role: 'admin'
//             });
//             return model.save();
//         });
//     }
// });



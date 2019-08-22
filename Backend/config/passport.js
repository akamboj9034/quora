// const passportJWT = require("passport-jwt");
// const JWTStrategy   = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;
// const passport = require('passport')
// const Faculty = require('../models/faculty')

// passport.use(new JWTStrategy({
//         jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//         secretOrKey   : 'secretToken'
//     },
//     function (jwtPayload, cb) {
//         console.log(jwtPayload)
//         //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
//         return Faculty.findOneById(jwtPayload.id)
//             .then(user => {
//                 return cb(null, user);
//             })
//             .catch(err => {
//                 return cb(jwtPayload);
//             });
//     }
// ));
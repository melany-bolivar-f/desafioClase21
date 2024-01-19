const passport = require('passport')
const userDaoMongo = require('../daos/mongo/userDaoMongo')
const userService = new userDaoMongo()
const GithubStrategy = require('passport-github2')

exports.initializePassport = () => {

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.f3bef629bb90ed92',
        clientSecret: 'f24b33afafb215eb913eb9ed7a81619b95f003eb',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'
    }, async (accesToken, refreshToken, profile, done)=>{
        try{
            console.log(profile)
            let user = await userService.getUserBy({email: profile._json.email})
            if (!user) {
                let newUser = {
                    first_name: profile.username,
                    last_name: profile.username,
                    email: profile._json.email,
                    password: '123'
                }
                let result = await userService.createUser(newUser)
                return done(null, result)
            }
            done(null, user)
        }catch(err){
            return done(err)
        }
    }))

    // save and take sessions user credentials
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUserBy({_id: id})
        done(null, user)
    })

}
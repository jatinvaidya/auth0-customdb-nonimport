// the identifier could either be email or username.
// identifier will always be username - during user login.
// identifier will always be email - during user creation (when the login script gets called implicitly)
function login(identifier, password, callback) {

    // prep conn to legacy db
    const MongoClient = require('mongodb@3.1.4').MongoClient;
    let mongoUri = 'mongodb+srv://';
    mongoUri += `${configuration.MONGO_USERNAME}`;
    mongoUri += `:${configuration.MONGO_PASSWORD}`;
    mongoUri += `@${configuration.MONGO_SRVNAME}`;
    mongoUri += '?retryWrites=true&w=majority';
    const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true });

    // yes, there are better ways to validate email ;-) but not relevent to this demo
    let isIdentifierEmail = false;
    if (identifier.indexOf('@') !== -1) {
        isIdentifierEmail = true;
    }

    // just dump the arguments
    console.info(`[login-script] isIdentifierEmail: ${isIdentifierEmail}, identifier: ${identifier}`);

    // connect to legacy db and fire queries
    mongoClient.connect(err => {

        if (err) console.error(`err: ${err}`);

        // initialize search filter
        let searchFilter = { username: identifier, password: password };
        if (isIdentifierEmail) {
            // identifier is of email format, fix the search filter
            // this happens only during signup when this script implicitly invoked by the create script
            // the email is encoded as ${username}@username.com by the create script
            searchFilter = { username: identifier.split('@')[0], password: password };
            // yes, password must be hash compared, but OK for this demo
        }

        // dump search filter
        console.info(`[login-script] search filter (username, password OK?): ${JSON.stringify(searchFilter)}`);

        // try to check if username password are good
        mongoClient
            .db(configuration.MONGO_DBNAME)
            .collection(configuration.MONGO_COLLNAME)
            .findOne(searchFilter, (mongoError, mongoUser) => {
                if (mongoError || !mongoUser) {
                    // we consider failed lookup as login failure
                    console.info(`[login-script] user login failed`);

                    // close db connection
                    mongoClient.close();

                    // error callback
                    callback(mongoError || new WrongUsernameOrPasswordError(identifier));
                } else {
                    console.info(`[login-script] query matched: ${JSON.stringify(mongoUser)}`);
                    console.info(`[login-script] user login success`);

                    // close db connection
                    mongoClient.close();
                    let profile = {
                        user_id: mongoUser._id,
                        email: mongoUser.email,
                        username: mongoUser.username
                    };

                    // dump user profile
                    console.info(`[login-script] return user profile: ${JSON.stringify(profile)}`);

                    // login success callback
                    callback(null, profile);
                }
            });
    });
}
function create(user, callback) {

    // prep conn to legacy db
    const MongoClient = require('mongodb@3.1.4').MongomongoClient;
    let mongoUri = 'mongodb+srv://';
    mongoUri += `${configuration.MONGO_USERNAME}`;
    mongoUri += `:${configuration.MONGO_PASSWORD}`;
    mongoUri += `@${configuration.MONGO_SRVNAME}`;
    mongoUri += '?retryWrites=true&w=majority';
    const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true });

    // dump incoming user object
    // this user must have email encoded as ${username}@username.com
    // their real email must be in app_metadata.real_meail
    console.info('[create-script] called with user:' + JSON.stringify(user));

    // prepare user to be inserted in legacy db
    let mongoNewUser = {
        email: user.app_metadata.real_email,
        password: user.password,
        username: user.username
    };

    // lookup filter to check if username is already taken
    // in the legacy db, email is not unique, username is
    let searchFilter = {
        username: user.username
    };

    // dump search filter
    console.info(`[create-script] search filter (check username taken?): ${JSON.stringify(searchFilter)}`);

    // connect to legacy db and fire queries
    mongoClient.connect(err => {

        if (err) console.error(`err: ${err}`);

        // try to check if username is already taken
        mongoClient.db(configuration.MONGO_DBNAME)
            .collection(configuration.MONGO_COLLNAME)
            .findOne(searchFilter, (mongoError, mongoUser) => {
                if (mongoError || mongoUser) {
                    // username already taken
                    if (mongoError) console.error(`[create-script] error: ${mongoError}`);
                    if (mongoUser) console.info(`[create-script] username already taken: ${JSON.stringify(mongoUser)}`);

                    // close db conn
                    mongoClient.close();

                    // error callback
                    callback(mongoError || new Error('that username is already taken'));
                } else {
                    // username not taken
                    console.info(`[create-script] creating new user...`);

                    // create user in legacy db
                    mongoClient.db(configuration.MONGO_DBNAME)
                        .collection(configuration.MONGO_COLLNAME)
                        .insertOne(mongoNewUser, (mongoError, mongoInserted) => {
                            if (mongoError) return callback(mongoError);

                            // clsoe db conn
                            mongoClient.close();

                            // a user was successfully created
                            console.info(`[create-script] created new user in legacy db`);

                            // success callback
                            callback(null);
                        });
                }
            });
    });
}

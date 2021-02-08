function create(user, callback) {
    const MongoClient = require('mongodb').MongoClient;
    //const mongoUri = `mongodb+srv://${configuration.MONGO_USERNAME}:${configuration.MONGO_PASSWORD}@${configuration.MONGO_SRVNAME}?retryWrites=true&w=majority`;
    //console.info('[create-script] mongoUri:' + mongoUri);
    //console.info('[create-script] MONGO_COLLNAME:' + configuration.MONGO_COLLNAME);
    //console.info('[create-script] MONGO_DBNAME:' + configuration.MONGO_DBNAME);
    //console.info('[create-script] user:' + JSON.stringify(user));
    let mongoNewUser = {
        email: user.email,
        password: user.password,
        username: user.username
    };
    let searchFilter = {
        email: user.email,
        username: user.username
    };
    const client = new MongoClient("mongodb+srv://jatin:DWYU86Vb2cy3dGi@cluster0.sxvow.mongodb.net/legacy-userstore?retryWrites=true&w=majority", { useNewUrlParser: true });
    client.connect(err => {
        console.error(`err: ${err}`);
        client.db("legacy-userstore")
            .collection("users")
            .findOne(searchFilter, (mongoError, mongoUser) => {
                if (mongoError || !!mongoUser) {
                    console.error(`[create-script] error: ${mongoError}`);
                    console.error(`[create-script] user: ${JSON.stringify(mongoUser)}`);
                    client.close();
                    //return callback(mongoError || new Error('the user already exists'));
                } else {
                    client.db("legacy-userstore")
                        .collection("users")
                        .insertOne(mongoNewUser, (mongoError, mongoInserted) => {
                            if (mongoError) return callback(mongoError);
                            client.close();
                            // A user was successfully created
                            //return callback(null);
                        });
                }
            });
    });
}

create({ email: 'hello456@example.com', username: 'hello' }, (obj) => { console.info(obj) });

function remove(id, callback) {
  // just dump the args
  console.info(`[delete-script] id: ${id}`);

  // prep conn to legacy db
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  let mongoUri = 'mongodb+srv://';
  mongoUri += `${configuration.MONGO_USERNAME}`;
  mongoUri += `:${configuration.MONGO_PASSWORD}`;
  mongoUri += `@${configuration.MONGO_SRVNAME}`;
  mongoUri += '?retryWrites=true&w=majority';
  const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true });

  // connect to legacy db and fire queries
  mongoClient.connect(err => {

    if (err) console.error(`err: ${err}`);
  
    let deleteQuery = { _id: id };
    mongoClient
      .db(configuration.MONGO_DBNAME)
      .collection(configuration.MONGO_COLLNAME)
      .updateOne(deleteQuery, (mongoError, mongoUser) => {
        if (mongoError) {
          // some error
          console.info(`[delete-script] delete failed: ${mongoError}`);

          // close db connection
          mongoClient.close();

          // error callback
          callback(new Error(`Delete Failed: ${mongoError}`));
        } else {

          // close db connection
          mongoClient.close();

          // delete user successful
          console.info(`[delete-script] delete success`);

          // success callback
          callback(null);
        }
      });
  });
}

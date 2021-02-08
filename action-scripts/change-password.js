function changePassword(identifier, newPassword, callback) {

  // just dump the args
  console.info(`[change-password script] identifier: ${identifier}`);

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

    // the email is encoded as ${username}@username.com in the corresponding request
    /* POST /tickets/password-change
    {
      "email" : "<actual-username>@username.com", <---- encoded username as email
      "connection_id": "con_xxx",
      "client_id": "ccc"
    }*/

    // initialize search filter
    let searchFilter = { username: identifier.split('@')[0] };
    let updateQuery = { $set: { password: newPassword } };
    mongoClient
      .db(configuration.MONGO_DBNAME)
      .collection(configuration.MONGO_COLLNAME)
      .updateOne(searchFilter, updateQuery, (mongoError, mongoUser) => {
        if (mongoError) {
          // some error
          console.info(`[changepwd-script] password change failed: ${mongoError}`);

          // close db connection
          mongoClient.close();

          // error callback
          callback(new Error(`Change Password Failed: ${mongoError}`));
        } else {

          // close db connection
          mongoClient.close();

          // change password successful
          console.info(`[changepwd-script] password change success: ${JSON.stringify(mongoUser)}`);

          // success callback
          callback(null, true);
        }
      });
  });
}

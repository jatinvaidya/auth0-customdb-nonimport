function getByEmail(identifier, callback) {
    console.info(`[getuser-script] identifier: ${identifier}`);
    // get-user script serves no purpose with duplicate emails and non-import mode
    // never gets called with username when db is in non-import mode <-- known defect
    // therefore, just always return user not found
    // duplicate user will NOT be created because we are handling that case in the create script
    callback(null);
}

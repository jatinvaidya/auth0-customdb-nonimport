function verify(identifier, callback) {
  console.info(`[verify-email script] identifier: ${identifier}`);

  // not supported when duplicate emails exist
  callback(new Error("not supported when duplicate emails exist"));
}

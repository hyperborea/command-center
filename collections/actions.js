Actions = new Mongo.Collection('actions');

Actions.before.insert(function (userId, doc) {
  doc.createdAt = Date.now();
  doc.output = [];
  doc.exitCode = null;
});
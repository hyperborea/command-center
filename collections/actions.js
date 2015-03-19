Actions = new Mongo.Collection('actions');

Actions.before.insert(function (userId, doc) {
  doc.createdAt = Date.now();
  doc.createdBy = userId;
  doc.output = [];
  doc.exitCode = null;
});
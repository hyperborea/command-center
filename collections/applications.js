Applications = new Mongo.Collection('applications');

Applications.before.insert(function (userId, doc) {
  doc.createdAt = Date.now();
  doc.createdBy = userId;
});

Applications.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updatedAt = Date.now();
  modifier.$set.updatedBy = userId;
});

Applications.allow({
  insert: function (userId, doc) {
    return hasRole(userId, 'admin');
  },
  update: function (userId, doc, fields, modifier) {
    return hasRole(userId, 'admin');
  },
  remove: function (userId, doc) {
    return hasRole(userId, 'admin');
  }
});
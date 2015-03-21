Applications = new Mongo.Collection('applications');


Applications.before.insert(function (userId, doc) {
  doc.createdAt = Date.now();
  doc.createdBy = userId;

  if (doc.roles) doc.roles = tokenize(doc.roles);
});

Applications.before.update(function (userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updatedAt = Date.now();
  modifier.$set.updatedBy = userId;

  if (modifier.$set.roles) modifier.$set.roles = tokenize(modifier.$set.roles);
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
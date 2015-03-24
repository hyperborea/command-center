Tasks = new Mongo.Collection('tasks');

Tasks.allow({
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
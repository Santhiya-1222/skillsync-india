// Debug helper: check Firebase initialization state
const fb = require('./firebase');
console.log('Firebase module loaded.');
console.log('admin available:', !!fb.admin);
console.log('db available:', fb.db ? 'yes' : 'no');
process.exit(0);

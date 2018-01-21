import Promise from 'bluebird';
import sqlite from 'sqlite';
 
const dbPromise = Promise.resolve()
  .then(() => sqlite.open('./database.sqlite', { Promise }))
  .then(db => db.migrate({ force: 'last' }));
 

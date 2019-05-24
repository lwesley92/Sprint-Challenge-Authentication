const db = require('../database/dbConfig.js'); 

module.exports = { 
    getUserBy, 
    addNew,
};

function getUserBy(filter) { 
    return db('users')
    .where(filter)
    .first()
}; 

function addNew(user) { 
    return db('users')
    .insert(id=> { 
        return getBy(id[0])
    });
}; 

function getById(id) { 
    return db('users')
    .where({ id })
    .first()
};
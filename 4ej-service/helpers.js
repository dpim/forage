const mongoose = require('mongoose');
const db = require('./db');
const request = require('request');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Item = require('./models/item');
const Feedback = require('./models/feedback');
const Secrets = require('./config/secrets');

const IftttStr = Secrets.iftttStr;
let { Storage } = require('@google-cloud/storage');

Storage = new Storage({
    projectId: Secrets.gcp.projectId,
    keyFilename: Secrets.gcp.keyFilename
});

const saltRounds = 5;
const boardDim = 100;
const bucketName = Secrets.gcp.bucketName;

module.exports = {
    getUsersByToken: function (token, cb) {
        let getToken = new Promise(function (resolve, reject) {
            User.findOne({
                token: token
            }, function (err, user) {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
        process.nextTick(function () {
            mongoQuery(getToken, null).then(record => {
                return cb(null, record);
            }, reason => {
                return cb(null, null);
            })
        });
    },

    addUser: function (username, email, password) {
        let addUser = new Promise(function (resolve, reject) {
            let date = new Date();
            bcrypt.hash(password, saltRounds, function (err, passwordHash) {
                bcrypt.hash(date + "" + email, saltRounds, function (err, tokenHash) {
                    User.findOne({
                        email: email
                    }, function (err, foundUser) {
                        let user = new User({
                            username: username,
                            password: passwordHash,
                            email: email,
                            dateCreated: date,
                            dateUpdated: date,
                            token: tokenHash
                        });
                        if (!foundUser || foundUser == null) {
                            user.isNew = true;
                            user.save(function (err, user) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({
                                        name: user.username,
                                        token: user.token,
                                        id: user.id
                                    });
                                }
                            });
                        } else {
                            reject("duplicate");
                        }
                    });
                });
            });
        });
        return mongoQuery(addUser, null);
    },

    login: function (email, password) {
        let getUser = new Promise(function (resolve, reject) {
            User.findOne({
                email: email
            }, function (err, user) {
                if (err || !user) {
                    reject(err);
                } else {
                    bcrypt.compare(password, user.password, function (err, res) {
                        if (res == true) {
                            resolve({
                                name: user.username,
                                token: user.token,
                                id: user.id
                            });
                        } else {
                            reject(err);
                        }
                    });
                }
            });
        });
        return mongoQuery(getUser, null);
    },

    getItems: function () {
        let getItems = new Promise(function (resolve, reject) {
            let query = Item.find({}).sort({
                createdDate: -1
            }).populate("createdByUser", "username").limit(1000);
            query.exec(function (err, items) {
                if (err) {
                    reject(err);
                } else {
                    resolve(items);
                }
            });
        });
        return mongoQuery(getItems, null);
    },

    getDetailedItem: function () {
        //tbd
    },

    //uploads a new item to google storage
    upload: function (content, type) {
        return new Promise(function (resolve, reject) {
            let date = new Date();
            bcrypt.hash(date + "ok", saltRounds, function (err, hash) {
                if (err) {
                    reject(err);
                } else {
                    let modifiedHash = "media/" + hash.replace("/", "*")
                    let contentBuff = content.split(",");
                    if (contentBuff.length > 1) {
                        contentBuff = contentBuff[1];
                    }
                    const bucket = Storage.bucket(bucketName);
                    const file = bucket.file(modifiedHash);
                    const stream = file.createWriteStream({
                        metadata: {
                            contentType: type
                        }
                    });
                    stream.on('error', (err) => {
                        reject(err);
                    });
                    stream.on('finish', () => {
                        resolve(modifiedHash);
                    });
                    stream.end(new Buffer(contentBuff, 'base64'));
                }
            });
        });
    },

    addItem: function (location, userId, name, tags, type, xCoord, yCoord, size) {
        let search = new Promise(function (resolve, reject) {
            let query = Item.findOne({
                tags: {
                    $elemMatch: {
                        $in: tags
                    }
                }
            });
            query.exec(function (err, items) {
                if (err) {
                    reject(err);
                } else {
                    resolve(items);
                }
            });
        });
        return mongoQuery(search, null).then((response) => {
            if (response == null){
                let addItem = getValidPos(xCoord, yCoord).then((validPosition) => {
                    return insertItem(location, userId, name, tags, type, validPosition.xCoordinate, validPosition.yCoordinate, size);
                });
                return mongoQuery(addItem, null);
            } else {
                //check each perturbation
                let possibility= perturb(response.xCoordinate, response.yCoordinate);
                let findValidNeighbors = new Promise(function (resolve, reject) {
                    let query = Item.find({
                        coordCode: {
                            $eq: possibility
                        }
                    });
                    query.exec(function (err, items) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(items);
                        }
                    });
                });
                return mongoQuery(findValidNeighbors, null).then((response) => {
                    if (response != null && response.length > 0){
                        let addItem = getValidPos(xCoord, yCoord).then((validPosition) => {
                            return insertItem(location, userId, name, tags, type, validPosition.xCoordinate, validPosition.yCoordinate, size);
                        });
                    } else {
                        let parts = possibility.split("|");
                        let xCoordinate = parts[0];
                        let yCoordinate = parts[1];
                        return insertItem(location, userId, name, tags, type, xCoordinate, yCoordinate, size);
                    }
                });
            }
        }).catch(reason => {
            return new Promise(function (resolve, reject) {
                reject(reason);
            });
        });
    },

    deleteItem: function (userId, itemId) {
        let deleteItem = new Promise(function (resolve, reject) {
            Item.findOneAndRemove({
                _id: itemId,
                createdByUser: userId
            }, function (err, item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(item);
                }
            });
        });
        return mongoQuery(deleteItem, null);
    },

    addUpvote: function (userId, itemId) {
        let addUpvote = new Promise(function (resolve, reject) {
            Item.findByIdAndUpdate(
                itemId, {
                    $addToSet: {
                        "upvotedByUserId": userId
                    }
                }, {
                    upsert: true,
                    new: true
                },
                function (err, item) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(item);
                    }
                }
            );
        });
        return mongoQuery(addUpvote, null);
    },

    removeUpvote: function (userId, itemId) {
        let deleteUpvote = new Promise(function (resolve, reject) {
            Item.findByIdAndUpdate(
                itemId, {
                    $pull: {
                        "upvotedByUserId": userId
                    }
                }, {
                    new: true
                },
                function (err, item) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(item);
                    }
                }
            );
        });
        return mongoQuery(deleteUpvote, null);
    },

    addFeedback: function (email, text) {
        let addFeedback = new Promise(function (resolve, reject) {
            let feedback = new Feedback({
                email: email,
                text: text
            });
            feedback.save(function (err, feedback) {
                if (err) {
                    reject(err);
                } else {
                    resolve(feedback);
                }
            });
        });
        return mongoQuery(addFeedback, null);
    },

    search: function (text) {
        let search = new Promise(function (resolve, reject) {
            let query = Item.find({
                tags: {
                    $elemMatch: {
                        $eq: text
                    }
                }
            }).sort({
                createdDate: -1
            }).populate("createdByUser", "username").limit(1000);
            query.exec(function (err, items) {
                if (err) {
                    reject(err);
                } else {
                    resolve(items);
                }
            });
        });
        return mongoQuery(search, null);
    },

    report: function (itemId) {
        return new Promise(function (resolve, reject) {
            let date = new Date();
            //console.log("HERE");
            request({
                url: IftttStr,
                method: 'POST',
                json: {
                    "value1": itemId,
                    "value2": date
                },
            }, function (err, response, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    }
}

function mongoQuery(query, params) {
    return new Promise(function (resolve, reject) {
        query.then(result => {
            resolve(result);
        }).catch(reason => {
            console.log(reason);
            reject(reason);
        });
    });
}

function getValidPos(xCoordinate, yCoordinate) {
    return new Promise(function (resolve, reject) {
        let valid = false;
        if (xCoordinate == null) {
            xCoordinate = getRandomPos();
        }
        if (yCoordinate == null) {
            yCoordinate = getRandomPos();
        }
        Item.find({
            "xCoordinate": xCoordinate,
            "yCoordinate": yCoordinate
        }, function (err, items) {
            if (err || (items && items.length > 0)) {
                return getValidPos(xCoordinate, yCoordinate);
            } else {
                resolve({
                    "xCoordinate": xCoordinate,
                    "yCoordinate": yCoordinate
                });
            }
        });
    });
}

function getRandomPos() {
    return Math.floor(Math.random() * (boardDim + 1));
}

function perturb(x, y){
    let possibilities = [];
    if (x+1 < boardDim){
        possibilities.push((x+1)+"|"+(y));
    }
    if (x-1 >= 0){
        possibilities.push((x-1)+"|"+(y));
    }
    if (y-1 >= 0){
        possibilities.push((x)+"|"+(y-1));
    }
    if (y+1 < boardDim){
        possibilities.push((x)+"|"+(y+1));
    }
    if (x+1 < boardDim && y-1 >= 0){
        possibilities.push((x+1)+"|"+(y-1));
    }
    if (y+1 < boardDim && x-1 >= 0){
        possibilities.push((x-1)+"|"+(y+1));
    }
    if (x+1 < boardDim && y+1 < boardDim){
        possibilities.push((x+1)+"|"+(y+1));
    }
    if (x-1 >= 0 && y-1 >= 0){
        possibilities.push((x-1)+"|"+(y-1));
    }
    let randomIdx = Math.floor(Math.random()*possibilities.length);
    return possibilities[randomIdx]; 
}

function insertItem(location, userId, name, tags, type, validXCoordinate, validYCoordinate, size){
    return new Promise(function (resolve, reject) {
        let date = new Date();
        let item = new Item({
            location: location,
            size: size,
            name: name,
            tags: tags,
            createdDate: date,
            lastUpdatedDate: date,
            createdByUser: userId,
            type: type,
            xCoordinate: validXCoordinate,
            yCoordinate: validYCoordinate,
            coordCode: validXCoordinate+"|"+validYCoordinate
        });
        item.save(function (err, item) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    item
                });
            }
        });
    });
}
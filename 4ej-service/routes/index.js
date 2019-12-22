const express = require('express');

const router = express.Router();
const passport = require('passport');
const helper = require('../helpers');

router.get('/test', 
     passport.authenticate('bearer', { session: false }),
     function (req, res) {
        res.send("test request received");
});

router.post('/register', function(req, res){
    if (req.body == null){
        res.status(400).send("bad request");
    }
    helper.addUser(req.body.username, req.body.email, req.body.password).then(response => {
        if (response){
            res.send(response);
        } else {
            res.status(500).send("internal error");
        }
    }).catch(reason => {
        res.status(500).send("internal error");
    });
});

router.post('/login', function(req, res){
    if (req.body == null){
        res.status(400).send("bad request");
    }
    helper.login( req.body.email, req.body.password).then(response => {
        if (response){
            res.send(response);
        } else {
            res.status(500).send("internal error");
        }
    }).catch(reason => {
        res.status(500).send("internal error");
    });
});

//get generic items
router.get('/items', function (req, res) {
    let searchStr = req.query.search;
    if (searchStr == null){
        helper.getItems().then(response => {
            if (response){
                res.send(response);
            } else {
                res.status(500).send("internal error");
            }
        }).catch(reason => {
            res.status(500).send("internal error");
        });
    } else {
        helper.search(searchStr).then(response => {
            if (response){
                res.send(response);
            } else {
                res.status(500).send("internal error");
            }
        }).catch(reason => {
            res.status(500).send("internal error");
        });
    }
});

router.post('/items', 
     passport.authenticate('bearer', { session: false }),
     function (req, res) {
        if (req.body == null){
            res.status(400).send("bad request");
        }
        let content = req.body.content;
        //upload then add item
        helper.upload(req.body.content, req.body.type).then(value => {
            let tags = req.body.tags.split(",");
            let accumulation = [];
            for (tag of tags){
                let parts = tag.split(" ");
                accumulation = accumulation.concat(parts);
            }
            tags = tags.concat(accumulation);
            tags = tags.map(tag => {
                return tag.trim()
            });
            tags = tags.filter(String);
            helper.addItem(value, req.user.id, 
                req.body.name, 
                tags,   
                req.body.type, req.body.x, req.body.y,
                req.body.size).then(response => {
                    if (response){
                        res.send(response);
                    } else {
                        res.status(500).send("internal error");
                    }
        });
    }).catch(reason=>{
        res.status(400).send("bad request");
    });
});

router.delete('/items/:item', 
     passport.authenticate('bearer', { session: false }),
     function (req, res) {
        helper.deleteItem(req.user.id, req.params.item).then(response => {
        if (response){
            res.send(response);
        } else {
            res.status(500).send("internal error");
        }
    }).catch(reason => {
        res.status(400).send("bad request");
    });
});

router.post('/items/:item/upvotes', 
     passport.authenticate('bearer', { session: false }),
     function (req, res) {
        helper.addUpvote(req.user.id, req.params.item).then(response => {
        if (response){
            res.send(response);
        } else {
            res.status(500).send("internal error");
        }
    }).catch(reason => {
        res.status(400).send("bad request");
    });
});

router.post('/items/:item/report', 
     function (req, res) {
        helper.report(req.params.item).then(response => {
        if (response){
            res.send(response);
        } else {
            res.status(500).send("internal error");
        }
    }).catch(reason => {
        res.status(400).send("bad request");
    });
});

router.delete('/items/:item/upvotes',
    passport.authenticate('bearer', { session: false }),
     function (req, res) {
        helper.removeUpvote(req.user.id, req.params.item).then(response => {
        if (response){
            res.send(response);
        } else {
            res.status(500).send("internal error");
        }
    }).catch(reason => {
        res.status(400).send("bad request");
    });
});

router.post('/feedback', 
     function (req, res) {
        if (req.body == null){
            res.status(400).send("bad request");
        }
        helper.addFeedback(req.body.text, req.body.email).then(response => {
        if (response){
            res.send(response);
        } else {
            res.status(500).send("internal error");
        }
    }).catch(reason=>{
        res.status(500).send("internal error");
    });
});

module.exports = router;

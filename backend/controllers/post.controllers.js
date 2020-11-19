const conn = require('../models/db');
const fs = require('fs');

exports.createPost = (req, res, next) => {
    const postObject = req.file ?
    {
        ...JSON.parse(req.body.post),
        postMedia: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body.post,
        postMedia: null
    };
    conn.execute('INSERT INTO Posts VALUES (NULL, ?, ?, ?);', [postObject.userId, postObject.postContent, postObject.postMedia], (err, rows, fields) => {
        if(err) return res.status(400).json({ err });
        res.status(201).json({ message: "Post with media created successfully." });
    });
};

exports.readAllPosts = (req, res, next) => {
    conn.execute('SELECT p.*, u.userName FROM Posts p inner join Users u on p.userId = u.id;', (err, rows, fields) => {
        if(err) {
            return res.status(400).json({ err });
        };
        res.status(200).json(rows);
    });
};

exports.updatePost = (req, res, next) => {
    const postObject = req.file ?
    {
        ...JSON.parse(req.body.post),
        postMedia: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body.post,
        postMedia: null 
    };
    conn.execute('SELECT * FROM Posts WHERE id= ?;', [req.params.id], (selectErr, selectRows, selectFields) => {
        if(selectErr) return res.status(400).json({ selectErr });
        if(req.file = true && selectRows[0].postMedia != null) {
            const filename = selectRows[0].postMedia.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                conn.execute('UPDATE Posts SET postContent= ?, postMedia= ? WHERE id= ?;', [postObject.postContent, postObject.postMedia, req.params.id], (updateErr, updateRows, updateFields) => {
                    if(updateErr) return res.status(400).json({ updateErr });
                    res.status(200).json({ message: "Post successfully modified. Old media deleted." });
                });
            });
        } else {
            conn.execute('UPDATE Posts SET postContent= ?, postMedia= ? WHERE id= ?;', [postObject.postContent, postObject.postMedia, req.params.id], (updateErr, updateRows, updateFields) => {
                if(updateErr) return res.status(400).json({ updateErr });
                res.status(200).json({ message: "Post successfully modified." });
            });
        };
    });
};

exports.deletePost = (req, res, next) => {
    conn.execute('SELECT * FROM Posts WHERE id= ?;', [req.params.id], (selectErr, selectRows, selectFields) => {
        if(selectErr) return res.status(400).json({ selectErr });
        if(selectRows[0].postMedia != null) {
            const filename = selectRows[0].postMedia.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                conn.execute('DELETE FROM Posts WHERE id= ?;', [req.params.id], (deleteErr, deleteRows, deleteFields) => {
                    if(deleteErr) return res.status(400).json({ deleteErr });
                    res.status(200).json({ message: "Post and media successfully deleted." });
                });
            });
        } else {
            conn.execute('DELETE FROM Posts WHERE id= ?;', [req.params.id], (deleteErr, deleteRows, deleteFields) => {
                if(deleteErr) return res.status(400).json({ deleteErr });
                res.status(200).json({ message: "Post successfully deleted." });
            });
        };
    });
};
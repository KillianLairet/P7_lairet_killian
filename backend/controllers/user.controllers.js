const conn = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            req.body.password = hash;
            conn.execute('INSERT INTO Users VALUES (NULL, ?, ?, ?, NULL);', [req.body.email, hash, req.body.userName], (err, rows, fiedls) => {
                if(err) {
                    return res.status(400).json({ err });
                };
                res.status(201).json({ message: "User created successfully." });
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    conn.execute('SELECT * FROM Users WHERE email= ?', [req.body.email], (err, rows, fiedls) => {
        if(err) {
            return res.status(401).json({ error: "User not found." });
        };
        bcrypt.compare(req.body.password, rows[0].password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({ error: "Wrong password." });
                };
                res.status(200).json({
                    userId: rows[0].id,
                    email: rows[0].email,
                    token: jwt.sign(
                        { userId: rows[0].id },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    });
};

exports.readUser = (req, res, next) => {
    conn.execute('SELECT id, email, userName, profilePhoto FROM Users WHERE id= ?', [req.params.id], (err, rows, fiedls) => {
        if(err) {
            return res.status(404).json({ err });
        };
        res.status(200).json(rows);
    });
};

exports.updateUser = (req, res, next) => {
    const userObject = req.file ?
    {
        ...JSON.parse(req.body.user),
        profilePhoto: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        userName: req.body.user.userName,
        profilePhoto: null 
    };
    conn.execute('SELECT * FROM Users WHERE id= ?;', [req.params.id], (selectErr, selectRows, selectFields) => {
        if(selectErr) return res.status(400).json({ selectErr });
        if(req.file = true && selectRows[0].profilePhoto != null) {
            const filename = selectRows[0].profilePhoto.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                conn.execute('UPDATE Users SET userName= ?, profilePhoto= ? WHERE id= ?;', [userObject.userName, userObject.profilePhoto, req.params.id], (updateErr, updateRows, updateFields) => {
                    if(updateErr) return res.status(400).json({ updateErr });
                    res.status(200).json({ message: "User successfully modified. Old profile photo deleted." });
                });
            });
        } else {
            conn.execute('UPDATE Users SET userName= ?, profilePhoto= ? WHERE id= ?;', [userObject.userName, userObject.profilePhoto, req.params.id], (updateErr, updateRows, updateFields) => {
                if(updateErr) return res.status(400).json({ updateErr });
                res.status(200).json({ message: "User successfully modified." });
            });
        };
    });
};

exports.deleteUser = (req, res, next) => {
    conn.execute('SELECT * FROM Users WHERE id= ?;', [req.params.id], (selectErr, selectRows, selectFields) => {
        if(selectErr) return res.status(400).json({ selectErr });
        if(selectRows[0].profilePhoto != null) {
            const filename = selectRows[0].profilePhoto.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                conn.execute('DELETE FROM Users WHERE id= ?;', [req.params.id], (deleteErr, deleteRows, deleteFields) => {
                    if(deleteErr) return res.status(400).json({ deleteErr });
                    res.status(200).json({ message: "User and profile photo successfully deleted." });
                });
            });
        } else {
            conn.execute('DELETE FROM Users WHERE id= ?;', [req.params.id], (deleteErr, deleteRows, deleteFields) => {
                if(deleteErr) return res.status(400).json({ deleteErr });
                res.status(200).json({ message: "User successfully deleted." });
            });
        };
    });
};
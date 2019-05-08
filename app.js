const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

//test api
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

//protected route
app.post('/api/posts', verifyToken, (req, res) => {
    //verify token
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            //console.log(localStorage.getItem('token'));
            res.json({
                message: 'Post Created...',
                authData
            });
        }
    });
});

//login route with mock data
app.post('/api/login', (req, res) => {
    //mock user
    const user = {
        id: 1,
        username: 'jaydon',
        email: 'jaydon@gmail.com'
    };

    //payload: user, secret key, callback(for async)
    jwt.sign({ user: user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        //localStorage.setItem('token', token);
        res.json({
            token: token
        });
    });
});

//FORMAT OF TOKEN
//Authorization: Bearer <access_token>

//verify token middleware function
function verifyToken(req, res, next) {
    //get auth header value
    //when token is sent, send it in the header

    //get token
    const bearerHeader = req.headers['authorization'];

    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //take token out of bearer
        //split at the space, turn into array
        const bearer = bearerHeader.split(' ');

        //get token from array
        const bearerToken = bearer[1];

        //set the token
        req.token = bearerToken;

        //next middleware
        next();
    } else {
        //forbidden
        res.sendStatus(403);
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running On Port: ${PORT}`));





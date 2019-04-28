const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('./public'));
app.use(bodyParser.json());


var masSymbol = [];


const SYMBOLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function getRandomNumber(max) {
    return Math.trunc(Math.random() * max);
}

function getUID(id) {
    let uid = '' + id;
    for (let i = 1; i <= 5; i++)
        uid += SYMBOLS[getRandomNumber(SYMBOLS.length)];
    return uid;
}

function getFullName(user) {
    let fullName = '';
    if (user.lastName && user.name)
        return `${user.lastName} ${user.name}`;
    else if (user.lastName)
        return user.lastName;
    else if (user.name)
        return user.name;
    else
        return 'Unknown';
}

function asyncRead(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
};


// ---USERS---
app.use('/users', async (req, res, next) => {
    req.users = await asyncRead('./db/users.json');
    next();
});

app.get('/users/:id', (req, res) => {
    const users = req.users;
    const finded = users.find((item) => item.id === req.params.id);
    res.send(finded);
});

app.post('/users', (req, res) => {
    const users = req.users;
    const finded = users.find((item) => item.email === req.body.email);

    //Почта уже существует
    if (finded) {
        if (req.body.new === true) {
            const errorMsg = 'Error! E-mail is already taken';
            console.log(errorMsg);
            res.send({ error: true, errorMsg });
        } else {
            //Вход в аккаунт
            if (finded.password === req.body.password) {
                req.body.id = finded.id;
                res.send({error: false, user: req.body});
            } else {
                const errorMsg = 'Error! Wrong password or e-mail';
                console.log(errorMsg);
                res.send({ error: true, errorMsg });
            }
        };
    };

    if (!finded) {
        if (req.body.new === true) {
            //Создание аккаунта
            req.body.id = getUID(users.length);
            delete req.body.new;
            users.push(req.body);
            fs.writeFile('./db/users.json', JSON.stringify(users), () => {
                res.send({error: false, user: req.body});
            });
        } else {
            const errorMsg = 'Error! Wrong password or e-mail';
            console.log(errorMsg);
            res.send({ error: true, errorMsg });
        };
    };
});

app.patch('/users', (req, res) => {
    let users = req.users;

    users = users.map((item) => {
        if (item.id === req.body.id) {
            return { ...item,
                ...req.body
            };
        }
        return item;
    });

    fs.writeFile('./db/users.json', JSON.stringify(users), () => {
        const updated = users.find((item) => item.id === req.body.id);
        res.send(updated);
    });
});


// ---CATALOG---
app.use('/catalog', async (req, res, next) => {
    req.catalog = await asyncRead('./db/catalog.json');
    next();
});

app.get('/catalog/:id', (req, res) => {
    const PRODUCTS_OF_PAGE = 9;
    let catalog = req.catalog;
    const page = +req.params.id;
    
    const totalPages = Math.ceil( catalog.length / PRODUCTS_OF_PAGE);
    catalog = catalog.splice((page-1)*PRODUCTS_OF_PAGE, PRODUCTS_OF_PAGE);
    
    res.send({totalPages, catalog});
});

/*
app.post('/catalog', (req, res) => {
    fs.writeFile('./db/catalog.json', JSON.stringify(req.body), () => {
        res.send(req.body);
    });
});
*/


// ---CART---
app.use('/cart', async (req, res, next) => {
    req.cart = await asyncRead('./db/cart.json');
    next();
});

app.get('/cart', (req, res) => {
    res.send(req.cart);
});

app.post('/cart', (req, res) => {
    const cart = req.cart;
    cart.push(req.body);
    fs.writeFile('./db/cart.json', JSON.stringify(cart), () => {
        res.send(req.body);
        //addStat('POST', req.body.name);
    });
});

app.patch('/cart/:id', (req, res) => {
    let cart = req.cart;
    cart = cart.map((item) => {
        if (item.id === req.params.id) {
            return { ...item, ...req.body};
        }
        return item;
    });
    
    fs.writeFile('./db/cart.json', JSON.stringify(cart), () => {
        const updated = cart.find((item) => item.id === req.params.id);
        res.send(updated);
    });
});

app.delete('/cart/:id', (req, res) => {
    const cart = req.cart;
    const deleted = cart.find((item) => item.id === req.params.id);
    cart.splice(cart.findIndex((item) => item.id === req.params.id), 1);
    
    fs.writeFile('./db/cart.json', JSON.stringify(cart), () => {
        res.send(deleted.id);
    });
});


// ---FEEDBACK---
app.use('/feedback', async (req, res, next) => {
    req.feedback = await asyncRead('./db/feedback.json');
    req.users = await asyncRead('./db/users.json');
    next();
});

app.get('/feedback/:id', (req, res) => {
    const messages = req.feedback;
    const users = req.users;
    
    //Вывод одобренных комментариев
    if (req.params.id === '0') {
        let feedback = messages.filter((item) => item.onmod === false);
        feedBackLength = feedback.length;
        let comments = [];
        if (feedBackLength > 3) {
            while (comments.length < 3) {
                comments.push(feedback[getRandomNumber(feedBackLength)]);
            }
        } else {
            comments = feedback;
        }
        
        comments = comments.map((item) => {
            const user = users.find((user) => user.id === item.id); 
            return { message: item.message, user: getFullName(user)};
        });
        
        res.send(comments);
        return;
    }
    
    
    const user = users.find((item) => item.id === req.params.id);
    const finded = messages.find((item) => item.id === req.params.id);
    
    let comments = [];
    const moderator = user.char === 'moderator';
    if (moderator) {
        comments = messages.filter((item) => item.onmod === true);
        comments = comments.map((item) => {return item.message});
    };
    
    if (finded)
        res.send({message: finded.message, moderator, comments});
    else
        res.send({message: '', moderator, comments});
});

app.delete('/feedback/:id', (req, res) => {
    let messages = req.feedback;
    messages = messages.filter((item) => item.id !== req.params.id);
    fs.writeFile('./db/feedback.json', JSON.stringify(messages), () => {
        res.send('');
    });
});

app.patch('/feedback/:id', (req, res) => {
    let messages = req.feedback;
    const users = req.users;
    
    const user = users.find((item) => item.id === req.params.id);
    if (user.char !== 'moderator') {
        res.send([]);
        return;
    }
    
    if (req.body.method === 'DELETE')
        messages = messages.filter((item) => item.message !== req.body.comment);
    else
        messages = messages.map((item) => {
            if (item.message === req.body.comment)
                return { ...item, onmod: false};
            return item;
        });
    let comments = messages.filter((item) => item.onmod === true);
    comments = comments.map((item) => {return item.message});

    fs.writeFile('./db/feedback.json', JSON.stringify(messages), () => res.send(comments));
});

app.post('/feedback', async (req, res) => {
    const users = req.users;
    const user = users.find((item) => item.id === req.body.id);
    if (!user) {
        res.status(403).send({message: '', });
        return;
    };
    
    let messages = req.feedback;
    const finded = messages.find((item) => item.id === req.body.id);
    
    if (finded) {
        if (finded.message === req.body.message) {
            res.send(finded);
        } else {
            req.body.onmod = true;
            messages = messages.map((item) => {
                if (item.id === req.body.id) {
                    return { ...item, ...req.body};
                };
                return item;
            });
            fs.writeFile('./db/feedback.json', JSON.stringify(messages), () => {
                res.send(req.body);
            });
        }
    } else {
        req.body.onmod = true;
        messages.push(req.body);
        fs.writeFile('./db/feedback.json', JSON.stringify(messages), () => {
            res.send(req.body);
        });
    }
});

app.listen(3000, () => {
    console.log('Server has been started');
});

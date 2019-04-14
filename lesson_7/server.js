const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('./public'));
app.use(bodyParser.json());


function currentTime() {
    const CurDate = new Date;
    return `${CurDate.getHours()}:${CurDate.getMinutes()}:${CurDate.getSeconds()} ${CurDate.getDate()}-${CurDate.getMonth()+1}-${CurDate.getFullYear()}`
}

function addStat(method, product) {
    fs.readFile('./db/stats.json', 'utf-8', (err, data) => {
    if(err) {
        console.error(err);
        res.send('Произошла ошибка');
    }

    const statFile = JSON.parse(data);
    statFile.push({time: currentTime(), method, product});
    fs.writeFile('./db/stats.json', JSON.stringify(statFile), () => {console.log('Добавлена запись в stats.json')});
  });
}


app.get('/catalog', (req, res) => {
  fs.readFile('./db/catalog.json', 'utf-8', (err, data) => {
    if(err) {
      console.error(err);
      res.send('Произошла ошибка');
    }
      
    const catalog = JSON.parse(data);

    res.send(data);
  });
});

app.get('/cart', (req, res) => {
  fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if(err) {
      console.error(err);
      res.send('Произошла ошибка');
    };
      
    res.send(data); 
  });
});

app.post('/cart', (req, res) => {
  fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if(err) {
      console.error(err);
      res.send('Произошла ошибка');
    }

    const cart = JSON.parse(data);
    cart.push(req.body);
    fs.writeFile('./db/cart.json', JSON.stringify(cart), () => {
        res.send(req.body);
        addStat('POST', req.body.name);
    });
  });
});

app.patch('/cart/:id', (req, res) => {
  fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if(err) {
      console.error(err);
      res.send('Произошла ошибка');
    }

    let cart = JSON.parse(data);
    
    cart = cart.map((item) => {
      if(item.id === req.params.id) {
        return {...item, ...req.body};
      }

      return item;
    });

    fs.writeFile('./db/cart.json', JSON.stringify(cart), () => {
        let updated = cart.find((item) => item.id === req.params.id);
        res.send(updated);
        addStat('PATCH', updated.name);
    });
  });
});

app.delete('/cart/:id', (req, res) => {
  fs.readFile('./db/cart.json', 'utf-8', (err, data) => {
    if(err) {
      console.error(err);
      res.send('Произошла ошибка');
    }
      
    const cart = JSON.parse(data);
    let deleted = cart.find((item) => item.id === req.params.id);
    cart.splice(cart.findIndex((item) => item.id === req.params.id), 1);

    fs.writeFile('./db/cart.json', JSON.stringify(cart), () => {
        res.send(deleted.id);
        addStat('DELETE', deleted.name);
    });
  });
});

app.listen(3000, () => {
  console.log('Server has been started');
});
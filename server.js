const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Room = require('./models/room');
const errHandle = require('./errorHandle');
const headers = require('./headers');

dotenv.config({
  path: './config.env',
});

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

// 連接資料庫
mongoose
  .connect(DB)
  .then(() => {
    console.log('資料庫連線成功');
  })
  .catch((error) => {
    console.log(error.reason);
  });

const requestListener = async (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === '/rooms' && req.method === 'GET') {
    const rooms = await Room.find();
    res.writeHead(200, headers);
    // 把 JS 的物件轉成 JSON 格式的字串，網路才能解析
    res.write(
      JSON.stringify({
        status: 'success',
        rooms,
      })
    );
    res.end();
  } else if (req.url === '/rooms' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);

        const newRoom = await Room.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        });

        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            rooms: newRoom,
          })
        );
        res.end();
      } catch (err) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'false',
            message: '欄位不正確，或沒有此 ID',
            error: err,
          })
        );
        console.log('err', err);
        res.end();
      }
    });
  } else if (req.url === '/rooms' && req.method === 'DELETE') {
    // const rooms = await Room.deleteMany({});
    // 沒有要使用到 rooms 的話也可以直接這樣寫就好：
    await Room.deleteMany({});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        rooms: [],
      })
    );
    res.end();
  } else if (req.url.startsWith('/rooms/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();

    await Room.findByIdAndDelete(id);

    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        message: '刪除成功',
      })
    );
    res.end();
  } else if (req.url.startsWith('/rooms/') && req.method === 'PUT') {
    const id = req.url.split('/').pop();
    await Room.findByIdAndUpdate(id, {
      name: '海賊王雙人房',
    });
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        message: '編輯成功',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);

// heroku 不認得 3005，第一個表達式會指向 heroku 自己的環境變數
server.listen(process.env.PORT || 3005);

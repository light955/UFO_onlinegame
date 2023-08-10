const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIo(server);
const PORT = 3000;
let count = 0;
let red_rect_count = 0;
let XX;
let YY;
let players = {};

class Player {
  constructor() {
    this.id = Math.floor(Math.random() * 1000)
    this.textid = Math.floor(Math.random() * 1000)
    this.x = Math.floor(Math.random() * 500)
    this.y = Math.floor(Math.random() * 500)
    //this.x = 0
    //this.y = 0
  }
  rightmove(){
    this.y+=3;
  }
  leftmove(){
    this.y-=3;
  }
  topmove(){
    this.x+=3;
  }
  bottommove(){
    this.x-=3;
  }



}


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

//最初に接続(サーバーはどのブラウザが移動したり閉じたり認識できるよ!)
io.on('connection', (socket) => {
  console.log('user connected');
  let player;
  //チェックインしたら下が実行されるよ(楽しんでね!!)
  socket.on('check', (check) => {
    //座標をランダムに取得するよ!!
    player = new Player();
    players[player.id] = player
    console.log(players)
    io.emit('receive_check', players, check);
  });
  //chatを送ったら実行されるよ(会話してね!!)
  socket.on('send_chat', (chat) => {
    //いったんcount作るよ!!
    console.log(chat);
    io.emit('receive_chat', chat);
  });

  //右方向に移動する
  socket.on('right', () => {
    player.rightmove();
    players[player.id] = player
    console.log(players)
    io.emit('to_move', players);
  })
  //左方向に移動する
  socket.on('left', () => {
    player.leftmove();
    players[player.id] = player
    console.log(players)
    io.emit('to_move', players);
  })
  //上方向に移動する
  socket.on('top', () => {
    player.topmove();
    players[player.id] = player
    console.log(players)
    io.emit('to_move', players);
  })
    //下方向に移動する
    socket.on('bottom', () => {
      player.bottommove();
      players[player.id] = player
      console.log(players)
      io.emit('to_move', players);
    })

    //一人称画面
    socket.on('camerafirstperson',()=>{
      XX = player.x + 50;
      YY = player.y + 50;
      //このemitは同期させてないよ!!(一人称画面だからね)
      socket.emit('camerafirstperson_receive',XX,YY)
    })
  



  //画面が閉じられたら実行される関数
  socket.on('disconnect', () => {
    console.log("削除したばい")
  });

});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});



for(let i = 0;i < 2;i++) {
  var rikito = i;
  var rikito = i;
  console.log(rikito);
}


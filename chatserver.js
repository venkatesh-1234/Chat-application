var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('./mysql.js');
app.get('/', function(req, res) {
   res.sendfile('index.html');
});
users = [];
socketstore=[];
io.on('connection', function(socket) {
   socket.on('setUsername', function(data) {
      socket.username = data;
      socketstore.push(socket);
      if(!data){
         socket.emit('empty','username is empty');
      }
      else if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is already taken! Try some other username.');
      } else {
         users.push(data);
         io.sockets.emit('array',users);
         socket.emit('userSet', {username: data});
      }
   }); 
   socket.on('disconnect',function(){
      users.forEach(function(user){
         if(user==socket.username){
         users.splice(users.indexOf(user),1);
         console.log(users)
      }
      })
      socketstore.forEach(function(removesocket){
         if(removesocket.username==socket.username){
         socketstore.splice(removesocket,1);
      }
      })
      io.sockets.emit('array',users);
      io.sockets.emit('disconnect',socket.username);
       console.log(socket.username,'  is  disconnected')
   })
   socket.on('msg', function(data) {
      if (data.send){
         var persons=data.send.split(',')
         if(persons.length==1){
      if(data.send=="all"){
      io.sockets.emit('newmsg', data);
      mysql.send(data);
      }
      else  {
   socketstore.forEach(function(tempsocket){
      if(tempsocket.username==data.send)
         tempsocket.emit("newmsg",data);
      mysql.send(data);
   });
      }}
      else if(persons.length>1){
         persons.forEach(function(singleuser){
         socketstore.forEach(function(tempsocket){
            if(tempsocket.username==singleuser){
            tempsocket.emit("newmsg",data);
         mysql.send(data);
            }})})
      }}
   });
   socket.on("conmsg",function(condata){
      socket.emit("welcomemsg",condata);
      io.sockets.emit("conmsg",condata);
      console.log(condata,'is connected')
   })
});
http.listen(8080, function() {
   console.log('listening on localhost:8080');
});

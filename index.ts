import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path';



const publicDir = p.resolve(__dirname, 'public');//当前目录下的public文件夹

const server = http.createServer();

server.on('request', (request: IncomingMessage, response: ServerResponse) => { //如果有人发请求
   if(request.method !== 'GET'){ //处理非GET请求
     response.statusCode =405;
     response.end()
   }
  const myURL = new URL(request.url, `http://${request.headers.host}`); //myURl 得到的结果是 /index.html?q=1
  const path = myURL.pathname; //path 得到的结果是 /index.html

  let fileName = path.substr(1); // /index.html => index.html

  if(fileName === ''){ //首页处理
    fileName = 'index.html'
  }

  const type=fileName.split('.')[1]

  response.setHeader('Content-Type', `text/${type} ;charset=utf-8`); //设置响应头
  fs.readFile(p.resolve(publicDir, fileName), (error, data) => { //读取public目录下的index.html文件
    if (error) {
      if(error.errno === -4058){
        response.statusCode = 404;
        response.setHeader('Content-Type', `text/html ;charset=utf-8`); //设置响应头
        fs.readFile(p.resolve(publicDir,'404.html'),(error,data)=>{
          response.end(data)
        })
      }else if(error.errno === -4068){
        response.statusCode =403;
        response.end('无权访问此目录')
      }else {
        response.statusCode = 500
        response.end('服务器繁忙，请稍后再试')
      }
    } else {
      response.setHeader('Cache-Control','public, max-age=31536000') //设置静态缓存
      response.end(data);// 响应体
    }

  });


});

server.listen(8888); //监听 8888 端口
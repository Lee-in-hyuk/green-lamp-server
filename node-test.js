//node는 Common JS를 사용함
//import할 때 require를 사용

const http = require('http');
const hostname = "127.0.0.1"; //127.0.0.1은 localhost와 같다. '내컴퓨터' 주소를 의미함.
const port = 8080;

//서버 만들기 createServer
const server = http.createServer(function(req,res){
    //요청되는 정보 = req
    //응답하는 정보 = res
    const path = req.url; //'/favicon.ico'가 찍힘
    const method = req.method; //'GET'이 찍힘
    if( path === "/products") {
        if(method === "GET"){
            //응답을 보낼 때 json객체타입을 헤더에 보내겠다.
            res.writeHead(200, {'Content-Type':'application/json'})
            const products = JSON.stringify([ //JSON이라는 객체를 문자로 바꿔주기 위해 stringify를 작성
                {
                    name: "거실조명",
                    price: 50000
                }
            ])
            res.end(products);
        } else if (method === "POST"){
            res.end("생성되었습니다.");
        }
    }
    console.log('요청하는 정보 : ',req);
    // res.end("Hello Client");
})

//
server.listen(port, hostname);
console.log('그린 조명 서버 on!');
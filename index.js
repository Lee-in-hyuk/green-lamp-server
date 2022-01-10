const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080; //포트번호는 지정할 수 있음
const models = require('./models');
app.use(cors());
//해당 파일을 보여줄 때 입력한 경로대로 보여주기 위해 세팅 (경로는 client에 index/upload에서 40번째 줄-삼항연산자에 있는 URL)
app.use("/upload",express.static("upload"));
//업로드 이미지를 관리하는 스토리지 서버로 멀터를 사용하겠다.
const multer = require('multer');
//이미지 파일이 오면 어디에 저장할건지 지정
const upload = multer({
    storage: multer.diskStorage({
        destination:function(req, file, cd) {
            //어디에 저장할건지 지정
            cd(null, 'upload/')
        },
        filename: function( req, file, cd){
            //파일을 어떤 이름으로 저장할건지 지정
            //파일에 있는 원본 이름으로 저장하겠다.
            cd(null, file.originalname)
        }
    })
});

//json형식의 데이터를 처리할 수 있게 설정하는 코드
app.use(express.json());
//브라우저의 CORS이슈를 막기 위해 사용하는 코드
app.use(cors());

//get방식 응답 지정
// client main폴더의 index.js에서 10번째줄(axios.get)이 get(요청)을 하면 
//여기 server에서 /products로 요청을 하면 아레에 있는 함수들을 보내주겠다는 내용
app.get('/products',async(req,res)=>{
    console.log('aaaaa');
    //get방식 쿼리 데이터 전송
    const queryString = req.query;
    // console.log(queryString.id);
    // console.log(queryString.name);

    // ※ 데이터베이스 조회하기
    // findAll - 전체항목 조회(쿼리를 작성하지 않고 select * 를 해줌.) / findOne - 하나만 조회
    // 조건 지정할 수 있음
    // limit로 항목갯수 지정
    // order - 정렬변경
    // attributes - 원하는 컬럼만 선택
    models.Products.findAll({
        limit:8, //아무리 데이터가 많아도 8개의 데이터만 받아오겠다.
        order: [ //정렬해주는 기준을 정할 때 사용. (현재는 생성날짜,내림차순 으로 설정해놓음)
            ["createdAt","DESC"]
        ],
        attributes: [ //조회할 컬럼들 설정
            "id",
            "name",
            "seller",
            "createdAt",
            "imageUrl",
            "price"
        ]
    })
    .then((result) =>{ //위에서 찾은 결과들이 result에 담기면 그걸 product에 객체 형태로 넣겠다. 이렇게 담긴 값을 client main폴더안에 있는 index로 보내주겠다.(index 11번째줄)
        res.send({
            product:result
        })
    })
    .catch((error)=>{
        console.error(error);
        res.send('데이터를 가져오지 못했습니다.');
    })
})

//post방식 응답 지정
//post로 전송된 값들은 body에 담김
app.post('/products',async(req,res)=>{
    const body = req.body;
    // console.log(body);
    const { name, description, price, seller, imageUrl } = body;
    //Product테이블에 데이터를 삽입
    //구문 -> models.테이블 이름.create
    models.Products.create({
        name:name,
        description,
        price,
        seller,
        imageUrl
    }).then((result)=>{
        console.log("상품 생성 결과 : ",result);
        res.send({
            result,
        })
    })
    .catch((error)=>{
        console.error(error);
        res.send("상품 업로드에 문제가 발생했습니다.");
    })
})

//get방식 경로 파라미터 관리하기
app.get('/products/:id',async(req,res)=>{
    const params = req.params;
    console.log(params);
    console.log("bbb");
    // res.send('파라미터 관리하기');

    //하나만 찾을 때는 (=select할 때는) - findOne
    models.Products.findOne({
        //조건절
        where: {
            id:params.id //id랑 일치하는 것만 찾아 달라는거. (params에 담긴 id와 같은지)
        }
    })
    .then((result)=>{
        console.log(result);
        res.send({
            product:result // product값으로 결과를 보여주겠다.
        })
    })
    .catch((error)=>{
        console.error(error);
        res.send('상품 조회에 문제가 생겼습니다.')
    })
})
//이미지 파일을 post로 요청했을 때 업로드 폴더에 이미지를 저장
//upload index에서 Upload컴포넌트 안에 action="http://localhost:8080/image"으로 작성되어 있어서 '/image'로 받아야 됨.
//이미지로 포스트 요청을 했을 때, 'image'가 1개만 업로드될 때 single로 작성
app.post('/image',upload.single('image'),(req,res)=>{
    const file = req.file;
    res.send({
        imageUrl:file.destination +"/"+ file.filename
    })
})
//delete 삭제하기
app.delete('/products/:id',async(req, res) => {
    const params = req.params;
    console.log('삭제삭제');
    models.Product.destroy({ where: { id: params.id }})
    .then( res.send(
        "상품이 삭제되었습니다."
    ))
    .catch((error)=>{
        console.error(error);
        res.send('상품삭제에 문제가 생겼습니다.');
    })
})
//banners로 요청이 왔을때 응답하기
app.get("/banners",(req,res) => { 
    models.Banner.findAll({
        limit:3,
        attributes: ["imageUrl","id","href"]
    })
    .then((result)=>{
        res.send({
            banners: result,
        })
    })
    .catch((error)=>{
        console.error(error);
        res.send('에러가 발생했습니다.');
    })
})

//설정한 app을 실행시키기
app.listen(port, ()=>{
    console.log('그린램프 서버가 돌아가고 있습니다.');
    models.sequelize
    //데이터베이스와 동기화(sqlite와 연결) 시키겠다.
    .sync()
    .then(()=>{
        console.log('DB연결성공');
    })
    .catch(function(err){
        console.error(err);
        console.log('DB연결에러');
        process.exit();
    })
})
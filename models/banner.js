// Common JS방식의 모듈export
// models안에 파일이 추가되면 sequelize는 이걸 읽어서 테이블과 컬럼을 생성합니다.
// mysql의 create문을 대신한다고 생각하시면 됩니다.
module.exports = function(sequelize, DataTypes){
    const banner = sequelize.define('Banner',{
        imageUrl : {
            type:DataTypes.STRING(300),
            allowNull:false
        },
        href: {
            type: DataTypes.STRING(200),
            allowNull:false
        }
    })
    return banner;
}
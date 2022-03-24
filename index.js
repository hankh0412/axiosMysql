const axios = require("axios");
const mysql = require("mysql");

require("dotenv").config();

// console.log("DB_HOST:", process.env);

const con = mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

exports.handler = async (event, context, callback) => {
  let startTime = new Date().getTime();

  const response = await axios.get(process.env.API_URL);
  // console.log(JSON.stringify(response["data"]));
  // console.log(response.data.response);
  console.log(response.data.response.body.items.item);

  let cur_dt = new Date().toISOString();

  cur_dt = cur_dt.replace(/-/gi, "").replace(/:/gi, "").split(".", 1);

  const sql = `
    CREATE TABLE B551182_${cur_dt} (
      id int NOT NULL AUTO_INCREMENT,
      yadmNm varchar(400) DEFAULT NULL COMMENT '요양기관명',
      sidoNm varchar(400) DEFAULT NULL COMMENT '시도명',
      sgguNm varchar(400) DEFAULT NULL COMMENT '시군구명',
      recuClCd varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '요양종별코드\r\n11:종합병원\r\n21:병원\r\n31:의원',
      rprtWorpClicFndtTgtYn varchar(1) DEFAULT NULL COMMENT '호흡기전담클리닉 여부',
      addr varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '주소',
      telno varchar(20) DEFAULT NULL COMMENT '전화번호',
      ratPsblYn varchar(1) DEFAULT NULL COMMENT 'RAT(신속항원검사)가능여부',
      pcrPsblYn varchar(1) DEFAULT NULL COMMENT 'PCR가능여부',
      mgtStaDd varchar(8) DEFAULT NULL COMMENT '운영시작일자',
      XPos varchar(20) DEFAULT NULL COMMENT 'x좌표',
      XPosWgs84 varchar(20) DEFAULT NULL COMMENT '세계지구x좌표',
      YPos varchar(20) DEFAULT NULL COMMENT 'y좌표',
      YPosWgs84 varchar(20) DEFAULT NULL COMMENT '세계지구y좌표',
      ykihoEnc varchar(100) DEFAULT NULL COMMENT '암호화된 요양기호',
      PRIMARY KEY (id)
    )
  `;

  console.log(sql);

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  const promises = response.data.response.body.items.item.map(
    async (element) => {
      // console.log(element.addr);
      const sql = `
      INSERT INTO B551182_${cur_dt}
      (yadmNm, sidoNm, sgguNm, recuClCd, rprtWorpClicFndtTgtYn, addr, telno, ratPsblYn, pcrPsblYn, mgtStaDd, XPos, XPosWgs84, YPos, YPosWgs84, ykihoEnc)
      VALUES('${element.yadmNm}', '${element.sidoCdNm}', '${element.sgguCdNm}', '${element.recuClCd}', '${element.rprtWorpClicFndtTgtYn}', '${element.addr}', '${element.telno}', '${element.ratPsblYn}', '${element.pcrPsblYn}', '${element.mgtStaDd}', '${element.XPos}', '${element.XPosWgs84}', '${element.YPos}', '${element.YPosWgs84}', '${element.ykihoEnc}');
    `;
      console.log(sql);
      con.query(sql, (err, res) => {
        if (err) {
          throw err;
        }
      });
    }
  );
  await Promise.all(promises);

  con.end();

  let endTime = new Date().getTime();
  console.log("소요시간: ", endTime - startTime);

  return "Data inserted";
};

exports.handler();

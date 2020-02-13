import XLSX from "xlsx";
import moment from "moment";
import aws from "aws-sdk";
const s3 = new aws.S3({ apiVersion: "2006-03-01" });

// sample totalList
const totalList = [
  {
    "1028108981": "1028108981",
    마케팅팀: "마케팅팀",
    asdfljsadkl: "asdfljsadkl",
    alskdskls: "",
    "alsdf;asdf;": "alsdf;asdf;",
    aksdfkfkfkfks: "aksdfkfkfkfks"
  },
  {
    "1028108981": "1028108981",
    마케팅팀: "마케팅팀",
    asdfljsadkl: "asdfljsadkl",
    alskdskls: "",
    "alsdf;asdf;": "alsdf;asdf;",
    aksdfkfkfkfks: "aksdfkfkfkfks"
  },
  {
    "1028108981": "1028108981",
    마케팅팀: "마케팅팀",
    asdfljsadkl: "asdfljsadkl",
    alskdskls: "",
    "alsdf;asdf;": "alsdf;asdf;",
    aksdfkfkfkfks: "aksdfkfkfkfks"
  }
];
export const handler = async (event, context) => {
  const result = await createExcel("excel/excel_");
  console.log("result:", result);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Isn't she lovely~ Isn't she wonderful~~`,
      ...result
    })
  };
};

const createExcel = async fileName => {
  try {
    // 쓸데없어 보이는 주석은 제거함. 함수 이름으로 충분히 하는일을 알수 있음. book_new = 새로운 book
    // json_to_sheet = json 을 sheet 에다가 변환 등등...
    let wb = XLSX.utils.book_new();
    let newWorksheet = XLSX.utils.json_to_sheet(totalList);
    XLSX.utils.book_append_sheet(wb, newWorksheet, "Sheet0");
    const file = XLSX.write(wb, { type: "buffer" });
    fileName += moment().format("YYYYMMDD_HHmmss") + ".xlsx";
    const tag = await uploadFileStream(file, fileName);
    // tag 를 추가하는 이유는 putObject 에 대한 결과를 확인
    return { fileName, tag };
  } catch (e) {
    console.error(e.message);
  }
};

const uploadFileStream = async (Body, Key, Bucket = "") => {
  // * 주의 : Bucket name 은 unique 및 대문자 안됨, 모든 aws region 에서 unique해야함
  Bucket = Bucket || "billyboi-upload-excel-storage";
  const uploadParams = { Bucket, Key, Body };
  return await new Promise((resolve, reject) => {
    s3.putObject(uploadParams, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

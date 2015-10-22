var Xray = require('x-ray'),
    fs = require('fs'),
    x = Xray(),
    baseURLPrefix = 'http://www.thaischool.in.th/sitemap.php?school_area=&province_id=',
    baseURLSuffix = '&schooltype_id=&txtsearch=',
    provinces = require('./provinces.json'),
    province_id = 1,
    school_id = 1

function appendObject(obj){
  var resultFile = fs.readFileSync('./result/result.json'),
      result = JSON.parse(resultFile),
      resultJSON
  result.push(obj)
  resultJSON = JSON.stringify(result)
  fs.writeFileSync('./result/result.json', resultJSON)
}

function appendArray(arr){
  var resultFile = fs.readFileSync('./result/schools.json'),
      result = JSON.parse(resultFile),
      resultJSON
  Array.prototype.push.apply(result, arr)
  resultJSON = JSON.stringify(result)
  fs.writeFileSync('./result/schools.json', resultJSON)
}

function appendCSV(province, arr){
  var _province_id = province_id
  province_id += 1
  fs.appendFile('./result/provinces.csv', _province_id + ',' + province + '\n')
  arr.map(function(school){
    fs.appendFile('./result/schools.csv', school_id + ',' + school + ',' + _province_id + '\n')
    school_id += 1
  })
}

provinces.map(function(province){
  x(baseURLPrefix + province['id'] + baseURLSuffix, 'form', ['td > a'])
    .paginate('a[title="Next"]@href')(function(err, arr) {
      appendObject({
        province: province['name'],
        schools: arr
      })
      appendArray(arr)
      appendCSV(province['name'], arr)
    })
})

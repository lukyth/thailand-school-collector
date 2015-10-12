var Xray = require('x-ray'),
    fs = require('fs')

var x = Xray()

var baseURLPrefix = "http://www.thaischool.in.th/sitemap.php?school_area=&province_id=",
    baseURLSuffix = "&schooltype_id=&txtsearch=",
    provinces = require('./provinces.json'),
    province_id = 1,
    school_id = 1

function appendObject(obj){
  var resultFile = fs.readFileSync('./result/result.json')
  var result = JSON.parse(resultFile)
  result.push(obj)
  var resultJSON = JSON.stringify(result)
  fs.writeFileSync('./result/result.json', resultJSON)
}

function appendArray(arr){
  var resultFile = fs.readFileSync('./result/schools.json')
  var result = JSON.parse(resultFile)
  Array.prototype.push.apply(result, obj);
  var resultJSON = JSON.stringify(result)
  fs.writeFileSync('./result/schools.json', resultJSON)
}

function appendCSV(province, arr){
  var _province_id = province_id
  province_id += 1
  fs.appendFile('provinces.csv', _province_id + ',' + province + '\n')
  arr.map(function(school){
    fs.appendFile('schools.csv', school_id + ',' + school + ',' + _province_id + '\n')
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
    })
})
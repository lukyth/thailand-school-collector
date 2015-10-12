var Xray = require('x-ray'),
    fs = require('fs')

var x = Xray()

var baseURLPrefix = "http://www.thaischool.in.th/sitemap.php?school_area=&province_id=",
    baseURLSuffix = "&schooltype_id=&txtsearch=",
    provinces = require('./provinces.json')

function appendObject(obj){
  var resultFile = fs.readFileSync('./result/result.json')
  var result = JSON.parse(resultFile)
  result.push(obj)
  var resultJSON = JSON.stringify(result)
  fs.writeFileSync('./result/result.json', resultJSON)
}

provinces.map(function(province){
  x(baseURLPrefix + province['id'] + baseURLSuffix, 'form', ['td > a'])
    .paginate('a[title="Next"]@href')(function(err, arr) {
      appendObject({
        province: province['name'],
        schools: arr
      })
    })
})
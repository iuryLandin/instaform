const API = require('./leads')

API({
    token: "EAAGl3xvjC9EBAJpuWEI256Whh7nCNIOX7Jz6axxT4g76sXnLoKXr79a3eDc1PZBOZCDptYFC7nZCsvShw8epcCsKoRigDNE0C32TsplxJfKU1IOpYhsEqQByKoiZCfZB9uEEbnzxCT8thF22m0OXj1WDePCFXEOq1hnrhH5hQHkvpKhadvgkqPLFk7FuK5ydyiqZB1h9yEsq4CQKydMz1D0eWQYTYSi2GXt3eixt83EAZDZD",
    formId: "988633938305786",
}, function(res) {
    console.log(JSON.stringify(res));
})
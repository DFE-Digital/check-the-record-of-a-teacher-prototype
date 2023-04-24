const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');
const _ = require('lodash');

const generateRestrictionType = (params = {}) => {
  let restrictionType = {}
  restrictionType.id = _.get(params, 'id') || ('' + faker.datatype.number({min: 123456, max: 999999}))
  restrictionType.label = _.get(params, 'label')
  return restrictionType
}

const generateRestrictionTypes = () => {
  const restrictionTypes = []

  restrictionTypes.push(generateRestrictionType({
    label: "Banned from teaching by the Secretary of State for Education"
  }))

  restrictionTypes.push(generateRestrictionType({
    label: "Failed induction or probation"
  }))

  restrictionTypes.push(generateRestrictionType({
    label: "Sanctioned by the General Teaching Council for England (GTCE)"
  }))

  restrictionTypes.push(generateRestrictionType({
    label: "Banned or restricted from managing independent schools"
  }))

  return restrictionTypes
}

const generateRestrictionTypesFile = (filePath) => {
  const restrictionTypes = generateRestrictionTypes()
  const filedata = JSON.stringify(restrictionTypes, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Restriction types generated: ${filePath}`)
    }
  )
}

generateRestrictionTypesFile(path.join(__dirname, '../app/data/restriction-types.json'))

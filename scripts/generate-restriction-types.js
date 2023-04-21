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
    label: "Interim prohibition by the Secretary of State"
  }))

  restrictionTypes.push(generateRestrictionType({
    label: "Failed induction"
  }))

  restrictionTypes.push(generateRestrictionType({
    label: "Prohibited by the Secretary of State or independent schools tribunal"
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

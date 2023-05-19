const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
// faker.setLocale('en_GB');
const _ = require('lodash');
// const { v4: uuidv4 } = require('uuid')

const generateOrganisation = (params = {}) => {
  let organisation = {}
  // organisation.id = uuidv4()
  organisation.id = _.get(params, 'id') || ('' + faker.number.int({min: 10000, max: 99999}))
  organisation.name = params.name || faker.company.name() + ' School'
  organisation.address = params.address || { address1: '10 Seed Street', town: 'London', postcode: 'N19 4PT' }
  return organisation
}

const generateOrganisations = () => {
  const organisations = []
  organisations.push(generateOrganisation({ name: 'Stark School' }))
  organisations.push(generateOrganisation({ name: 'Ultron Academy' }))
  organisations.push(generateOrganisation({ name: 'Thanos College' }))
  return organisations
}

const generateOrganisationsFile = (filePath) => {
  const orgs = generateOrganisations()
  const filedata = JSON.stringify(orgs, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Organisations generated: ${filePath}`)
    }
  )
}

generateOrganisationsFile(path.join(__dirname, '../app/data/organisations.json'))

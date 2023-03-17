const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');
const _ = require('lodash');
const organisations = require('../app/data/organisations.json')

const generateTeacher = (params = {}) => {
  let teacher = {}
  teacher.id = _.get(params, 'id') || ('' + faker.datatype.number({min: 123456, max: 999999}))
  teacher.firstName = _.get(params, 'firstName') || faker.name.firstName()
  teacher.lastName = _.get(params, 'lastName') || faker.name.lastName()
  teacher.trn = _.get(params, 'trn') || ('' + faker.datatype.number({min: 1000000, max: 9999999}))
  teacher.emailAddress = _.get(params, 'emailAddress') || `${teacher.firstName.toLowerCase()}.${teacher.lastName.toLowerCase()}@gmail.com`;
  teacher.prohibitions = _.get(params, 'prohibitions') || faker.helpers.arrayElements(
      ['Allows teaching', 'Allows teaching with restrictions', 'Does not allow teaching'],
      faker.datatype.number({min: 0, max: 2}
    )
  )
  teacher.organisation = _.get(params, 'organisation') || faker.helpers.arrayElement(organisations.concat(null))
  return teacher
}

const generateTeachers = () => {
  const teachers = []

  teachers.push(generateTeacher({
    yourTeacher: true
  }))

  teachers.push(generateTeacher({
    yourTeacher: true
  }))

  for(let i = 0; i < 101; i++) {
    teachers.push(generateTeacher())
  }
  return teachers
}

const generateTeachersFile = (filePath) => {
  const teachers = generateTeachers()
  const filedata = JSON.stringify(teachers, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Teachers generated: ${filePath}`)
    }
  )
}

generateTeachersFile(path.join(__dirname, '../app/data/teachers.json'))

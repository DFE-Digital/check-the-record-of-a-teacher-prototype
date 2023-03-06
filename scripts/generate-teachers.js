const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');
const _ = require('lodash');

const generateTeacher = (params = {}) => {
  let teacher = {}
  teacher.id = _.get(params, 'id') || ('' + faker.datatype.number({min: 123456, max: 999999}))
  teacher.firstName = _.get(params, 'firstName') || faker.name.firstName()
  teacher.lastName = _.get(params, 'lastName') || faker.name.lastName()
  return teacher
}

const generateTeachers = () => {
  const teachers = []
  for(let i = 0; i < 21; i++) {
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

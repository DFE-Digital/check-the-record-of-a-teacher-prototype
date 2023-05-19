const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
// faker.setLocale('en_GB');
const _ = require('lodash');
const organisations = require('../app/data/organisations.json')

const generateUser = (params = {}) => {
  let user = {}
  user.emailAddress = params.emailAddress
  user.password = params.password || 'tra'
  user.organisation = params.organisation || organisations[0]
  return user
}

const generateUsers = () => {
  const users = []

  users.push(generateUser({
    emailAddress: 'anne.smith@example.com'
  }))

  return users
}

const generateUsersFile = (filePath) => {
  const users = generateUsers()
  const filedata = JSON.stringify(users, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Users generated: ${filePath}`)
    }
  )
}

generateUsersFile(path.join(__dirname, '../app/data/users.json'))

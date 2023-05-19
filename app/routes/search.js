const _ = require('lodash');
const allTeachers = require('../data/teachers.json')
const restrictionTypes = require('../data/restriction-types.json')

module.exports = router => {

  router.get('/', (req, res) => {
    // let yourTeachers = allTeachers.filter(teacher => {
    //   return teacher.organisation && teacher.organisation.name == req.session.data.user.organisation.name
    // })

    res.render('index')
  })
}

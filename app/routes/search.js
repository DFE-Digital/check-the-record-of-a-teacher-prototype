const _ = require('lodash');
const allTeachers = require('../data/teachers.json')
const restrictionTypes = require('../data/restriction-types.json')

module.exports = router => {

  router.get('/search', (req, res) => {
    let yourTeachers = allTeachers.filter(teacher => {
      return teacher.organisation && teacher.organisation.name == req.session.data.user.organisation.name
    })

    res.render('search/index', {
      yourTeachers,
      restrictionTypes
    })
  })

  router.post('/search', (req, res) => {
    let trn =_.get(req.session.data, 'trn')
    let teachers = allTeachers
    let teacher
    if(trn) {
      teacher = teachers.find(teacher => {
        console.log(teacher.trn)
        console.log(trn)
        return teacher.trn == trn
      })
    }

    if(teacher) {
      res.redirect(`/teachers/${teacher.id}`)
    } else {
      res.redirect(`/search/notfound`)
    }
  })

}

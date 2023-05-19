const _ = require('lodash');
const allTeachers = require('../data/teachers.json')

module.exports = router => {

  router.get('/', (req, res) => {
    // let yourTeachers = allTeachers.filter(teacher => {
    //   return teacher.organisation && teacher.organisation.name == req.session.data.user.organisation.name
    // })

    if(req.session.data.user) {
      res.render('index')
      return
    } else {
      res.redirect('/account/sign-in')
    }


  })
}

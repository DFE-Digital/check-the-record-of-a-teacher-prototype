const allTeachers = require('../data/teachers.json')
module.exports = router => {

  router.get('/teachers', (req, res) => {
    var teachers = allTeachers.filter(teacher => teacher.trn == req.session.data.trn)

    res.render('teachers/index', {
      teachers
    })
  })

  router.get('/teachers/clear-search', (req, res) => {
    req.session.data.trn = ''
    res.redirect('/teachers')
  })

  router.get('/teachers/:id', (req, res) => {
    let teacher = allTeachers.find(teacher => teacher.id == req.params.id)
    res.render('teachers/show', {
      teacher
    })
  })

}

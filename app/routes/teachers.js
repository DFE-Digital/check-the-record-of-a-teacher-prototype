const teachers = require('../data/teachers.json')
module.exports = router => {

  router.get('/teachers', (req, res) => {
    res.render('teachers/index', {
      teachers
    })
  })

  router.get('/teachers/:id', (req, res) => {
    let teacher = teachers.find(teacher => teacher.id == req.params.id)
    res.render('teachers/show', {
      teacher
    })
  })

}

const _ = require('lodash');
const { DateTime } = require('luxon')
const PaginationHelper = require('../helpers/pagination')
const allTeachers = require('../data/teachers.json')

function decorateStatus(teacher) {
  teacher = _.clone(teacher)

  teacher.status = 'No restrictions'

  if(teacher.hasProhibitions == 'Yes') {
    teacher.status = 'Restrictions'
  }

  return teacher
}

module.exports = router => {
  router.get('/teachers', (req, res) => {
    let teachers = allTeachers
    let searchLastName = _.get(req.session.data, 'lastName')

    if(!searchLastName) {
      res.redirect('/')
      return
    }

    searchLastName = searchLastName.toLowerCase()
    let searchDay = parseInt(_.get(req.session.data, 'day'), 10)
    let searchMonth = parseInt(_.get(req.session.data, 'month'), 10)
    let searchYear = parseInt(_.get(req.session.data, 'year'), 10)
    let searchDate = DateTime.fromObject({
      day: searchDay,
      month: searchMonth,
      year: searchYear
    })
    if(searchLastName) {
      teachers = teachers.filter(teacher => {
        let lastNames = [teacher.lastName].concat(teacher.previousLastNames || [])
        let lowerCaseLastNames = lastNames.map(name => name.toLowerCase())

        return lowerCaseLastNames.indexOf(searchLastName) > -1
      })
      teachers = teachers.filter(teacher => {
        let date1 = DateTime.fromISO(teacher.dob)
        let date2 = searchDate
        return date1.hasSame(date2, "day") && date1.hasSame(date2, "month") && date1.hasSame(date2, "year")
      })
    }

    let totalCount = teachers.length
    let pagination = PaginationHelper.getPagination(teachers, req.query.page, 25)
    teachers = PaginationHelper.getDataByPage(teachers, pagination.pageNumber, 25)

    teachers = teachers.map(decorateStatus)

    res.render('teachers/index', {
      teachers,
      totalCount,
      pagination
    })
  })

  router.get('/teachers/:id', (req, res) => {
    let teacher = allTeachers
      .map(decorateStatus)
      .find(teacher => teacher.id == req.params.id)
    res.render('teachers/show', {
      teacher
    })
  })


  router.get('/teachers/:id/add', (req, res) => {
    let teacher = allTeachers
      .map(decorateStatus)
      .find(teacher => teacher.id == req.params.id)
    res.render('teachers/add/index', {
      teacher
    })
  })

  router.post('/teachers/:id/add', (req, res) => {
    let teacher = allTeachers.find(teacher => teacher.id == req.params.id)
    teacher.organisation = req.session.data.user.organisation
    req.flash('success', 'Teacher added to your organisation')
    res.redirect(`/teachers/${req.params.id}`)
  })

  router.get('/teachers/:id/remove', (req, res) => {
    let teacher = allTeachers
      .map(decorateStatus)
      .find(teacher => teacher.id == req.params.id)
    res.render('teachers/remove/index', {
      teacher
    })
  })

  router.post('/teachers/:id/remove', (req, res) => {
    let teacher = allTeachers.find(teacher => teacher.id == req.params.id)
    teacher.organisation = null
    req.flash('success', 'Teacher removed from your organisation')
    res.redirect(`/teachers/${req.params.id}`)
  })

}

const _ = require('lodash');
const { DateTime } = require('luxon');
const PaginationHelper = require('../helpers/pagination')
const allTeachers = require('../data/teachers.json')

module.exports = router => {

  router.get('/restricted-teachers', (req, res) => {
    let teachers = allTeachers

    teachers = teachers
      .filter(teacher => teacher.hasProhibitions == 'Yes')

    let searchlastName = _.get(req.query, 'lastName').toLowerCase()
    let searchDay = parseInt(_.get(req.query, 'day'), 10)
    let searchMonth = parseInt(_.get(req.query, 'month'), 10)
    let searchYear = parseInt(_.get(req.query, 'year'), 10)
    let searchDate = DateTime.fromObject({
      day: searchDay,
      month: searchMonth,
      year: searchYear
    })
    if(searchlastName) {
      teachers = teachers.filter(teacher => {
        let name = teacher.lastName.toLowerCase()
        return (name).indexOf(searchlastName) > -1
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

    res.render('restricted-teachers/index', {
      teachers,
      totalCount,
      pagination
    })
  })

  // router.get('/restricted-teachers/clear-search', (req, res) => {
  //   req.session.data.teacherName = ''
  //   res.redirect('/restricted-teachers')
  // })

}

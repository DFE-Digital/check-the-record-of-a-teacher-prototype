const _ = require('lodash');
const PaginationHelper = require('../helpers/pagination')
const allTeachers = require('../data/teachers.json')
const restrictionTypes = require('../data/restriction-types.json')


module.exports = router => {

  router.get('/restricted-teachers/:restrictionTypeId', (req, res) => {
    let teachers = allTeachers
    let restrictionType = restrictionTypes.find(type => type.id == req.params.restrictionTypeId).label

    teachers = teachers
      .filter(teacher => teacher.hasProhibitions == 'Yes')
      .filter(teacher => {
        let restrictionTypeIds = teacher.restrictions.map(restriction => restriction.type.id)
        return restrictionTypeIds.includes(req.params.restrictionTypeId)
      })

    // Pagination
    let totalCount = teachers.length
    let pagination = PaginationHelper.getPagination(teachers, req.query.page, 25)
    teachers = PaginationHelper.getDataByPage(teachers, pagination.pageNumber, 25)

    res.render('restricted-teachers/index', {
      teachers,
      totalCount,
      pagination,
      restrictionType
    })

  })

}

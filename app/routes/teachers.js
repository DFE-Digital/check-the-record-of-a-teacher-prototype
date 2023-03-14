const _ = require('lodash');
const PaginationHelper = require('../helpers/pagination')
const allTeachers = require('../data/teachers.json')

const removeFilter = (value, data) => {
  if(Array.isArray(data)) {
    return data.filter(item => item !== value)
  } else {
    return null
  }
}

function hasCommonArrayValues(arr1, arr2) {
  return arr1.some(item => arr2.includes(item))
}

module.exports = router => {

  router.get('/teachers', (req, res) => {
    let teachers = allTeachers

    // Search by TRN
    let trn =_.get(req.session.data, 'trn')
    if(trn) {
      teachers = teachers.filter(teacher => teacher.trn == trn)
    }

    // Filters
    let prohibitions = _.get(req.session.data.filters, 'prohibitions')
    let yourTeachers = _.get(req.session.data.filters, 'yourTeachers')
    let hasFilters = prohibitions || yourTeachers

    let selectedFilters = {
      categories: []
    }

    if(hasFilters) {
      teachers = teachers.filter(teacher => {
        let prohibitionsValid = true
        let yourTeachersValid = true

        if(prohibitions) {
          prohibitionsValid = hasCommonArrayValues(prohibitions, teacher.prohibitions)
        }

        if(yourTeachers) {
          yourTeachersValid = teacher.yourTeacher
        }

        return prohibitionsValid && yourTeachersValid
      })

      if(_.get(prohibitions, 'length')) {
        selectedFilters.categories.push({
          heading: { text: 'Prohibitions' },
          items: prohibitions.map(prohibitionItem => {
            return {
              text: prohibitionItem,
              href: `/teachers/remove-prohibition/${prohibitionItem}`
            }
          })
        })
      }

      if(_.get(yourTeachers, 'length')) {
        selectedFilters.categories.push({
          heading: { text: 'Your teachers' },
          items: yourTeachers.map(yourTeacherItem => {
            return {
              text: yourTeacherItem,
              href: `/teachers/remove-yourTeacher/${yourTeacherItem}`
            }
          })
        })
      }

    }

    // Pagination
    let totalCount = teachers.length
    let pagination = PaginationHelper.getPagination(teachers, req.query.page, 25)
    teachers = PaginationHelper.getDataByPage(teachers, pagination.pageNumber, 25)

    res.render('teachers/index', {
      teachers,
      selectedFilters,
      totalCount,
      pagination
    })
  })

  router.get('/teachers/clear-search', (req, res) => {
    req.session.data.trn = ''
    res.redirect('/teachers')
  })

  router.get('/teachers/remove-prohibition/:prohibition', (req, res) => {
    req.session.data.filters.prohibitions = removeFilter(req.params.prohibition, req.session.data.filters.prohibitions)
    res.redirect('/teachers')
  })

  router.get('/teachers/remove-yourTeacher/:yourTeacher', (req, res) => {
    req.session.data.filters.yourTeachers = removeFilter(req.params.yourTeacher, req.session.data.filters.yourTeachers)
    res.redirect('/teachers')
  })

  router.get('/teachers/clear-filters', (req, res) => {
    _.set(req.session.data.filters, 'prohibitions', null)
    _.set(req.session.data.filters, 'yourTeachers', null)
    res.redirect('/teachers')
  })



  router.get('/teachers/:id', (req, res) => {
    let teacher = allTeachers.find(teacher => teacher.id == req.params.id)
    res.render('teachers/show', {
      teacher
    })
  })

}

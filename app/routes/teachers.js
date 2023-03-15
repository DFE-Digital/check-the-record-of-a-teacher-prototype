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
    let yourTeachers = _.get(req.session.data.filters, 'yourTeachers')
    let prohibitionTypes = _.get(req.session.data.filters, 'prohibitionTypes')
    let prohibitionStatuses = _.get(req.session.data.filters, 'prohibitionStatuses')
    let hasFilters = _.get(prohibitionTypes, 'length') || _.get(prohibitionStatuses, 'length') || _.get(yourTeachers, 'length')

    let selectedFilters = {
      categories: []
    }

    if(hasFilters) {
      teachers = teachers.filter(teacher => {
        let prohibitionTypesValid = true
        let prohibitionStatusesValid = true
        let yourTeachersValid = true

        if(prohibitionTypes) {
          prohibitionTypesValid = hasCommonArrayValues(prohibitionTypes, teacher.prohibitionTypes)
        }

        if(prohibitionStatuses) {
          prohibitionStatusesValid = (prohibitionStatuses.includes('Has a prohibition') && teacher.prohibitionTypes.length) || (prohibitionStatuses.includes('Does not have a prohibition') && !teacher.prohibitionTypes.length)
        }

        if(yourTeachers) {
          yourTeachersValid = (yourTeachers.includes('Your teacher') && teacher.yourTeacher) || (yourTeachers.includes('Not your teacher') && !teacher.yourTeacher)
        }

        return prohibitionTypesValid && prohibitionStatusesValid && yourTeachersValid
      })

      if(_.get(prohibitionTypes, 'length')) {
        selectedFilters.categories.push({
          heading: { text: 'Prohibition type' },
          items: prohibitionTypes.map(prohibitionItem => {
            return {
              text: prohibitionItem,
              href: `/teachers/remove-prohibitionType/${prohibitionItem}`
            }
          })
        })
      }

      if(_.get(prohibitionStatuses, 'length')) {
        selectedFilters.categories.push({
          heading: { text: 'Prohibition' },
          items: prohibitionStatuses.map(prohibitionStatus => {
            return {
              text: prohibitionStatus,
              href: `/teachers/remove-prohibitionStatus/${prohibitionStatus}`
            }
          })
        })
      }

      if(_.get(yourTeachers, 'length')) {
        selectedFilters.categories.push({
          heading: { text: 'Your teacher' },
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

  router.get('/teachers/remove-yourTeacher/:yourTeacher', (req, res) => {
    req.session.data.filters.yourTeachers = removeFilter(req.params.yourTeacher, req.session.data.filters.yourTeachers)
    res.redirect('/teachers')
  })

  router.get('/teachers/remove-prohibitionStatus/:prohibitionStatus', (req, res) => {
    req.session.data.filters.prohibitionStatuses = removeFilter(req.params.prohibitionStatus, req.session.data.filters.prohibitionStatuses)
    res.redirect('/teachers')
  })

  router.get('/teachers/remove-prohibitionType/:prohibitionType', (req, res) => {
    req.session.data.filters.prohibitionTypes = removeFilter(req.params.prohibitionType, req.session.data.filters.prohibitionTypes)
    res.redirect('/teachers')
  })


  router.get('/teachers/clear-filters', (req, res) => {
    _.set(req.session.data.filters, 'yourTeachers', null)
    _.set(req.session.data.filters, 'prohibitionStatuses', null)
    _.set(req.session.data.filters, 'prohibitionTypes', null)
    res.redirect('/teachers')
  })



  router.get('/teachers/:id', (req, res) => {
    let teacher = allTeachers.find(teacher => teacher.id == req.params.id)
    res.render('teachers/show', {
      teacher
    })
  })

}

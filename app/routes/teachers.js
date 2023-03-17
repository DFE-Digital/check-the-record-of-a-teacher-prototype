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

function decorateStatus(teacher) {
  teacher = _.clone(teacher)

  teacher.status = 'Allowed to teach'

  if(teacher.prohibitions.includes('Does not allow teaching')) {
    teacher.status = 'Banned'
  } else if(teacher.prohibitions.includes('Allows teaching with restrictions')) {
    teacher.status = 'Has restrictions'
  }

  return teacher
}

module.exports = router => {

  router.get('/teachers', (req, res) => {

    let teachers = allTeachers

    teachers = teachers.map(decorateStatus)

    // Search by TRN
    let trn =_.get(req.session.data, 'trn')
    if(trn) {
      teachers = teachers.filter(teacher => teacher.trn == trn)
    }

    // Filters
    let organisations = _.get(req.session.data.filters, 'organisations')
    let statuses = _.get(req.session.data.filters, 'statuses')
    let hasFilters = _.get(statuses, 'length') || _.get(organisations, 'length')

    let selectedFilters = {
      categories: []
    }

    if(hasFilters) {
      teachers = teachers.filter(teacher => {
        let organisationsValid = true
        let statusesValid = true

        if(statuses) {
          statusesValid = statuses.includes(teacher.status)
        }

        if(organisations) {
          if(organisations.includes('Your organisation')) {
            organisationsValid = teacher.organisation.name == req.session.data.user.organisation.name
          }
          if(organisations.includes('Other organisation')) {
            organisationsValid = teacher.organisation.name != req.session.data.user.organisation.name
          }
        }

        return statusesValid && organisationsValid
      })

      if(_.get(organisations, 'length')) {
        selectedFilters.categories.push({
          heading: { text: 'Organisation' },
          items: organisations.map(organisation => {
            return {
              text: organisation,
              href: `/teachers/remove-organisation/${organisation}`
            }
          })
        })
      }

      if(_.get(statuses, 'length')) {
        selectedFilters.categories.push({
          heading: { text: 'Status' },
          items: statuses.map(status => {
            return {
              text: status,
              href: `/teachers/remove-status/${status}`
            }
          })
        })
      }

      // if(_.get(yourTeachers, 'length')) {
      //   selectedFilters.categories.push({
      //     heading: { text: 'Your teacher' },
      //     items: yourTeachers.map(yourTeacherItem => {
      //       return {
      //         text: yourTeacherItem,
      //         href: `/teachers/remove-yourTeacher/${yourTeacherItem}`
      //       }
      //     })
      //   })
      // }

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

  router.get('/teachers/remove-organisation/:organisation', (req, res) => {
    req.session.data.filters.organisations = removeFilter(req.params.organisation, req.session.data.filters.organisations)
    res.redirect('/teachers')
  })

  router.get('/teachers/remove-status/:status', (req, res) => {
    req.session.data.filters.statuses = removeFilter(req.params.status, req.session.data.filters.statuses)
    res.redirect('/teachers')
  })

  router.get('/teachers/clear-filters', (req, res) => {
    _.set(req.session.data.filters, 'organisations', null)
    _.set(req.session.data.filters, 'statuses', null)
    res.redirect('/teachers')
  })

  router.get('/teachers/:id', (req, res) => {
    let teacher = allTeachers
      .map(decorateStatus)
      .find(teacher => teacher.id == req.params.id)
    res.render('teachers/show', {
      teacher
    })
  })

}

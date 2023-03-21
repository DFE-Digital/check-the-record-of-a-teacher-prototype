const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

const { DateTime } = require("luxon")
const slugify = require('slugify')

addFilter('isoDateFromDateInput', function(object) {
  try {
    const year = parseInt(object.year) || new Date().getFullYear()
    const month = parseInt(object.month)

    if (!object.day) {
      return DateTime.local(year, month).toFormat('yyyy-LL')
    } else {
      const day = parseInt(object.day)

      return DateTime.local(year, month, day).toISODate()
    }
  } catch (error) {
    return error.message.split(':')[0]
  }
})

addFilter('slugify', function(string) {
  return slugify(string, {
    replacement: '-',
    remove: /[*+~.,()'"!?:@–]/g,
    lower: true
  })
})

addFilter('firstLetter', string => {
  return string.charAt(0)
})

addFilter('noOrphans', string => {
  const indexOfLastSpace = string.lastIndexOf(' ')

  // If there’s only one word, we don’t need this filter
  if (indexOfLastSpace === -1) {
    return string
  }

  const begin = string.substring(0, indexOfLastSpace)
  const end = string.substring(indexOfLastSpace + 1)
  return `${begin}&nbsp;${end}`
})

function govukDate(date) {
  return DateTime.fromISO(date).toFormat('d MMMM yyyy')
}
addFilter('date', govukDate)

function govukTime(date) {
  let dt = DateTime.fromISO(date)
  if (dt.minute > 0) {
    dt = dt.toFormat('h:mma')
  } else {
    dt = dt.toFormat('ha')
  }
  return dt.toLowerCase()
}
addFilter('time', govukTime)

function govukDateTime(date) {
  return govukDate(date) + ' at ' + govukTime(date)
}
addFilter('dateTime', govukDateTime)


function statusClass(text) {
  switch (text) {
    case 'Banned':
      return 'govuk-tag--red'
    case 'Restrictions':
      return 'govuk-tag--yellow'
  }
}
addFilter('statusClass', statusClass)
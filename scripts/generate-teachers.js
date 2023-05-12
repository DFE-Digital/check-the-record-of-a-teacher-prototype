const fs = require('fs')
const path = require('path')
const faker =  require('@faker-js/faker').faker
faker.setLocale('en_GB');
const _ = require('lodash');
const organisations = require('../app/data/organisations.json')
const restrictionTypes = require('../app/data/restriction-types.json')

const restrictions = [
  {
    type: restrictionTypes.find(type => type.label == 'Banned from teaching by the Secretary of State for Education'),
    date: faker.date.past(),
    notes: faker.helpers.arrayElement(['Banned from teaching.', 'Interim prohibition by the Secretary of State'])
  },
  {
    type: restrictionTypes.find(type => type.label == 'Failed induction or probation'),
    date: faker.date.past(),
    notes: 'Can only teach in organisations where the completion of induction is not a requirement.'
  },
  {
    type: restrictionTypes.find(type => type.label == 'Sanctioned by the General Teaching Council for England (GTCE)'),
    date: faker.date.past(),
    dateForReview: faker.date.future(),
    notes: 'Cannot teach in a maintained school, pupil referral unit or non-maintained special school; can teach in academies and free schools only.'
  },
  {
    type: restrictionTypes.find(type => type.label == 'Banned or restricted from managing independent schools'),
    date: faker.date.past(),
    notes: 'Section 128 barring direction'
  }
]

const generateTeacher = (params = {}) => {
  let teacher = {}
  teacher.id = _.get(params, 'id') || ('' + faker.datatype.number({min: 123456, max: 999999}))
  teacher.firstName = _.get(params, 'firstName') || faker.name.firstName()
  teacher.lastName = _.get(params, 'lastName') || faker.name.lastName()
  teacher.trn = _.get(params, 'trn') || ('' + faker.datatype.number({min: 1000000, max: 9999999}))
  teacher.emailAddress = _.get(params, 'emailAddress') || `${teacher.firstName.toLowerCase()}.${teacher.lastName.toLowerCase()}@gmail.com`;

  teacher.hasProhibitions = _.get(params, 'hasProhibitions') || faker.helpers.arrayElement([
    'Yes',
    'No',
    'No',
    'No',
    'No',
    'No',
    'No',
    'No',
    'No',
    'No',
    'No'
  ])

  if(teacher.hasProhibitions == 'Yes') {
    teacher.restrictions = _.get(params, 'restrictions') || faker.helpers.arrayElements(
      restrictions,
      faker.datatype.number({min: 1, max: 2})
    )
  }

  teacher.organisation = _.get(params, 'organisation') || faker.helpers.arrayElement(organisations.concat(null, null, null, null, null, null, null, null, null, null, null, null))

  // QTS
  teacher.qts = _.get(params, 'qts') || {}
  teacher.qts.status = _.get(params, 'qts.status') || faker.helpers.arrayElement([
    'Qualified (trained in the UK)',
    'Qualified (trained outside the UK)',
    'Trainee'
  ])
  teacher.qts.dateAwarded = _.get(params, 'qts.dateAwarded') || faker.date.past()
  teacher.qts.datePartiallyAwarded = _.get(params, 'qts.datePartiallyAwarded') || faker.date.past()

  // EYTS
  teacher.eyts = _.get(params, 'eyts') || {}
  teacher.eyts.status = _.get(params, 'eyts.status') || faker.helpers.arrayElement([
    'Qualified',
    'Trainee'
  ])
  teacher.eyts.dateAwarded = _.get(params, 'eyts.dateAwarded') || faker.date.past()

  // Induction
  teacher.induction = _.get(params, 'induction') || {}
  teacher.induction.status = _.get(params, 'induction.status') || faker.helpers.arrayElement([
    'Required',
    'In progress',
    'Passed',
    'Failed',
    'Exempt'
  ])
  teacher.induction.reasonForExemption = _.get(params, 'induction.reasonForExemption') || faker.helpers.arrayElement([
    'Gained QTS before 1999',
    'Other reason'
  ])
  teacher.induction.eligibleToCompleteOneYearInduction = _.get(params, 'induction.eligibleToCompleteOneYearInduction') || faker.helpers.arrayElement([
    'Yes',
    'No'
  ])
  teacher.induction.dateCompleted = _.get(params, 'induction.dateCompleted') || faker.date.past()

  // ITT
  teacher.itt = _.get(params, 'itt') || {}
  teacher.itt.qualification = _.get(params, 'itt.qualification') || faker.helpers.arrayElement([
    'PGCE',
    'Other qualification'
  ])
  teacher.itt.provider = _.get(params, 'itt.provider') || faker.company.name() + ' ' + faker.helpers.arrayElement([
    'Trust',
    'Schools',
    'Network',
    'University',
    'College',
    'Institute',
    'Academies',
    'School'
  ])
  teacher.itt.programmeType = _.get(params, 'itt.programmeType') || faker.helpers.arrayElement([
    'Higher education institute (HEI)',
    'School centered initial teacher training (SCITT)',
    'School direct (fee funded)',
    'School direct (salaried)'
  ])
  teacher.itt.subject = _.get(params, 'itt.subject') || faker.helpers.arrayElement([
    'Mathematics',
    'English',
    'Science'
  ])
  teacher.itt.additionalSubject = _.get(params, 'itt.additionalSubject') || faker.helpers.arrayElement([
    'Biology',
    'Physics',
    'Foreign languages'
  ])
  teacher.itt.ageRange = _.get(params, 'itt.ageRange') || faker.helpers.arrayElement([
    '3 to 11 years (primary training)',
    '7 to 14 years (middle training)',
    '11 to 19 years (secondary training)'
  ])
  teacher.itt.dateCourseEnds = _.get(params, 'itt.dateCourseEnds') || faker.date.past()
  teacher.itt.result = _.get(params, 'itt.result') || faker.helpers.arrayElement([
    'Pass',
    'Fail',
    'In progress'
  ])
  teacher.itt.grade = _.get(params, 'itt.grade') || faker.helpers.arrayElement([
    'First',
    '2:1',
    '2:2',
    'Third'
  ])

  // MQ
  teacher.mq = _.get(params, 'mq') || {}
  teacher.mq.specialism = _.get(params, 'mq.specialism') || faker.helpers.arrayElement([
    'Audio impairment',
    'Visual impairment',
    'Audio and visual impairment'
  ])
  teacher.mq.dateAwarded = _.get(params, 'mq.dateAwarded') || faker.date.past()

  // NPQ
  teacher.npq = _.get(params, 'npq') || {}
  teacher.npq.dateExecutiveLeadershipAwarded = _.get(params, 'npq.dateExecutiveLeadershipAwarded') || faker.date.past()
  teacher.npq.dateHeadshipAwarded = _.get(params, 'npq.dateHeadshipAwarded') || faker.date.past()
  teacher.npq.dateSeniorLeadershipAwarded = _.get(params, 'npq.dateSeniorLeadershipAwarded') || faker.date.past()
  teacher.npq.dateMiddleLeadershipAwarded = _.get(params, 'npq.dateMiddleLeadershipAwarded') || faker.date.past()
  teacher.npq.dateLeadingTeacherDevelopmentAwarded = _.get(params, 'npq.dateLeadingTeacherDevelopmentAwarded') || faker.date.past()
  teacher.npq.dateLeadingTeachingAwarded = _.get(params, 'npq.dateLeadingTeachingAwarded') || faker.date.past()
  teacher.npq.dateLeadingBehaviourAwarded = _.get(params, 'npq.dateLeadingBehaviourAwarded') || faker.date.past()

  return teacher
}

const generateTeachers = () => {
  const teachers = []

  teachers.push(generateTeacher({
    trn: '1234567',
    yourTeacher: false,
    hasProhibitions: 'No'
  }))

  teachers.push(generateTeacher({
    trn: '1234568',
    yourTeacher: false,
    hasProhibitions: 'Yes'
  }))

  teachers.push(generateTeacher({
    yourTeacher: true,
    hasProhibitions: 'No'
  }))

  teachers.push(generateTeacher({
    yourTeacher: true,
    hasProhibitions: 'Yes'
  }))

  for(let i = 0; i < 1001; i++) {
    teachers.push(generateTeacher())
  }
  return teachers
}

const generateTeachersFile = (filePath) => {
  const teachers = generateTeachers()
  const filedata = JSON.stringify(teachers, null, 2)
  fs.writeFile(
    filePath,
    filedata,
    (error) => {
      if (error) {
        console.error(error)
      }
      console.log(`Teachers generated: ${filePath}`)
    }
  )
}

generateTeachersFile(path.join(__dirname, '../app/data/teachers.json'))

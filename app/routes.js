//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

router.all('*', (req, res, next) => {
  res.locals.user = req.session.user
  next()
})

require('./routes/account')(router)
require('./routes/teachers')(router)

router.get('/', (req, res) => {
  if(!req.session.data.user) {
    res.redirect('/account/sign-in')
  } else {
    res.redirect('/teachers')
  }
})
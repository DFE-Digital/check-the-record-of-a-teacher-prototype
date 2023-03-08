const users = require('../data/users.json')
module.exports = router => {

  // router.get('/account/sign-in', (req, res) => {
  //   var options = users.map(user => {
  //     return {
  //       text: user.emailAddress,
  //       value: user.emailAddress,
  //       hint: {
  //         text: user.profile.status ? 'Profile: ' + user.profile.status : ''
  //       }
  //     }
  //   })
  //   res.render('account/sign-in', {
  //     returnUrl: req.query.returnUrl,
  //     options
  //   })
  // })

  router.post('/account/sign-in', (req, res) => {
    res.locals.user = req.session.data.user = users[0]

    if(req.body.returnUrl) {
      res.redirect(req.body.returnUrl)
    } else {
      res.redirect('/teachers')
    }
  })

  router.get('/account/sign-out', (req, res) => {
    res.locals.user = req.session.data.user = null
    res.redirect('/')
  })

}

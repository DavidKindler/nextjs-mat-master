const sendEmail = require('../../lib/sendEmail')

export default (req, res) => {
  sendEmail({
    to: 'david.kindler@nxp.com',
    subject: 'Sending Email test',
    text: 'Howdy',
    html: '<h2>Howdy!</h2>'
  })
  res.status(200).json({ text: 'email sent' })
}

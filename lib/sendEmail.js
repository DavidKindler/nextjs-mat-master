const gmailSend = require('gmail-send')

const sendEmail = opts => {
  let options = {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
    to: opts.to || 'david.kindler@nxp.com',
    subject: opts.subject || 'Sending Email using Node.js',
    text: opts.text || 'That was easy!',
    html: opts.html || '<h2>That was super easy</h2>'
  }
  const send = new gmailSend(options)
  send(options, (error, result, fullResult) => {
    if (error) console.error(error)
    console.log(result)
  })
  // send(options, (error, result, fullResult) => {
  //   if (error) console.error(error)
  //   console.log(result)
  // })
}

// if (fs.existsSync(gmail_send_options)) {
//   const options = require(gmail_send_options)
//   sendEmail(options)
// }

module.exports = sendEmail

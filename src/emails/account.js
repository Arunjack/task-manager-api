
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'arun.tell6@gmail.com',
        subject: 'Welcome to Task App',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',  
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'arun.tell6@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
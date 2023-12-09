const sgMail = require('sendgrid')

process.env.SENDGRID_API_KEY

// sgMail.send({
//     to: 'samuelademipoai@gmail.com',
//     from: 'samuelademipoai@gmail.com',
//     subject: 'you are welcome',
//     text: 'Buy one and get one free'
// })


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'samuelademiposi@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app. ${name}. Let know you get along with the app`
    })
}


// const mailersend = require('mailersend')


// const mailerSend = new MailerSend({
//     apiKey: process.env.API_KEY,
// })

// const sentFrom = new Sender('samuleademiposi@gmail.com', 'ADEXGROUP')

// const recipients = [
//     new Recipients()
// ];

// const emailParams = new EmailParams()


const sendCancellationEmail =(email, name) => {
    sgMail.send({
        to: email,
        from: 'samuelademiposi@gmail.com',
        subject: 'we will hope to see you come again',
        text: `Goodbye, ${name}. I hope to see you soon`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
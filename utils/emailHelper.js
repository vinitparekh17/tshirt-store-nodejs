const nodemailer = require('nodemailer')
const { SMTP_PORT, SMTP_HOST, SMTP_USER, SMTP_PASS} = process.env
const mailer = async (option) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        auth: {
            user: SMTP_USER, // generated ethereal user
            pass: SMTP_PASS, // generated ethereal password
        },
    });

    let message = {
        from: "vinitparekh.rocks", // sender address
        to: option.email, // list of receivers
        subject: option.subject, // Subject line
        text: option.message, // plain text body
    };

    transporter.sendMail(message)
}

module.exports = mailer
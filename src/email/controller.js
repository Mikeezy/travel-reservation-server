const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const googleapis = require('googleapis')
const fs = require('fs')
const config = require('config')
const path = require('path')
const Promise = require('bluebird')

const OAuth2 = googleapis.google.auth.OAuth2;

const oauth2Client = new OAuth2(
    config.get('email.EMAIL_CLIENT_ID'), // ClientID
    config.get('email.EMAIL_CLIENT_SECRET'), // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);


oauth2Client.setCredentials({
    refresh_token: config.get('email.EMAIL_REFRESH_TOKEN')
});


const accessToken = oauth2Client.getAccessToken()


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: config.get('email.EMAIL_USERNAME'),
        clientId: config.get('email.EMAIL_CLIENT_ID'),
        clientSecret: config.get('email.EMAIL_CLIENT_SECRET'),
        refreshToken: config.get('email.EMAIL_REFRESH_TOKEN'),
        accessToken: accessToken
    }
});

const sender = `"${config.get('email.EMAIL_HEADER')}" <${config.get('email.EMAIL_USERNAME')}>`;

const confirmationfilePath = path.join(__dirname, 'views', 'confirmationEmail.html')
const afterRegisterfilePath = path.join(__dirname, 'views', 'afterRegister.html')
const resetPasswordfilePath = path.join(__dirname, 'views', 'resetPassword.html')



//data : to,info
const sendConfirmationMail = async (data) => {

    const fsReadFileAsync = Promise.promisify(fs.readFile)

    const content = await fsReadFileAsync(confirmationfilePath, 'utf-8')

    const template = handlebars.compile(content)
    const page = template(data.info)

    const mailOptions = {
        from: sender,
        to: data.to,
        subject: 'Please confirm your email address !',
        html: page
    }

    const info = await transport.sendMail(mailOptions)

    return info


}

//data : to,info
const sendAfterRegisterMail = async (data) => {

    const fsReadFileAsync = Promise.promisify(fs.readFile)

    const content = await fsReadFileAsync(afterRegisterfilePath, 'utf-8')

    const template = handlebars.compile(content)
    const page = template(data.info)

    const mailOptions = {
        from: sender,
        to: data.to,
        subject: 'Account created successfully !',
        html: page
    }

    const info = await transport.sendMail(mailOptions)

    return info

}


//data : to,info
const sendResetPasswordMail = async (data) => {

    const fsReadFileAsync = Promise.promisify(fs.readFile)

    const content = await fsReadFileAsync(resetPasswordfilePath, 'utf-8')

    const template = handlebars.compile(content)
    const page = template(data.info)

    const mailOptions = {
        from: sender,
        to: data.to,
        subject: 'Reset password request',
        html: page
    }

    const info = await transport.sendMail(mailOptions)

    return info

}

const sendMail = async ({
    to,
    subject,
    content
}) => {

    let mailOptions = {
        from: sender,
        to,
        subject,
        html: content
    };

    const info = await transport.sendMail(mailOptions)

    return info
}

module.exports = {
    sendConfirmationMail,
    sendAfterRegisterMail,
    sendResetPasswordMail,
    sendMail
}
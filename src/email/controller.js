import nodemailer  from 'nodemailer' 
import handlebars  from 'handlebars' 
import googleapis  from 'googleapis' 
import fs  from 'fs' 
import config from 'config'
import path from "path"

const OAuth2 = googleapis.google.auth.OAuth2;

const oauth2Client = new OAuth2(
    config.get('email.EMAIL_CLIENT_ID'), // ClientID
    config.get('email.EMAIL_CLIENT_SECRET'), // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

const __dirname = path.resolve()

oauth2Client.setCredentials({
    refresh_token:config.get('email.EMAIL_REFRESH_TOKEN')
});


const accessToken = oauth2Client.getAccessToken()


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user:config.get('email.EMAIL_USERNAME'), 
        clientId:config.get('email.EMAIL_CLIENT_ID'),
        clientSecret:config.get('email.EMAIL_CLIENT_SECRET'),
        refreshToken:config.get('email.EMAIL_REFRESH_TOKEN'),
        accessToken: accessToken
    }
});

const sender = `"${config.get('email.EMAIL_HEADER')}" <${config.get('email.EMAIL_USERNAME')}>`;

const confirmationfilePath = __dirname + '/views/confirmationEmail.html';
const afterRegisterfilePath = __dirname + '/views/afterRegister.html';
const resetPasswordfilePath = __dirname + '/views/resetPassword.html';



//data : to,info
const sendConfirmationMail = async (data) => {

    fs.readFile(confirmationfilePath, 'utf-8', async function (error, content) {

        if (error){
            
            throw error

        } 
        
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
    })

}

//data : to,info
const sendAfterRegisterMail = async (data) => {

    fs.readFile(afterRegisterfilePath, 'utf-8', async function (error, content) {

        if (error){
            
            throw error

        } 
        
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
    })

}


//data : to,info
const sendResetPasswordMail = async (data) => {

    fs.readFile(resetPasswordfilePath, 'utf-8', async function (error, content) {

        if (error){
            
            throw error

        } 
        
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
    })

}

const sendMail = async ({to,subject,content}) => {

    let mailOptions = {
        from: sender,
        to,
        subject,
        html: content
    };

    const info = await transport.sendMail(mailOptions)

    return info
}

export default {
    sendConfirmationMail,
    sendAfterRegisterMail,
    sendResetPasswordMail,
    sendMail
}
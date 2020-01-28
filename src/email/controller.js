import nodemailer  from 'nodemailer' 
import handlebars  from 'handlebars' 
import { google }  from 'googleapis' 
import fs  from 'fs' 
import async  from 'async' ;
import Promise  from 'bluebird' 

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.EMAIL_CLIENT_ID, // ClientID
    process.env.EMAIL_CLIENT_SECRET, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.EMAIL_REFRESH_TOKEN
});


const accessToken = oauth2Client.getAccessToken()


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USERNAME, 
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: accessToken
    }
});

const sender = `"${process.env.EMAIL_HEADER}" <${process.env.EMAIL_USERNAME}>`;

const confirmationfilePath = __dirname + '/views/confirmationEmail.html';
const afterRegisterfilePath = __dirname + '/views/afterRegister.html';
const resetPasswordfilePath = __dirname + '/views/resetPassword.html';



//data : to,info
exports.sendConfirmationMail = (data) => {


    return new Promise((resolve, reject) => {

        async.waterfall([

            (callback) => {
                
                fs.readFile(confirmationfilePath, 'utf-8', function (error2, content) {

                    if (error2){
                        
                        callback(error2, null)
                    } 

                    
                    let template = handlebars.compile(content);
                    let fileInfo = data.info;
                    let page = template(fileInfo);
                    
                    callback(null, page)
                });

            },

            (page, callback) => {
                
                let mailOptions = {
                    from: sender,
                    to: data.to,
                    subject: 'Please confirm your email address !',
                    html: page
                };
                
                transport.sendMail(mailOptions, (error2, info) => {
                    if (error2) {
                        
                        callback(error2, null);
                    }
                    
                    callback(null, info);
                });

            }

        ], (error, result) => {

            if (error) {
                reject(error);

            } else {
                resolve(result);

            }

        });


    });
};

//data : to,info
exports.sendAfterRegisterMail = (data) => {


    return new Promise((resolve, reject) => {

        async.waterfall([

            (callback) => {

                fs.readFile(afterRegisterfilePath, 'utf-8', function (error2, content) {

                    if (error2) callback(error2, null)


                    let template = handlebars.compile(content);
                    let fileInfo = data.info;
                    let page = template(fileInfo);

                    callback(null, page)
                });

            },

            (page, callback) => {

                let mailOptions = {
                    from: sender,
                    to: data.to,
                    subject: 'Account created successfully !',
                    html: page
                };

                transport.sendMail(mailOptions, (error2, info) => {
                    if (error2) {
                        callback(error2, null);
                    }

                    callback(null, info);
                });

            }

        ], (error, result) => {

            if (error) {

                reject(error);

            } else {

                resolve(result);

            }

        });


    });
};


//data : to,info
exports.sendResetPasswordMail = (data) => {


    return new Promise((resolve, reject) => {

        async.waterfall([

            (callback) => {

                fs.readFile(resetPasswordfilePath, 'utf-8', function (error2, content) {

                    if (error2) callback(error2, null)


                    let template = handlebars.compile(content);
                    let fileInfo = data.info;
                    let page = template(fileInfo);

                    callback(null, page)
                });

            },

            (page, callback) => {

                let mailOptions = {
                    from: sender,
                    to: data.to,
                    subject: 'Reset password request',
                    html: page
                };

                transport.sendMail(mailOptions, (error2, info) => {
                    if (error2) {
                        callback(error2, null);
                    }

                    callback(null, info);
                });

            }

        ], (error, result) => {

            if (error) {

                reject(error);

            } else {

                resolve(result);

            }

        });


    });
};

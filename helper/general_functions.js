const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const details = require('../config/details.json');

const generateJWTToken = async (payload) => {
    return jwt.sign({ email: payload.email, userId: payload._id, role: payload.role, payload: payload }, process.env.JWT_KEY, { expiresIn: "48h" });
}

const sendMail = async (mail) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: details.email,
                pass: details.password
            }
        });
        const html = fs.readFileSync(path.join(__dirname, `../views/${mail.mail_file}`), 'utf8');
        const template = handlebars.compile(html)(mail.data);
        const mailOptions = {
            from: '"noreply@test.com "<noreply@test.com>',
            to: mail.to,
            cc: mail.cc || [],
            subject: mail.subject,
            html: template,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) { console.log(error); }
        });
    }
    catch (error) { console.error(error); }
}

module.exports = {
    generateJWTToken: generateJWTToken,
    sendMail: sendMail
}
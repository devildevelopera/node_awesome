exports.sendemail = async () => {
    console.log('started sending email...');
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'baymax.development@gmail.com',
            pass: 'sbaetyffyhzjscgk'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    const mailOptions = {
        from: 'miguel.hoffman.dev519@gmail.com',
        to: 'miclelee19951025@gmail.com',
        subject: 'Contact Me',
        html: 'Hello World'
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);

        else
            console.log(info);
    });
}
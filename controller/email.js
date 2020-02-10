exports.sendemail = async (user_id) => {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'miguel.hoffman.dev519@gmail.com',
            pass: 'ddfjynwrhyvcdfox'
        }
    });

    var mailOptions = {
        from: 'miguel.hoffman.dev519@gmail.com',
        to: 'miguelhoffmannsmart@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
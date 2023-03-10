//npm install --save @types/nodemailer
// npm i nodemailer


export const handleEmailVerification = (userEmail: string ,userId: string, activationCode: string) => {
  
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  
  let mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Welcome, please confirm your e-mail`,
            html: '',
  };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('OK, send');
            };
        })
  
}
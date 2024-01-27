

const nodemailer=require('nodemailer')
const Sender_user=process.env.EMAIL_SENDER_USER
const Email_pass=process.env.EMAIL_ACCESS_PASSWORD

if(Sender_user==undefined ||Email_pass==undefined ){
    throw new Error("plase set email and pass in env so email can be send")
}
module.exports.email_sending = async ({to,subject,text}) => {

    try {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:Sender_user ,
          pass:Email_pass 
        }
      });
      
      var mailOptions = {
        from: 'kritestemail123@gmail.com',
        to:to,
        subject: subject,
        text:text
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return error;
        } else {
            
          console.log('Email sent: ' + info.response);
          return info.response
        }
      });
    } catch (error) {
      return error
    }


    };
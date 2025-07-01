const nodemailer = require('nodemailer');


const sendMail =async(paymentDetails,status)=>{

    try{
           const name = paymentDetails.notes.userName;
           const userEmail = paymentDetails.notes.userEmail;
           const amount = paymentDetails.amount/100;
           const projectName = paymentDetails.notes.projectName;
    const transporter = nodemailer.createTransport({
            host:"smtp-relay.brevo.com",
            port:587,
            secure:false,
            auth:{
                user:process.env.BREVO_USER,
                pass: process.env.BREVO_SMTP_KEY,
            }
            });

    const info = await transporter.sendMail({
                from:{
                    name:'SUMIT',
                    address:`<shankhwarsumit117@gmail.com>`
                },
                to : `${userEmail}`,
                subject:"Donation",
                text:`${name} your donation of ${amount} to '${projectName}' is ${status}`,
                html:`<h1 style="color:green">${name} your donation of ${amount} to '${projectName}' is ${status}</h1>`
            });
        }
        catch(err){
            console.log(err);
        }   
}

module.exports = sendMail;
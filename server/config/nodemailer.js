import nodemailer from 'nodemailer'

const transporter =nodemailer.createTransport({
    //we need SMTP details 
    //SMTP stands for simple mail transfer protocol
    //in these we are using the brevo for host ,port etc these all were present in brevo dashboard
    host:'smtp-relay.brevo.com',
    port:587,
    secure:false,
    auth:{
        user:'831af9003@smtp-brevo.com',
        pass:'fDa6OSMcYgqKd5LG',
    },
    logger: true, // Enable logging
    debug: true,  // Enable debug mode
    connectionTimeout: 60000, // Increase timeout to 60 second
    
});
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to SMTP server:', error);
    } else {
        console.log('SMTP server is ready to take messages:', success);
    }
});

export default transporter;
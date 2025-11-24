import mailer from '../config/mailConfig.js';
import mailQueue from '../queues/mailQueue.js';

mailQueue.process(async (job) => {
  const emailData = job.data;
  console.log('Processing email', emailData);

  //send mail
  try {
    const response = await mailer.sendMail(emailData);
    console.log('Email sent', response);
    return response;
  } catch (error) {
    console.log('Error sending email', error);
    throw error;
  }
});

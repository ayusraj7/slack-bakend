import nodemailer from 'nodemailer';

import { EMAIL_ID, EMAIL_PASSWORD } from './serverConfig.js';

export default nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_ID,
    pass: EMAIL_PASSWORD
  }
});

//ioredis helps to connect to the redis database
// bull is used to enqueue the jobs and to process the jobs
// bull-board is used to visualize the jobs in the queue

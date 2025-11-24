import '../processor/mailProcessor.js';

import mailQueue from '../queues/mailQueue.js';

export const addEmailToMailQueue = async (emailData) => {
  try {
    await mailQueue.add(emailData);
    console.log('Email added to the queue', emailData);
  } catch (error) {
    console.log('Error adding email to the queue', error);
    throw error;
  }
};

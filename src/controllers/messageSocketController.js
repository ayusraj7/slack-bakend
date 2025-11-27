import { createMessageService } from '../services/message.service.js';
import { NEW_MESSAGE_EVENT, NEW_MESSAGE_RECEIVED_EVENT } from '../utils/common/eventConstants.js';

export default function messageHandlers(io, socket) {
    console.log('messageHandlers called');
    socket.on(NEW_MESSAGE_EVENT,async (data, cb)=> {
        // Parse string data to object if needed
        const messageData = typeof data === 'string' ? JSON.parse(data) : data;
        const {channelId} = messageData;
        const messageResponse = await createMessageService(messageData);

        io.to(channelId).emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
        //socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
        cb({
            success: true,
            message: 'Message created successfully',
            data: messageResponse
        });
    });
}



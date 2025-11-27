import { createMessageService } from '../services/message.service.js';
import { NEW_MESSAGE_EVENT, NEW_MESSAGE_RECEIVED_EVENT } from '../utils/common/eventConstants.js';

export default function messageHandlers(io, socket) {
    console.log('messageHandlers called');
    socket.on(NEW_MESSAGE_EVENT,async (data, cb)=> {
        console.log('data', data);
        const messageResponse = await createMessageService(data);
        socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
        cb({
            success: true,
            message: 'Message created successfully',
            data: messageResponse
        });
    });
}



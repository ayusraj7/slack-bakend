import { JOIN_CHANNEL_EVENT } from "../utils/common/eventConstants.js";


export default function channelSocketHandlers(io, socket){
    console.log('channelSocket connected');
    socket.on(JOIN_CHANNEL_EVENT, async function joinChannelHandler(data,cb){
        const roomId = data.channelId;
        socket.join(roomId);
        cb({
            success: true,
            message: 'Joined channel successfully',
            data: roomId
        });
    })
}
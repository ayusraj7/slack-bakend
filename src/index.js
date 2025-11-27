import express from 'express';
import { StatusCodes } from 'http-status-codes';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/apiRoutes.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import messageHandlers from './controllers/messageSocketController.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('socket connected',socket.id);
  messageHandlers(io, socket);
  //broadcast helps to emit from server to all the clients who are connected to the server.
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/queues', bullServerAdapter.getRouter());

app.get('/ping', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'pong'
  });
});

app.use('/api', apiRouter);

server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
  connectDB();
});

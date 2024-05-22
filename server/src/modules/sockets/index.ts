import { Server, Socket } from 'socket.io';
import { IProduct } from '../Products/interfaces/IProduct';
import LiveStreamService from '../Livestreams/services/LiveStreamService';

const rooms = new Map<string, string>(); // Map of roomId to host socket ID


const biddingItems: { [key: string]: IProduct[] } = {}; // Dictionary to store products for each room


interface RoomData {
  roomId: string;
  products: IProduct[];
}
export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('a user connected');

    socket.on('createRoom', (roomId) => {
      rooms.set(roomId, socket.id);
      socket.join(roomId);
      console.log(`Host created and joined room: ${roomId}`);
    });

    socket.on('joinRoom', (roomId) => {
      console.log(roomId)
      console.log(rooms);
      if (rooms.has(roomId)) {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      } else {
        socket.emit('error', { message: 'Room does not exist' });
      }
    });

    socket.on('startAuction', (roomId) => {});
    socket.on('endAuction', (roomId) => {});

    // socket

    socket.on('add', (data) => {
      const { roomId, bid } = data;
      console.log(`new bid received for room ${roomId}:`, bid);

      io.to(roomId).emit('highestBid', bid);
    });

    const handleBiddingItems = (data: RoomData, io: Server) => {
      const { roomId, products } = data;    
      // Update the products for the room
      biddingItems[roomId] = products;
    
      // Emit the updated products to the room
      io.to(roomId).emit('bidding-items', products);
    };

    const handleGetBiddingItems = (roomId: string, callback: (products: IProduct[]) => void) => {
      // Send the current products for the room to the host
      const products = biddingItems[roomId] || [];
      callback(products);
    };

    socket.on('add-bidding-item', (data: RoomData) => handleBiddingItems(data, io));

    socket.on('get-bidding-items', (roomId: string, callback: (products: IProduct[]) => void) => {
      handleGetBiddingItems(roomId, callback);
    });


    
    
    // socket.on('add', (data) => {
    //   const { roomId, bid } = data;
    //   console.log(`new bid received for room ${roomId}:`, bid);

    //   io.to(roomId).emit('highestBid', bid);
    // });

    socket.on('disconnect', () => {
      for (const [roomId, hostSocketId] of rooms.entries()) {
        if (hostSocketId === socket.id) {

          io.to(roomId).emit('roomClosed', { message: 'Host has left. Room is closed.' });
          io.socketsLeave(roomId);
          const response = LiveStreamService.updateWhere({
            uuid: roomId,
          }, {
            status: 'offline',
          
          });
          console.log(response);
          biddingItems.roomId = [];
          delete biddingItems.roomId
          rooms.delete(roomId);
          console.log(`Room ${roomId} closed as host disconnected.`);
          break;
        }
      }
      console.log('user disconnected');
    });
  });
};

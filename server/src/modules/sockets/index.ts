import { Server, Socket } from 'socket.io';
import { IProductHostItem, auctionStatus } from '../Products/interfaces/IProduct';
import LiveStreamService from '../Livestreams/services/LiveStreamService';
import { authenticateSocket } from '../../middlewares/authMiddleware';
const rooms = new Map<string, string>(); // Map of roomId to host socket ID
import { User } from '../Users/models/User';
import ProductBidService from '../ProductBid/ProductBidService';
import { ProductBid } from '../ProductBid/models/ProductBid';

const biddingItems: { [key: string]: IProductHostItem[] } = {}; // Dictionary to store products for each room
const biddingItemsHashMap: {
  [key:string]:{
    [key:string]:IProductHostItem
  }
}  = {};

interface RoomData {
  roomId: string;
  products: IProductHostItem[];
}

interface Log {
  user:User;
  message:string;
}

const roomLogs: { [key: string]: Log[] } = {};

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

    const log = (roomId:string) => {
      io.to(roomId).emit('logs', roomLogs[roomId]);
    }
    
    socket.on('accept-bid', async (data) => {
      console.log(data)
      const { roomId,  product } = data;    
      console.log(product);
      //saving the bid to the database accorind the format
      if(!product.highestBidder){
        return;

      }
      
      product.auction_status = 'accepted';
      try {
        const response = await ProductBid.create({
          user_id: product?.highestBidder?.id,
          product_id: product.id,
          bid_price: product.price,
          status: product.auction_status as "accepted" | "pending" | "rejected",
          // currency: product.currency,
          // item_id: product.item_id,
        });
        
        product.highest_bid_id = response.id;
        console.log(response);
      } catch (error) {
        console.log(error);
        
      }
      
      biddingItemsHashMap[roomId][product.id] = product;

      if(roomLogs[roomId] == null){
        roomLogs[roomId] = [];
      }

      roomLogs[roomId].push({user:product.highestBidder, message:`Bid of ${product.price} accpeted for ${product.name}`});
      log(roomId);
      updateRoom(roomId);      
    })

    socket.on('add', (data) => {
      const { roomId, bid } = data;
      console.log(`new bid received for room ${roomId}:`, bid);

      io.to(roomId).emit('highestBid', bid);
    });

    const handleBiddingItems = (data: RoomData, io: Server) => {
      const { roomId, products } = data;    
      // Update the products for the room
      products.forEach((product) => {
        if(biddingItemsHashMap[roomId] == null){
          biddingItemsHashMap[roomId] = {};
        }
        biddingItemsHashMap[roomId][product.id] = product;
      })


    
      // Emit the updated products to the room
      io.to(roomId).emit('bidding-items', products);
    };

    const handleGetBiddingItems = (roomId: string, callback: (products: IProductHostItem[]) => void) => {
      // Send the current products for the room to the host
      const products = biddingItemsHashMap[roomId] ?? [];
      callback(Object.values(products)); // Invoke the callback with the products
    };

    socket.on('add-bidding-item', (data: RoomData) => handleBiddingItems(data, io));

    socket.on('get-bidding-items', (roomId: string, callback: (products: IProductHostItem[]) => void) => {
      handleGetBiddingItems(roomId, callback);
    });

    const updateRoom = (roomId:any) => {
      console.log("update room");
      io.to(roomId).emit('bidding-items', Object.values(biddingItemsHashMap[roomId]??[]));
    }


    socket.on('newBid', (data) => {
      const { roomId, product } = data;
      if(!rooms.has(roomId)) {
        console.log(`Host created and joined room: ${roomId}`);
        socket.emit('bidRejected', { reason: 'Room does not exist' });
        return;
      }

      console.log(product);
      const biddedProduct = biddingItemsHashMap[roomId][product.id]??null;
      console.log('new bid received for room:', product.name);
      if(biddedProduct.price < product.price){
        biddingItemsHashMap[roomId][product.id] = product;

        
        if(roomLogs[roomId] == null){
          roomLogs[roomId] = [];
        }
        roomLogs[roomId].push({user:product.highestBidder, message:`Bid of ${product.price} accpeted for ${product.name}`});
        log(roomId);
        updateRoom(roomId);
        return;
      }
      socket.emit('bidRejected', { reason: 'Bid is less than the highest bid' });
    });

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
          delete biddingItems[roomId]
          delete biddingItemsHashMap[roomId]
          rooms.delete(roomId);
          console.log(`Room ${roomId} closed as host disconnected.`);
          break;
        }
      }
      console.log('user disconnected');
    });
  });
};

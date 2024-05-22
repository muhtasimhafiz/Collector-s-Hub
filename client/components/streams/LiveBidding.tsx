import { useEffect, useState } from 'react';
import socket from '@/Services/socket';

const LiveBidding = () => {
  const [highestBid, setHighestBid] = useState({ amount: 0, user: '' });
  const [bidAmount, setBidAmount] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    socket.on('highestBid', (bid) => {
      setHighestBid(bid);
    });

    socket.on('bidRejected', (data) => {
      alert(data.reason);
    });

    return () => {
      socket.off('highestBid');
      socket.off('bidRejected');
    };
  }, []);

  const placeBid = () => {
    socket.emit('newBid', { amount: bidAmount, user: userName });
  };

  return (
    <div>
      <h1>Live Bidding</h1>
      <h2>Current Highest Bid: ${highestBid.amount} by {highestBid.user}</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Your Bid"
        value={bidAmount}
        onChange={(e) => setBidAmount(Number(e.target.value))}
      />
      <button onClick={placeBid}>Place Bid</button>
    </div>
  );
};

export default LiveBidding;

import React, { useState, useEffect } from 'react';
import { sendQuery, socket } from '../../services/api.js'; // Importar socket desde api.js

const Chat = () => {
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [internetAccess, setInternetAccess] = useState(false);
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const [stats, setStats] = useState({ queries: 0, tokens: 0 });

  useEffect(() => {
    socket.on('response', (data) => {
      setResponses((prev) => [...prev, data]);
      setStats((prev) => ({
        queries: prev.queries + 1,
        tokens: prev.tokens + data.tokens,
      }));
    });
  }, []);

  const handleSendQuery = async () => {
    const response = await sendQuery(query, model, internetAccess);
    socket.emit('query', response);
    setQuery('');
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <select value={model} onChange={(e) => setModel(e.target.value)} className="p-2 border">
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
        </select>
        <label className="ml-4">
          <input type="checkbox" checked={internetAccess} onChange={() => setInternetAccess(!internetAccess)} />
          Internet Access
        </label>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border w-full"
        />
        <button onClick={handleSendQuery} className="p-2 bg-blue-500 text-white">
          Send
        </button>
      </div>
      <div className="mb-4">
        <h2>Responses</h2>
        <ul>
          {responses.map((res, index) => (
            <li key={index}>{res.message}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Statistics</h2>
        <p>Queries: {stats.queries}</p>
        <p>Tokens: {stats.tokens}</p>
      </div>
    </div>
  );
};

export default Chat;

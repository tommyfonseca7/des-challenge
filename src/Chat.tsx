// src/components/Chat.tsx ws://summercamp24.ddns.net:4000
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';

// Definindo a interface para mensagens de chat
interface ChatMessageDTO {
  senderId: string;
  receiverId: string; // Pode ser "all" para mensagens públicas
  message: string;
  datetime: string; // Normalmente preenchido pelo servidor
}

// Definindo a interface para os jogadores
interface PlayerDTO {
  id: string;
  name: string;
}

interface ChatProps {
  player: PlayerDTO; // Informação do jogador que está usando o chat
}

const Chat: React.FC<ChatProps> = ({ player }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Conectar ao servidor WebSocket
    const ws = new WebSocket('ws://summercamp24.ddns.net:4000'); // Substitua pela URL do seu servidor WebSocket
    setSocket(ws);

    ws.onopen = () => {
      console.log('Conectado ao WebSocket');
      // Enviar confirmação de conexão
      ws.send(JSON.stringify({ type: 'connect-confirm', payload: player }));
    };

    ws.onmessage = (event) => {
      const message: ChatMessageDTO = JSON.parse(event.data);
      if (message.receiverId === 'all' || message.receiverId === player.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    ws.onclose = () => {
      console.log('Desconectado do WebSocket');
    };

    ws.onerror = (error) => {
      console.error('Erro no WebSocket', error);
    };

    // Fechar a conexão quando o componente for desmontado
    return () => {
      ws.close();
    };
  }, [player]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !socket) return;

    const chatMessage: ChatMessageDTO = {
      senderId: player.id,
      receiverId: 'all', // Enviando mensagem para todos os jogadores
      message: newMessage,
      datetime: new Date().toISOString(), // Preenchido pelo servidor, mas podemos registrar localmente
    };

    socket.send(JSON.stringify({ type: 'send-message', payload: chatMessage }));
    setNewMessage('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {/* Botão para abrir/fechar o chat */}
      <button
        onClick={toggleChat}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2z"
          />
        </svg>
      </button>

      {/* Janela do chat */}
      {isOpen && (
        <div className="bg-white w-72 h-96 rounded-lg shadow-lg mt-2 flex flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <h2 className="text-lg">Chat ao Vivo</h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-sm">
                Nenhuma mensagem ainda...
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="text-gray-800 mb-2">
                  <strong>{message.senderId === player.id ? 'Você' : message.senderId}:</strong> {message.message}
                </div>
              ))
            )}
          </div>
          <div className="border-t p-2 flex flex-col">
            <div className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border rounded-md"
                placeholder="Digite uma mensagem..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md focus:outline-none"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

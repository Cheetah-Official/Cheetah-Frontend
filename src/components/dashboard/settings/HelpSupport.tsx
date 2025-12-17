import { FaQuestionCircle, FaPaperPlane } from "react-icons/fa"

type ChatMessage = {
  id: number
  text: string
  sender: "user" | "agent"
}

type HelpSupportProps = {
  chatMessages: ChatMessage[]
  chatMessage: string
  onChatMessageChange: (message: string) => void
  onSendMessage: () => void
}

export default function HelpSupport({
  chatMessages,
  chatMessage,
  onChatMessageChange,
  onSendMessage,
}: HelpSupportProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Customer Support</h3>
          <p className="text-sm text-gray-500 mt-1">Adedeji Emeka</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#8B2323] flex items-center justify-center">
          <FaQuestionCircle className="text-white w-5 h-5" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex flex-col max-w-[80%]">
              {message.sender === "user" && (
                <span className="text-xs text-gray-500 mb-1 text-right">You</span>
              )}
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => onChatMessageChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && chatMessage.trim()) {
              onSendMessage()
            }
          }}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323] text-sm"
        />
        <button
          onClick={() => {
            if (chatMessage.trim()) {
              onSendMessage()
            }
          }}
          className="w-10 h-10 rounded-full bg-[#8B2323] flex items-center justify-center hover:bg-[#7A1F1F] transition-colors cursor-pointer"
          aria-label="Send message"
        >
          <FaPaperPlane className="text-white w-4 h-4" />
        </button>
      </div>
    </div>
  )
}


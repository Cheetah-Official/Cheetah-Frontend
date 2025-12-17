import { FaChevronRight } from "react-icons/fa"
import AccountSettings from "./AccountSettings"
import HelpSupport from "./HelpSupport"
import TermsPolicies from "./TermsPolicies"

type User = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string | null
}

type ChatMessage = {
  id: number
  text: string
  sender: "user" | "agent"
}

type SettingsTabProps = {
  activeSubPage: string
  user: User | null
  chatMessages: ChatMessage[]
  chatMessage: string
  onSubPageChange: (page: string) => void
  onChatMessageChange: (message: string) => void
  onSendMessage: () => void
}

export default function SettingsTab({
  activeSubPage,
  user,
  chatMessages,
  chatMessage,
  onSubPageChange,
  onChatMessageChange,
  onSendMessage,
}: SettingsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Left Panel - Settings Categories */}
      <div className="space-y-4">
        <div 
          className={`rounded-lg p-4 cursor-pointer transition-colors ${
            activeSubPage === "account" 
              ? "bg-gray-100" 
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSubPageChange("account")}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">Account Settings</span>
            <FaChevronRight className="text-gray-500" />
          </div>
        </div>

        <div 
          className={`rounded-lg p-4 cursor-pointer transition-colors ${
            activeSubPage === "help" 
              ? "bg-gray-100" 
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSubPageChange("help")}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">Help & Support</span>
            <FaChevronRight className="text-gray-500" />
          </div>
        </div>

        <div 
          className={`rounded-lg p-4 cursor-pointer transition-colors ${
            activeSubPage === "terms" 
              ? "bg-gray-100" 
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => onSubPageChange("terms")}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">Terms & Policies</span>
            <FaChevronRight className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Right Panel - Content based on active sub-page */}
      {activeSubPage === "account" && (
        <AccountSettings user={user} />
      )}

      {activeSubPage === "help" && (
        <HelpSupport
          chatMessages={chatMessages}
          chatMessage={chatMessage}
          onChatMessageChange={onChatMessageChange}
          onSendMessage={onSendMessage}
        />
      )}

      {activeSubPage === "terms" && (
        <TermsPolicies />
      )}
    </div>
  )
}


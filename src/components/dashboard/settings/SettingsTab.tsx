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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      {/* Left Panel - Settings Categories */}
      <div className="space-y-3 sm:space-y-4">
        <div 
          className={`rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
            activeSubPage === "account" 
              ? "bg-gray-100" 
              : "bg-gray-100 hover:bg-[#F5F0F0]"
          }`}
          onClick={() => onSubPageChange("account")}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800 text-sm sm:text-base">Account Settings</span>
            <FaChevronRight className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div 
          className={`rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
            activeSubPage === "help" 
              ? "bg-gray-100" 
              : "bg-gray-100 hover:bg-[#F5F0F0]"
          }`}
          onClick={() => onSubPageChange("help")}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800 text-sm sm:text-base">Help & Support</span>
            <FaChevronRight className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div 
          className={`rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
            activeSubPage === "terms" 
              ? "bg-gray-100" 
              : "bg-gray-100 hover:bg-[#F5F0F0]"
          }`}
          onClick={() => onSubPageChange("terms")}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800 text-sm sm:text-base">Terms & Policies</span>
            <FaChevronRight className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
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


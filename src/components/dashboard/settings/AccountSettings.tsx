import Image from "next/image"

type User = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string | null
}

type AccountSettingsProps = {
  user: User | null
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {user ? `${user.first_name} ${user.last_name}` : ""}
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Image src="/Mail.png" alt="Email" width={14} height={14} className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Email</span>
          </div>
          <span className="text-gray-500">{user?.email || ""}</span>
        </div>
        
        <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Image src="/Phone.png" alt="Phone" width={14} height={14} className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Phone Number</span>
          </div>
          <span className="text-gray-500">{user?.phone ?? ""}</span>
        </div>
        
        <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Image src="/Address.png" alt="Address" width={14} height={14} className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Home Address</span>
          </div>
          <span className="text-gray-500">&nbsp;</span>
        </div>
      </div>
    </div>
  )
}


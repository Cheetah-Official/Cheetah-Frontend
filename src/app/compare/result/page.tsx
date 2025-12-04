"use client"

import Image from "next/image"
import { useState, useEffect, Suspense } from "react"
import { FaTimes } from "react-icons/fa"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { bookingsApi } from "@/lib/api/endpoints/bookings"

function CompareResultContent() {
  const [passengers, setPassengers] = useState(1)
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [from, setFrom] = useState<string>("")
  const [to, setTo] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [providersCsv, setProvidersCsv] = useState<string>("")
  // Debounced filter values
  const [dMinPrice, setDMinPrice] = useState<string>("")
  const [dMaxPrice, setDMaxPrice] = useState<string>("")
  const [dProvidersCsv, setDProvidersCsv] = useState<string>("")

  // Set default dates on component mount
  useEffect(() => {
    // Initialize from query params when available
    const qpPassengers = searchParams.get("passengers")
    const qpDeparture = searchParams.get("departure")
    const qpReturn = searchParams.get("returnDate")
    const qpFrom = searchParams.get("from")
    const qpTo = searchParams.get("to")

    if (qpPassengers) {
      const num = parseInt(qpPassengers, 10)
      if (!Number.isNaN(num) && num > 0) setPassengers(num)
    }
    if (qpDeparture) setDepartureDate(qpDeparture)
    if (qpReturn) setReturnDate(qpReturn)
    if (qpFrom) setFrom(qpFrom)
    if (qpTo) setTo(qpTo)
  }, [searchParams])

  // Fetch available routes using React Query when required params are present
  const dateISO = departureDate ? `${departureDate}T00:00:00` : ""
  const canSearch = Boolean(from && to && dateISO)

  // Debounce filters (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDMinPrice(minPrice), 300)
    return () => clearTimeout(t)
  }, [minPrice])
  useEffect(() => {
    const t = setTimeout(() => setDMaxPrice(maxPrice), 300)
    return () => clearTimeout(t)
  }, [maxPrice])
  useEffect(() => {
    const t = setTimeout(() => setDProvidersCsv(providersCsv), 300)
    return () => clearTimeout(t)
  }, [providersCsv])

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      "searchRoutes",
      { from, to, dateISO, minPrice: dMinPrice, maxPrice: dMaxPrice, providers: dProvidersCsv },
    ],
    queryFn: async () =>
      bookingsApi.searchRoutes({
        origin: from!,
        destination: to!,
        date: dateISO,
        include_comparison: true,
        sort_by: "departure_time",
        min_price: dMinPrice ? Number(dMinPrice) : undefined,
        max_price: dMaxPrice ? Number(dMaxPrice) : undefined,
        providers: dProvidersCsv || undefined,
      }),
    enabled: canSearch,
  })

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Blurred background image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/Hero-1.jpeg')", filter: 'blur(8px)' }} />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      {/* Centered Card */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="absolute left-8 top-8">
          <button
            className="bg-white rounded-full shadow p-2 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => router.push('/')}
            aria-label="Close and return to home"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="mx-auto flex bg-white rounded-2xl shadow-2xl p-8 items-center gap-10 max-w-4xl w-full justify-center">
          {/* Bus Image */}
          <div className="flex-shrink-0">
            <Image src="/Cheetah Bus Image 1.png" alt="Cheetah Bus" width={320} height={200} className="object-contain" />
          </div>
          {/* Details Card */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <Image src="/PeaceMass-Logo.jpg" alt="Peace Mass" width={48} height={48} className="object-contain rounded-lg" />
              <div>
                <div className="font-bold text-lg text-[#222]">Peace Mass</div>
                <div className="text-gray-500 text-sm">{from || "Lagos"} - {to || "Abuja"}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-black font-medium">Passenger</span>
              <div className="flex items-center border rounded-lg bg-white">
                <button type="button" className="px-3 py-1 text-lg text-black cursor-pointer" onClick={() => setPassengers(p => Math.max(1, p - 1))}>-</button>
                <span className="px-4 font-semibold text-black">{passengers}</span>
                <button type="button" className="px-3 py-1 text-lg text-black cursor-pointer" onClick={() => setPassengers(p => p + 1)}>+</button>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Departure Date</span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border text-gray-700 bg-white focus:outline-none w-36 font-medium"
                  aria-label="Departure Date"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Return Date <span className="text-xs text-[#E08B2F]">(if round trip)</span></span>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border text-gray-700 bg-white focus:outline-none w-36 font-medium"
                  aria-label="Return Date"
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#1CBF4B] mt-2 mb-2">₦26,000</div>
            <button
              className="bg-[#8B2323] text-white px-10 py-3 rounded-lg font-semibold text-lg cursor-pointer w-full"
              onClick={() => {
                const el = typeof document !== 'undefined' ? document.getElementById('compare-results') : null
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >Proceed</button>
          </div>
        </div>
        {/* Filters */}
        <div className="mt-6 w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow p-4 mb-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Min price"
              className="px-3 py-2 rounded border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323]"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Max price"
              className="px-3 py-2 rounded border bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323]"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Providers (comma-separated)"
              className="px-3 py-2 rounded border md:col-span-2 bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B2323]/30 focus:border-[#8B2323]"
              value={providersCsv}
              onChange={(e) => setProvidersCsv(e.target.value)}
            />
            <button
              className="px-3 py-2 rounded bg-gray-200 text-gray-800 font-semibold cursor-pointer"
              onClick={() => { setMinPrice(""); setMaxPrice(""); setProvidersCsv(""); }}
            >
              Clear filters
            </button>
          </div>
          {/* Active filter chips */}
          {(dMinPrice || dMaxPrice || (dProvidersCsv && dProvidersCsv.trim())) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {dMinPrice && (
                <span className="inline-flex items-center gap-2 bg-gray-100 border rounded-full px-3 py-1 text-sm">
                  Min ₦{Number(dMinPrice).toLocaleString()}
                  <button
                    className="text-gray-600 hover:text-black"
                    onClick={() => setMinPrice("")}
                    aria-label="Remove min price filter"
                  >×</button>
                </span>
              )}
              {dMaxPrice && (
                <span className="inline-flex items-center gap-2 bg-gray-100 border rounded-full px-3 py-1 text-sm">
                  Max ₦{Number(dMaxPrice).toLocaleString()}
                  <button
                    className="text-gray-600 hover:text-black"
                    onClick={() => setMaxPrice("")}
                    aria-label="Remove max price filter"
                  >×</button>
                </span>
              )}
              {dProvidersCsv && dProvidersCsv.split(",").map(p => p.trim()).filter(Boolean).map((prov, idx) => (
                <span key={`${prov}-${idx}`} className="inline-flex items-center gap-2 bg-gray-100 border rounded-full px-3 py-1 text-sm">
                  {prov}
                  <button
                    className="text-gray-600 hover:text-black"
                    onClick={() => {
                      const arr = dProvidersCsv.split(",").map(v => v.trim()).filter(Boolean)
                      const next = arr.filter(v => v.toLowerCase() !== prov.toLowerCase())
                      setProvidersCsv(next.join(", "))
                    }}
                    aria-label={`Remove provider ${prov}`}
                  >×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div id="compare-results" className="mt-6 w-full max-w-4xl mx-auto">
          {(isLoading || isFetching) && (
            <div className="bg-white rounded-xl shadow p-4 text-gray-600">Loading routes…</div>
          )}
          {!canSearch && (
            <div className="bg-white rounded-xl shadow p-4 text-gray-600">
              Select origin, destination and a departure date to see available routes.
            </div>
          )}
          {isError && (
            <div className="bg-white rounded-xl shadow p-4 text-red-600">
              Failed to load routes. {String((error as any)?.message || "")}
            </div>
          )}
          {data && data.routes && data.routes.length > 0 && (
            <div className="bg-white rounded-xl shadow divide-y">
              {data.routes.map((r) => (
                <div key={r.schedule_id} className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#8B2323]">{r.provider_name}</span>
                      <span className="text-xs text-gray-500">{r.vehicle_type}</span>
                    </div>
                    <div className="text-sm text-gray-700 truncate">
                      {r.origin} → {r.destination}
                    </div>
                    <div className="text-xs text-gray-500">
                      Departs: {new Date(r.departure_time).toLocaleString()} • Arrives:{" "}
                      {new Date(r.arrival_time).toLocaleString()} • Duration: {r.duration_minutes}m
                    </div>
                    <div className="text-xs text-gray-500">
                      Seats: {r.available_seats}/{r.total_seats} • Amenities: {r.amenities.join(", ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#1CBF4B]">
                      ₦{r.base_price.toLocaleString()}
                    </div>
                    <button
                      className={`mt-2 px-4 py-2 rounded-lg text-sm cursor-pointer ${r.available_seats > 0 ? 'bg-[#8B2323] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                      disabled={r.available_seats <= 0}
                      onClick={() => r.available_seats > 0 && router.push(`/bookings/${encodeURIComponent(r.schedule_id)}?passengers=${passengers}`)}
                    >
                      {r.available_seats > 0 ? 'Select' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {data && data.routes && data.routes.length === 0 && (
            <div className="bg-white rounded-xl shadow p-4 text-gray-600">
              No routes found for the selected criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CompareResult() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/Hero-1.jpeg')", filter: 'blur(8px)' }} />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="text-xl font-semibold text-[#8B2323]">Loading...</div>
          </div>
        </div>
      </div>
    }>
      <CompareResultContent />
    </Suspense>
  )
} 
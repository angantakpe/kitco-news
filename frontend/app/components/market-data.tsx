"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

// Mock market data
const mockMarketData = [
  { id: 1, name: "NASDAQ", value: 14052.34, change: 1.23 },
  { id: 2, name: "S&P 500", value: 4167.59, change: -0.45 },
  { id: 3, name: "DOW", value: 33665.02, change: 0.78 },
]

export function MarketData() {
  const [marketData, setMarketData] = useState(mockMarketData)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarketData((prevData) =>
        prevData.map((item) => ({
          ...item,
          value: +(item.value + (Math.random() - 0.5) * 10).toFixed(2),
          change: +((Math.random() - 0.5) * 2).toFixed(2),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {marketData.map((item) => (
            <li key={item.id} className="flex justify-between items-center">
              <span>{item.name}</span>
              <span className={item.change >= 0 ? "text-green-600" : "text-red-600"}>
                {item.value.toFixed(2)} ({item.change > 0 ? "+" : ""}
                {item.change.toFixed(2)}%)
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}


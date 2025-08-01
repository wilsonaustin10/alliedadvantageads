import * as React from "react"
import { Calendar } from 'lucide-react'
import { Button } from './button'

interface DateRange {
  from: Date
  to: Date
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempRange, setTempRange] = React.useState(value)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const presets = [
    {
      label: 'Last 7 days',
      getValue: () => ({
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date()
      })
    },
    {
      label: 'Last 30 days',
      getValue: () => ({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date()
      })
    },
    {
      label: 'Last 90 days',
      getValue: () => ({
        from: new Date(new Date().setDate(new Date().getDate() - 90)),
        to: new Date()
      })
    },
    {
      label: 'This month',
      getValue: () => ({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date()
      })
    },
    {
      label: 'Last month',
      getValue: () => {
        const lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)
        return {
          from: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          to: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
        }
      }
    }
  ]

  return (
    <div className={`relative ${className || ''}`}>
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className="justify-start text-left font-normal"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {formatDate(value.from)} - {formatDate(value.to)}
      </Button>
      
      {open && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-50 mt-2 w-80 rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">Date Range</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={tempRange.from.toISOString().split('T')[0]}
                    onChange={(e) => setTempRange({
                      ...tempRange,
                      from: new Date(e.target.value)
                    })}
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={tempRange.to.toISOString().split('T')[0]}
                    onChange={(e) => setTempRange({
                      ...tempRange,
                      to: new Date(e.target.value)
                    })}
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 mb-2">Quick select</p>
                <div className="space-y-1">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        const range = preset.getValue()
                        setTempRange(range)
                        onChange(range)
                        setOpen(false)
                      }}
                      className="w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onChange(tempRange)
                    setOpen(false)
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
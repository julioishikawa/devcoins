import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supportedCurrencies } from '@/utils/currency-refactor'

interface CurrencySelectProps {
  selectedCurrency: string
  onCurrencyChange: (currency: string) => void
}

function CurrencySelect({
  selectedCurrency,
  onCurrencyChange,
}: CurrencySelectProps) {
  return (
    <Select onValueChange={onCurrencyChange} value={selectedCurrency}>
      <SelectTrigger className="bg-zinc-800 border-none">
        <SelectValue placeholder="Selecione a moeda" />
      </SelectTrigger>
      <SelectContent>
        {supportedCurrencies.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CurrencySelect

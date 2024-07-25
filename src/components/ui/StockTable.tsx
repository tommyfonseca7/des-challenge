// StockTable.tsx
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the Stock type
interface Stock {
  symbol: string;
  company: string;
  description: string;
  price: number;
}

// Define props for the StockTable component
interface StockTableProps {
  stocks: Stock[];
  onTransaction: (transaction: { symbol: string; quantity: number }) => void; // Callback function to handle the value
}

const StockTable: React.FC<StockTableProps> = ({ stocks, onTransaction }) => {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (symbol: string, value: string) => {
    setSelectedQuantities((prev) => ({ ...prev, [symbol]: parseInt(value, 10) }));
  };

  const handleBuyClick = (stock: Stock) => {
    const quantity = selectedQuantities[stock.symbol];
    if (quantity) {
      alert(`You have selected to buy ${quantity} units of ${stock.symbol}.`);
      // Call the onTransaction callback with transaction details
      onTransaction({ symbol: stock.symbol, quantity });
    } else {
      alert("Please select a quantity before buying.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full px-10 py-5">
      <div className="w-full h-full overflow-y-auto">
        <Table className="min-w-full">
          <TableCaption>Stocks</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Symbol</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-center">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell className="font-medium">{stock.symbol}</TableCell>
                <TableCell>{stock.company}</TableCell>
                <TableCell>{stock.description}</TableCell>
                <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) => handleQuantityChange(stock.symbol, value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="--/--" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    className="m-1 bg-green-500 text-center"
                    onClick={() => handleBuyClick(stock)}
                  >
                    Buy
                  </Button>
                  <Button className="m-1 bg-red-500 text-center">Sell</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockTable;

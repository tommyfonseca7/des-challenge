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

function StockTable({ stocks }) {
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const handleQuantityChange = (symbol, value) => {
    setSelectedQuantities((prev) => ({ ...prev, [symbol]: value }));
  };

  const handleBuyClick = (symbol) => {
    const quantity = selectedQuantities[symbol];
    if (quantity) {
      alert(`You have selected to buy ${quantity} units of ${symbol}.`);
      // Proceed with buy action
    } else {
      alert("Please select a quantity before buying.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full px-10 py-5">
      <div className="w-full h-full overflow-y-auto">
        <Table className="min-w-full">
          <TableCaption></TableCaption>
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
                <TableCell className="text-right">
                  ${stock.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) =>
                      handleQuantityChange(stock.symbol, value)
                    }
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
                    onClick={() => handleBuyClick(stock.symbol)}
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
}

export default StockTable;

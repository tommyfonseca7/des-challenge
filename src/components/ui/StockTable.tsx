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

function StockTable() {
  const [selectedQuantity, setSelectedQuantity] = useState("");

  const handleQuantityChange = (value: React.SetStateAction<string>) => {
    setSelectedQuantity(value);
  };

  const handleBuyClick = () => {
    if (selectedQuantity) {
      alert(`You have selected to buy ${selectedQuantity} units.`);
      // Proceed with buy action
    } else {
      alert("Please select a quantity before buying.");
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-5/6">
      <Table className="">
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
          <TableRow>
            <TableCell className="font-medium">NVDA</TableCell>
            <TableCell>NVIDIA</TableCell>
            <TableCell>GPU company</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
            <TableCell>
              <Select onValueChange={handleQuantityChange}>
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
                onClick={handleBuyClick}
              >
                Buy
              </Button>
              <Button className="m-1 bg-red-500 text-center">Sell</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default StockTable;

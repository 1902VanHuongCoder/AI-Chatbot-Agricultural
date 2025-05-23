"use client";

import React from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerHeader, DrawerFooter, DrawerTitle } from "@/components/ui/drawer/drawer";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

export default function ShoppingCart() {
    const cartItems = [
        {
            id: 1,
            name: "Häagen-Dazs Salted",
            variant: "Blue LG",
            price: 10.0,
            quantity: 1,
            image: "https://cdn-front.freepik.com/images/ai/image-generator/gallery/resource-tti-12.webp", // Replace with the actual image path
        },
        {
            id: 2,
            name: "Häagen-Dazs Salted",
            variant: "Blue LG",
            price: 10.0,
            quantity: 1,
            image: "https://cdn-front.freepik.com/images/ai/image-generator/gallery/resource-tti-13.webp", // Replace with the actual image path
        },
    ];

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <Drawer direction="right">
            {/* Trigger */}
            <DrawerTrigger className="p-2 bg-primary text-white rounded-md">
                Open Cart
            </DrawerTrigger>

            {/* Content */}
            <DrawerContent className="!w-[100%] bg-white text-black font-sans">
                {/* Header */}
                <DrawerHeader className="flex items-center w-full flex-row justify-between border-b pb-4">
                    <DrawerTitle className="text-lg font-bold">Giỏ hàng ({cartItems.length})</DrawerTitle>
                    <DrawerClose className="text-gray-500 hover:text-black">
                        <X size={20} />
                    </DrawerClose>
                </DrawerHeader>

                {/* Cart Items */}
                <div className="p-4 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                            {/* Product Image */}
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="rounded-md"
                            />

                            {/* Product Details */}
                            <div className="flex-1">
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-sm text-gray-500">Variant: {item.variant}</p>
                                <p className="text-sm font-semibold">{item.price.toFixed(2)}$</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                                <button className="p-1 bg-gray-200 rounded-full hover:bg-gray-300">
                                    <Minus size={16} />
                                </button>
                                <span className="w-6 text-center">{item.quantity}</span>
                                <button className="p-1 bg-gray-200 rounded-full hover:bg-gray-300">
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Remove Icon */}
                            <button className="text-gray-500 hover:text-red-500">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <DrawerFooter className="border-t pt-4">

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">Tổng tiền</span>
                        <span className="text-lg font-semibold">{subtotal.toFixed(2)}$</span>
                    </div>


                    <div className="flex flex-col gap-2">
                        <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-hover">
                            Thanh toán
                        </button>
                        <button className="w-full py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300">
                            Chi tiết giỏ hàng
                        </button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
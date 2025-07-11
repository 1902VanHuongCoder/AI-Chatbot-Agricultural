"use client";
import React, { useEffect, useRef, useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerHeader } from "@/components/ui/drawer/drawer";
import { Input } from "@/components/ui/input/input";
import { XIcon, MicIcon } from "lucide-react";
import { DialogDescription, Title } from "@radix-ui/react-dialog";
import Button from "../button/button-brand";
import { baseUrl } from "@/lib/base-url";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/contexts/dictonary-context";

interface Product {
    productID: number;
    productName: string;
    productPrice: string;
    productPriceSale: string;
    quantityAvailable: number;
    categoryID: number;
    originID: number;
    subcategoryID: number;
    images: string[];
    rating: number;
    isShow: boolean;
    expiredAt: Date | null;
    unit: string;
}

interface Suggestion {
    productName: string;
    productID: string;
}


export default function SearchForm() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const { lang } = useDictionary();
    const [listening, setListening] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selectedProductID, setSelectedProductID] = useState<string>("");

    const [, setLoadingSuggest] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    // Voice search handler
    const handleVoiceSearch = () => {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            alert("Trình duyệt của bạn không hỗ trợ voice search.");
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = "vi-VN";
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSearch(transcript);
                setListening(false);
            };
            recognitionRef.current.onerror = () => setListening(false);
            recognitionRef.current.onend = () => setListening(false);
        }
        setListening(true);
        recognitionRef.current.start();
    };

    // Handle view product details
    const handleViewProduct = () => {
        router.push(`/${lang}/homepage/product-details/${selectedProductID}`);
        setOpenSearch(false);
    };

    // Fetch product name suggestions
    useEffect(() => {
        if (search.trim().length === 0) {
            setSuggestions([]);
            return;
        }
        setLoadingSuggest(true);
        const timeout = setTimeout(() => {
            fetch(`${baseUrl}/api/product/name?name=${encodeURIComponent(search)}`)
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    setSuggestions(Array.isArray(data) ? data.map((p: Product) => ({ productName: p.productName, productID: String(p.productID) })) : []);
                })
                .catch(() => setSuggestions([]))
                .finally(() => setLoadingSuggest(false));
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpenSearch(prev => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <Drawer direction="top" defaultOpen={false} open={openSearch} onOpenChange={setOpenSearch}>
            <DrawerTrigger className="flex items-center justify-center rounded-full hover:bg-secondary transition-all duration-200 ease-in-out cursor-pointer">
                <span className="p-3 rounded-full bg-transparent border-[1px] border-solid border-primary/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M8.195 0c4.527 0 8.196 3.62 8.196 8.084a7.989 7.989 0 0 1-1.977 5.267l5.388 5.473a.686.686 0 0 1-.015.98a.71.71 0 0 1-.993-.014l-5.383-5.47a8.23 8.23 0 0 1-5.216 1.849C3.67 16.169 0 12.549 0 8.084C0 3.62 3.67 0 8.195 0Zm0 1.386c-3.75 0-6.79 2.999-6.79 6.698c0 3.7 3.04 6.699 6.79 6.699s6.791-3 6.791-6.699c0-3.7-3.04-6.698-6.79-6.698Z" /></svg>
                </span>
            </DrawerTrigger>

            <DrawerContent className="w-full text-black pb-10">
                <DrawerHeader className="hidden">
                    <Title className="text-lg font-bold hidden">Search</Title>
                    <DialogDescription className="text-sm text-white hidden">
                        {"Bạn có thể thêm chúng vào giỏ hàng hoặc xóa khỏi danh sách này."}
                    </DialogDescription>
                </DrawerHeader>
                <div className="p-4">
                    <div className="w-full flex justify-end">
                        <DrawerClose className="p-2 text-primary">
                            <XIcon size={24} />
                        </DrawerClose>
                    </div>
                    <form className="flex flex-col">
                        <div className="flex items-center gap-2 px-2 md:px-10 mt-4 md:mt-0">
                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="w-full border border-gray-300 rounded-md pl-10 py-5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    autoComplete="off"
                                />
                                <MicIcon
                                    size={20}
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${listening ? "text-green-600 animate-pulse" : "text-gray-500 hover:text-primary"}`}
                                    aria-label="Voice search"
                                    onClick={handleVoiceSearch}
                                />
                            </div>
                            <Button onClick={handleViewProduct} variant="normal" type="button" className="px-4 py-2 bg-primary text-white rounded-md">
                                Tìm kiếm
                            </Button>
                        </div>
                        {/* Suggestions dropdown */}
                        {search && suggestions.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded shadow mt-2 max-h-60 overflow-y-auto mx-2 md:mx-10">
                                {suggestions.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="px-4 py-2 cursor-pointer hover:bg-primary/10"
                                        onClick={() => {
                                            setSearch(item.productName); 
                                            setSelectedProductID(item.productID);
                                        }}
                                    >
                                        {item.productName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>

                    <div className="mt-4 text-sm text-gray-500 text-center">
                        Press <span className="font-bold text-gray-700">CTRL+K</span> to quickly open the search.
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
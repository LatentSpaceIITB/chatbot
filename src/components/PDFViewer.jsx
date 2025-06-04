import React, { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { Button } from "./Button";
import {
    ChevronLeft,
    Search,
    Sun,
    Download,
    Share,
    RotateCw,
    MessageCircle,
    CreditCard,
    HelpCircle,
    FileText,
} from "lucide-react";
import ChatInterface from "./ChatInterface";

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function SelectionPopup({ selectedText, position, onAction, onClose }) {
    const actions = [
        { id: "explain", label: "Explain", icon: HelpCircle },
        { id: "chat", label: "Chat", icon: MessageCircle },
        { id: "quiz", label: "Quiz", icon: FileText },
        { id: "flashcards", label: "Flashcards", icon: CreditCard },
    ];

    return (
        <div
            className="absolute z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-2"
            style={{
                left: position.x,
                top: position.y - 60,
                transform: "translateX(-50%)",
            }}
        >
            <div className="flex gap-1">
                {actions.map((action) => (
                    <Button
                        key={action.id}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-gray-700 flex items-center gap-1"
                        onClick={() => {
                            onAction(action.id, selectedText);
                            onClose();
                        }}
                    >
                        <action.icon className="w-4 h-4" />
                        {action.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default function PDFViewer({ file }) {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedText, setSelectedText] = useState("");
    const [selectionPosition, setSelectionPosition] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInputText, setChatInputText] = useState("");
    const [pageText, setPageText] = useState("");
    const [extractionInfo, setExtractionInfo] = useState("Select a PDF to see extracted text");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const pdfContainerRef = useRef(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setError(null);
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
            const text = selection.toString().trim();
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = pdfContainerRef.current?.getBoundingClientRect();

            if (containerRect) {
                setSelectedText(text);
                setSelectionPosition({
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.top - containerRect.top,
                });
            }
        } else {
            setSelectedText("");
            setSelectionPosition(null);
        }
    };

    const handleAction = (action, text) => {
        if (action === "chat") {
            setChatInputText(text);
        }
    };

    const extractPageText = async (pageNum) => {
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise;
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            // Process text items into lines
            let lines = [];
            let currentLine = "";
            let lastY = null;

            textContent.items.forEach(item => {
                const y = item.transform[5];

                if (lastY === null || Math.abs(y - lastY) > 5) {
                    if (currentLine.trim()) {
                        lines.push(currentLine.trim());
                    }
                    currentLine = item.str;
                } else {
                    currentLine += item.str;
                }
                lastY = y;
            });

            if (currentLine.trim()) {
                lines.push(currentLine.trim());
            }

            const fullText = lines.join('\n').trim();
            setPageText(fullText);

            // Update extraction info
            const wordCount = fullText.split(/\s+/).filter(word => word.length > 0).length;
            const charCount = fullText.length;
            setExtractionInfo(`Extracted ${lines.length} lines, ${wordCount} words, ${charCount} characters from page ${pageNum}`);

        } catch (error) {
            console.error("Error extracting text:", error);
            setError(error.message);
            setExtractionInfo("Error extracting text from PDF");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (file) {
            extractPageText(pageNumber);
        }
    }, [file, pageNumber]);

    const handleDocumentLoadError = (error) => {
        console.error("PDF load error:", error);
        setError(error.message);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                        <span className="text-gray-900 font-bold text-sm">YL</span>
                    </div>
                    <span className="text-xl font-semibold">YouLearn</span>
                    <span className="text-gray-400">{file?.name || "No file selected"}</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                        Upgrade
                    </Button>
                    <div className="text-sm text-gray-400">⌘K</div>
                    <Share className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>
            </header>

            <div className="flex h-[calc(100vh-73px)]">
                {/* PDF Viewer */}
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                                <Search className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Sun className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">
                                {pageNumber} / {numPages}
                            </span>
                            <select
                                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                                value={pageNumber}
                                onChange={(e) => setPageNumber(Number(e.target.value))}
                                disabled={isLoading}
                            >
                                {Array.from({ length: numPages }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        Page {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" disabled={isLoading}>
                                <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" disabled={isLoading}>
                                <RotateCw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-900 text-red-100 p-4 m-4 rounded">
                            Error: {error}
                        </div>
                    )}

                    <div className="flex">
                        {/* PDF View */}
                        <div
                            ref={pdfContainerRef}
                            className="flex-1 overflow-auto bg-gray-800 p-4 relative"
                            onMouseUp={handleTextSelection}
                        >
                            {isLoading && (
                                <div className="absolute inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center">
                                    <div className="text-white">Loading PDF...</div>
                                </div>
                            )}
                            <div className="max-w-4xl mx-auto">
                                <Document
                                    file={file}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={handleDocumentLoadError}
                                    loading={<div className="text-white">Loading PDF...</div>}
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        className="mx-auto"
                                        renderTextLayer
                                        renderAnnotationLayer={false}
                                        loading={<div className="text-white">Loading page...</div>}
                                    />
                                </Document>
                            </div>

                            {selectedText && selectionPosition && (
                                <SelectionPopup
                                    selectedText={selectedText}
                                    position={selectionPosition}
                                    onAction={handleAction}
                                    onClose={() => {
                                        setSelectedText("");
                                        setSelectionPosition(null);
                                    }}
                                />
                            )}
                        </div>

                        {/* Extracted Text Panel */}
                        <div className="w-80 border-l border-gray-700 bg-gray-800 p-4 overflow-auto">
                            <div className="text-sm text-gray-400 mb-2">{extractionInfo}</div>
                            <div className="bg-gray-900 p-3 rounded text-sm whitespace-pre-wrap font-mono h-full">
                                {isLoading ? "Extracting text..." : (pageText || "No text extracted yet")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="w-96 border-l border-gray-800">
                    <ChatInterface
                        messages={chatMessages}
                        inputText={chatInputText}
                        setInputText={setChatInputText}
                        onSendMessage={(message) => {
                            setChatMessages((prev) => [...prev, { role: "user", content: message }]);
                            setTimeout(() => {
                                setChatMessages((prev) => [
                                    ...prev,
                                    {
                                        role: "assistant",
                                        content: `I understand you're asking about: "${message}". Let me help you with that.`,
                                    },
                                ]);
                            }, 1000);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
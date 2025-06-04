import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import {
  MessageCircle,
  CreditCard,
  HelpCircle,
  FileText,
  Send,
  Mic,
  Volume2,
  Search,
  Clock,
  Brain,
} from "lucide-react";
import React from "react";
export default function ChatInterface({
  messages,
  inputText,
  setInputText,
  onSendMessage,
}) {
  const [activeTab, setActiveTab] = useState("chat");

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "flashcards", label: "Flashcards", icon: CreditCard },
    { id: "quizzes", label: "Quizzes", icon: HelpCircle },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "outline", label: "Outline", icon: FileText },
  ];

  const learningTools = [
    { icon: HelpCircle, label: "Quiz" },
    { icon: Brain, label: "Mind Map" },
    { icon: Volume2, label: "Voice Mode" },
    { icon: CreditCard, label: "Flashcards" },
    { icon: Search, label: "Search" },
    { icon: Clock, label: "Timeline" },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Tab Navigation */}
      <div className="border-b border-gray-800 p-2">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              className={`flex items-center gap-1 whitespace-nowrap ${
                activeTab === tab.id ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === "chat" && (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-lg">Learn with the AI Tutor</h3>
          </div>

          {/* Learning Tools */}
          <div className="p-4 border-b border-gray-800">
            <div className="grid grid-cols-3 gap-2">
              {learningTools.map((tool, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-2 text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <tool.icon className="w-4 h-4" />
                  <span className="text-xs">{tool.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <p>Select text from the PDF to start a conversation</p>
                <p className="text-sm mt-2">or ask me anything about the document</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Mic className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>
              <Button onClick={handleSend} disabled={!inputText.trim()} className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span>Default</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Learn+
              </span>
              <span>Search</span>
              <span>@</span>
            </div>
          </div>
        </>
      )}

      {activeTab !== "chat" && (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{tabs.find((t) => t.id === activeTab)?.label} feature coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
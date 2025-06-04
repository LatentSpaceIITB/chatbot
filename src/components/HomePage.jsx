import { useState } from "react";
import { Upload, Link, Mic, Plus, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";
import PDFViewer from "./PDFViewer";
import React from "react";
export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [spaces] = useState([{ id: 1, name: "Aditya's Space" }]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setIsUploading(true);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUploadedFile(file);
      setIsUploading(false);
    }
  };

  if (uploadedFile) {
    console.log(uploadedFile);
    return <PDFViewer file={uploadedFile} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-gray-900 font-bold text-sm">YL</span>
          </div>
          <span className="text-xl font-semibold">YouLearn</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
            Upgrade
          </Button>
          <div className="text-sm text-gray-400">⌘K</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Practice Banner */}
        <div className="text-center mb-8">
          <Button variant="outline" className="border-green-500 text-green-500 mb-6">
            NEW Practice with exams →
          </Button>
          <h1 className="text-4xl font-bold mb-8">What do you want to learn today?</h1>
        </div>

        {/* File Type Support */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300">
            <Upload className="w-4 h-4" />
            Supported file types: PDF, PPT, DOC, TXT, Audio, Video
          </div>
        </div>

        {/* Upload Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <h3 className="font-semibold mb-1">Upload</h3>
                <p className="text-sm text-gray-400">File, Audio, Video</p>
                {isUploading && (
                  <div className="mt-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-sm text-green-500 mt-2">Uploading...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Link className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <h3 className="font-semibold mb-1">Paste</h3>
              <p className="text-sm text-gray-400">YouTube, Website, Text</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mic className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <h3 className="font-semibold mb-1">Record</h3>
              <p className="text-sm text-gray-400">Record Class, Video Call</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Tutor Input */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gray-800 rounded-lg p-4">
            <input
              type="text"
              placeholder="Or ask AI tutor"
              className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* My Spaces */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4">My spaces</h2>
          <div className="flex items-center gap-4">
            {spaces.map((space) => (
              <div key={space.id} className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">A</span>
                </div>
                <span>{space.name}</span>
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400 cursor-pointer" />
              </div>
            ))}
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Plus className="w-4 h-4 mr-2" />
              Add space
            </Button>
          </div>
        </div>

        {/* Explore Topics */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Explore topics</h2>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Close all
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-gray-800 border-gray-700 aspect-video">
                <CardContent className="p-0 h-full">
                  <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 rounded-lg"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
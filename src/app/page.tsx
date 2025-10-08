'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Copy, Music, Users, FileText, Sparkles, BarChart, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { cleanStringLines, formatLyricsForDisplay, countWords, countLines, toBengaliNumber } from '@/lib/lyrics-cleaner';
import ArtistManagement from '@/components/artist-management';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoClean, setAutoClean] = useState(false);

  const sampleText = `আজি   মেঘ কেটে গেছে সকালবেলায়,
     এসো এসো এসো   তোমার হাসিমুখে--
            এসো আমার অলস দিনের খেলায়॥
     স্বপ্নে যত জমেছিল আশা-নিরাশায়
     তরুণ প্রাণের বিফল ভালোবাসায়
দিব  অকূল-পানে ভাসায়ে ভাঁটার গাঙের ভেলায়।
     দুঃখসুখের বাঁধন তারি গ্রন্থি দিব খুলে,
     আজি ক্ষণেক-তরে মোরা রব আপন ভুলে।
যে গান হয় নি গাওয়া       যে দান হয় নি পাওয়া--
     আজি   পুরব-হাওয়ায় তারি পরিতাপ
             উড়াব অবহেলায়`;

  const handleCleanLyrics = () => {
    if (!inputText.trim()) {
      toast.error('অনুগ্রহ করে লিরিক্স লিখুন');
      return;
    }

    // সরাসরি প্রসেসিং, কোনো লোডিং স্টেট ছাড়াই
    const cleaned = cleanStringLines(inputText);
    const formatted = formatLyricsForDisplay(cleaned);
    setCleanedText(formatted);
    toast.success('লিরিক্স সফলভাবে পরিষ্কার হয়েছে!');
  };

  // Auto-clean when input changes
  const handleInputChange = (value: string) => {
    setInputText(value);
    if (autoClean && value.trim()) {
      const cleaned = cleanStringLines(value);
      const formatted = formatLyricsForDisplay(cleaned);
      setCleanedText(formatted);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!cleanedText) {
      toast.error('কপি করার জন্য কোনো লিরিক্স নেই');
      return;
    }

    try {
      // প্রথমে আধুনিক ক্লিপবোর্ড API চেষ্টা করা
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cleanedText);
        toast.success('লিরিক্স ক্লিপবোর্ডে কপি হয়েছে!');
        return;
      }

      // যদি আধুনিক API কাজ না করে, তাহলে পুরনো পদ্ধতি ব্যবহার করা
      const textArea = document.createElement('textarea');
      textArea.value = cleanedText;
      textArea.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 2em;
        height: 2em;
        padding: 0;
        border: none;
        outline: none;
        box-shadow: none;
        background: transparent;
        opacity: 0;
        pointer-events: none;
        user-select: none;
      `;
      
      document.body.appendChild(textArea);
      
      // ফোকাস এবং সিলেক্ট করা
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 99999);
      
      // কপি কমান্ড এক্সিকিউট করা
      const successful = document.execCommand('copy');
      
      // ক্লিনআপ
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success('লিরিক্স ক্লিপবোর্ডে কপি হয়েছে!');
      } else {
        // যদি execCommand ও কাজ না করে, তাহলে টেক্সট সিলেক্ট করে দেখানো
        showTextForManualCopy();
      }
      
    } catch (err) {
      console.error('Copy failed:', err);
      // শেষ অপশন: টেক্সট সিলেক্ট করে দেখানো
      showTextForManualCopy();
    }
  };

  const showTextForManualCopy = () => {
    // আউটপুট টেক্সটএরিয়া ফোকাস করা এবং সিলেক্ট করা
    const outputTextarea = document.querySelector('textarea[readonly]') as HTMLTextAreaElement;
    if (outputTextarea) {
      outputTextarea.focus();
      outputTextarea.select();
      outputTextarea.setSelectionRange(0, 99999);
    }
    
    toast.success('টেক্সট সিলেক্ট করা হয়েছে! Ctrl+C (বা Cmd+C) চেপে কপি করুন।', {
      duration: 5000,
    });
  };

  const handleLoadSample = () => {
    setInputText(sampleText);
    toast.success('নমুনা লিরিক্স লোড হয়েছে!');
  };

  const handleClearAll = () => {
    setInputText('');
    setCleanedText('');
    toast.success('সব কিছু মুছে ফেলা হয়েছে!');
  };

  const wordCount = inputText ? countWords(inputText) : 0;
  const lineCount = inputText ? countLines(inputText) : 0;
  const cleanedWordCount = cleanedText ? countWords(cleanedText) : 0;
  const cleanedLineCount = cleanedText ? countLines(cleanedText) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  লিরিক্স পরিষ্কারক
                </h1>
                <p className="text-sm text-gray-600">বাংলা গানের কথা সুন্দরভাবে সাজানোর টুল</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cleaner" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="cleaner" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              লিরিক্স পরিষ্কারক
            </TabsTrigger>
            <TabsTrigger value="artists" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              শিল্পী তথ্য
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cleaner" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">মোট শব্দ</p>
                      <p className="text-xl font-bold">{toBengaliNumber(wordCount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">মোট লাইন</p>
                      <p className="text-xl font-bold">{toBengaliNumber(lineCount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">পরিষ্কার শব্দ</p>
                      <p className="text-xl font-bold">{toBengaliNumber(cleanedWordCount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-pink-600" />
                    <div>
                      <p className="text-sm text-gray-600">পরিষ্কার লাইন</p>
                      <p className="text-xl font-bold">{toBengaliNumber(cleanedLineCount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Input and Output Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    ইনপুট লিরিক্স
                  </CardTitle>
                  <CardDescription>
                    আপনার লিরিক্স এখানে পেস্ট করুন বা লিখুন
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="আপনার লিরিক্স এখানে লিখুন..."
                    value={inputText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-clean"
                        checked={autoClean}
                        onCheckedChange={setAutoClean}
                      />
                      <Label htmlFor="auto-clean" className="text-sm">
                        স্বয়ংক্রিয় পরিষ্কার
                      </Label>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      ঝড়ের গতিতে
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleLoadSample}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      নমুনা লোড করুন
                    </Button>
                    <Button 
                      onClick={handleClearAll}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      সব মুছুন
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    পরিষ্কার করা লিরিক্স
                  </CardTitle>
                  <CardDescription>
                    স্বয়ংক্রিয়ভাবে পরিষ্কার করা লিরিক্স
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="পরিষ্কার করা লিরিক্স এখানে দেখানো হবে..."
                      value={cleanedText}
                      readOnly
                      className="min-h-[300px] resize-none bg-gray-50"
                    />
                    {cleanedText && (
                      <Button
                        onClick={handleCopyToClipboard}
                        size="sm"
                        className="absolute top-2 right-2"
                        variant="secondary"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        কপি
                      </Button>
                    )}
                  </div>
                  <Button 
                    onClick={handleCleanLyrics}
                    disabled={!inputText.trim() || autoClean}
                    className="w-full"
                    size="lg"
                  >
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      লিরিক্স পরিষ্কার করুন
                    </>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Features Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>বৈশিষ্ট্যসমূহ</CardTitle>
                <CardDescription>
                  আমাদের লিরিক্স পরিষ্কারক টুলের সুবিধাসমূহ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">স্বয়ংক্রিয় পরিষ্কার</h4>
                      <p className="text-sm text-gray-600">অতিরিক্ত স্পেস এবং যতিচিহ্ন সরানো</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Copy className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">এক ক্লিকে কপি</h4>
                      <p className="text-sm text-gray-600">সহজেই ক্লিপবোর্ডে কপি করুন</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">পরিসংখ্যান</h4>
                      <p className="text-sm text-gray-600">শব্দ এবং লাইন গণনা</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="artists" className="space-y-6">
            <ArtistManagement />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© ২০২৪ লিরিক্স পরিষ্কারক - বাংলা গানের কথা সুন্দরভাবে সাজানোর টুল</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
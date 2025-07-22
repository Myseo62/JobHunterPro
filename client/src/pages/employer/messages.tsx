import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip,
  Archive,
  Trash2,
  Calendar,
  Users
} from "lucide-react";

interface Message {
  id: number;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: "text" | "interview" | "system";
}

interface Conversation {
  id: number;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "active" | "interview" | "hired" | "archived";
  avatar?: string;
}

export default function EmployerMessages({ user }: { user: any }) {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: 1,
      candidateName: "Rahul Sharma",
      candidateEmail: "rahul.sharma@email.com",
      jobTitle: "Senior Software Engineer",
      lastMessage: "Thank you for considering my application. I'm very interested in the position.",
      lastMessageTime: "2025-01-20T14:30:00Z",
      unreadCount: 2,
      status: "active"
    },
    {
      id: 2,
      candidateName: "Priya Patel",
      candidateEmail: "priya.patel@email.com",
      jobTitle: "Frontend Developer",
      lastMessage: "I'm available for an interview next week. What times work best for you?",
      lastMessageTime: "2025-01-20T10:15:00Z",
      unreadCount: 0,
      status: "interview"
    },
    {
      id: 3,
      candidateName: "Amit Kumar",
      candidateEmail: "amit.kumar@email.com",
      jobTitle: "Senior Software Engineer",
      lastMessage: "Great! Looking forward to starting on Monday. Should I report to the main office?",
      lastMessageTime: "2025-01-19T16:45:00Z",
      unreadCount: 1,
      status: "hired"
    },
    {
      id: 4,
      candidateName: "Sneha Reddy",
      candidateEmail: "sneha.reddy@email.com",
      jobTitle: "Product Manager",
      lastMessage: "Could you share more details about the product roadmap and team structure?",
      lastMessageTime: "2025-01-19T09:20:00Z",
      unreadCount: 0,
      status: "active"
    }
  ];

  // Mock messages for selected conversation
  const getMessages = (conversationId: number): Message[] => {
    const messagesByConversation: { [key: number]: Message[] } = {
      1: [
        {
          id: 1,
          senderId: "candidate",
          senderName: "Rahul Sharma",
          content: "Hi! I noticed you viewed my profile. I'm very interested in the Senior Software Engineer position at your company.",
          timestamp: "2025-01-20T10:00:00Z",
          isRead: true,
          type: "text"
        },
        {
          id: 2,
          senderId: "employer",
          senderName: "You",
          content: "Hi Rahul, thank you for your interest! Your profile looks impressive. I'd like to learn more about your experience with React and microservices architecture.",
          timestamp: "2025-01-20T11:30:00Z",
          isRead: true,
          type: "text"
        },
        {
          id: 3,
          senderId: "candidate",
          senderName: "Rahul Sharma",
          content: "Thank you for reaching out! I have 5+ years of experience with React, including building large-scale applications. For microservices, I've worked extensively with Node.js, Docker, and Kubernetes in my current role at TechCorp.",
          timestamp: "2025-01-20T12:15:00Z",
          isRead: true,
          type: "text"
        },
        {
          id: 4,
          senderId: "candidate",
          senderName: "Rahul Sharma",
          content: "I'd be happy to discuss my experience in detail. Would you be available for a call this week?",
          timestamp: "2025-01-20T14:30:00Z",
          isRead: false,
          type: "text"
        }
      ]
    };
    return messagesByConversation[conversationId] || [];
  };

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);
  const messages = selectedConversation ? getMessages(selectedConversation) : [];

  const sendMessage = () => {
    if (messageInput.trim()) {
      // In real app, this would send to API
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "interview": return "bg-purple-100 text-purple-800";
      case "hired": return "bg-green-100 text-green-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in as an employer to access messages</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with candidates and manage conversations</p>
        </div>

        {/* Message Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
                  <p className="text-sm text-gray-600">Total Conversations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {conversations.filter(c => c.status === "active").length}
                  </p>
                  <p className="text-sm text-gray-600">Active Chats</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {conversations.filter(c => c.status === "interview").length}
                  </p>
                  <p className="text-sm text-gray-600">Interview Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Archive className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Unread Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-4">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation === conversation.id 
                            ? 'bg-purple-50 border border-purple-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarFallback>
                              {conversation.candidateName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 truncate">
                                {conversation.candidateName}
                              </h4>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="default" className="text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-1">{conversation.jobTitle}</p>
                            <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {new Date(conversation.lastMessageTime).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className={`text-xs ${getStatusColor(conversation.status)}`}>
                                {conversation.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {selectedConv ? (
              <Card className="h-[600px] flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {selectedConv.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConv.candidateName}</h3>
                        <p className="text-sm text-gray-600">{selectedConv.jobTitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <Separator />
                
                {/* Messages */}
                <CardContent className="flex-1 p-4">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 'employer' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${
                            message.senderId === 'employer' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          } rounded-lg p-3`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === 'employer' ? 'text-purple-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                
                <Separator />
                
                {/* Message Input */}
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Textarea
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                      rows={1}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a conversation to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common messaging tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                <Archive className="w-4 h-4 mr-2" />
                Archive All Read
              </Button>
              <Button variant="outline">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
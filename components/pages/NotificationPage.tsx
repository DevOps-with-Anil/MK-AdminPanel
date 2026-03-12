'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  MoreVertical,
  Filter,
  Trash,
  Check,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MOCK_NOTIFICATIONS, Notification } from '@/lib/mock-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'error' | 'warning' | 'info'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} className="text-emerald-500" />;
      case 'error': return <AlertCircle size={18} className="text-rose-500" />;
      case 'warning': return <AlertTriangle size={18} className="text-amber-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'error': return 'bg-rose-500/10 border-rose-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' ? !n.isRead : n.type === filter);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Bell className="text-primary" size={28} />
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">Notification Center</h1>
            <p className="text-sm text-muted-foreground font-medium">Manage and track all system alerts and activities.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[11px] font-black uppercase tracking-wider h-9 border-dashed"
            onClick={handleMarkAllRead}
          >
            <Check className="mr-2 h-3.5 w-3.5" />
            Mark all read
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="text-[11px] font-black uppercase tracking-wider h-9"
            onClick={handleClearAll}
          >
            <Trash className="mr-2 h-3.5 w-3.5" />
            Clear All
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-border bg-muted/20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search notifications..." 
                className="pl-9 h-10 bg-background border-border text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {(['all', 'unread', 'success', 'error', 'warning', 'info'] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  className={`text-[10px] font-black uppercase tracking-tighter h-8 whitespace-nowrap ${filter === f ? 'shadow-lg shadow-primary/20' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 flex items-start gap-4 transition-all hover:bg-muted/30 group ${!notification.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className={`p-2.5 rounded-xl border shadow-sm flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-black tracking-tight ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground font-medium leading-relaxed max-w-2xl">
                      {notification.description}
                    </p>
                    <div className="mt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                        >
                          Mark as read
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(notification.id)}
                        className="text-[10px] font-black text-rose-500 hover:underline uppercase tracking-widest"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {!notification.isRead && (
                        <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)} className="text-xs font-bold">
                          <Check className="mr-2 h-3.5 w-3.5" /> Mark as read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDelete(notification.id)} className="text-xs font-bold text-rose-500 focus:text-rose-500">
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">No notifications found</h3>
                <p className="text-xs text-muted-foreground font-medium mt-1">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

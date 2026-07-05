'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Mail,
  Settings2,
  ShieldAlert,
  HandCoins
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Enrollments', href: '/admin/enrollments', icon: ClipboardList },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Donations', href: '/admin/donations', icon: HandCoins },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'Messages', href: '/admin/contact', icon: Mail },
  { label: 'Payment Settings', href: '/admin/payment-settings', icon: Settings2 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useAuth();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setAdminUser(JSON.parse(savedUser));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleLogoutClick = async () => {
    await logout();
  };

  const getPageTitle = () => {
    const activeItem = sidebarItems.find(item => pathname.startsWith(item.href));
    return activeItem ? activeItem.label : 'Admin Portal';
  };

  return (
    <div className="relative min-h-screen bg-bg text-text flex overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-surface border-r border-border transition-all duration-300 relative z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!sidebarCollapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-display font-bold text-lg text-primary tracking-wide">
              <span className="bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text">ANAMTA</span>
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">Admin</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <Link href="/admin/dashboard" className="mx-auto flex items-center justify-center h-10 w-10 rounded-lg bg-primary/15 text-gold border border-gold/30">
              <ShieldAlert size={20} className="text-gold" />
            </Link>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded bg-bg border border-border text-text-secondary hover:text-gold hover:border-gold transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-gold/15 to-gold/5 text-gold border-l-2 border-gold font-semibold'
                    : 'text-text-secondary hover:bg-surface-light hover:text-text'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={18} className={isActive ? 'text-gold' : 'text-text-secondary group-hover:text-gold transition-colors'} />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-surface-dark border border-border text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-border bg-surface-dark/50">
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={sidebarCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={18} className="text-red-500" />
            {!sidebarCollapsed && <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      >
        <aside
          className={`w-64 h-full bg-surface flex flex-col transition-transform duration-300 ease-out border-r border-border ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <span className="font-display font-bold text-lg text-primary tracking-wide">
              <span className="bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text">ANAMTA</span>
            </span>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 rounded border border-border text-text-secondary hover:text-gold"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[14px] transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-gold/15 to-gold/5 text-gold border-l-2 border-gold font-semibold'
                      : 'text-text-secondary hover:bg-surface-light hover:text-text'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-gold' : 'text-text-secondary'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-6 border-t border-border">
            <button
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-[14px] text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={18} />
              <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Header */}
        <header className="h-16 bg-surface/95 border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded border border-border text-text-secondary hover:text-gold hover:border-gold md:hidden transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <h1 className="text-lg font-semibold tracking-wide font-display text-text hidden sm:block">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <div className="h-6 w-[1px] bg-border" />

            {/* Profile Dropdown / Widget */}
            <div className="flex items-center gap-3 pl-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-gold to-gold-light text-primary-dark font-bold font-display flex items-center justify-center shadow-md">
                {adminUser?.firstName ? adminUser.firstName[0].toUpperCase() : 'A'}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-none">
                <span className="text-[14px] font-semibold text-text">
                  {adminUser?.firstName ? `${adminUser.firstName} ${adminUser.lastName || ''}` : 'Admin User'}
                </span>
                <span className="text-[11px] text-text-secondary mt-0.5">
                  {adminUser?.email || 'admin@anamtainstitute.com'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

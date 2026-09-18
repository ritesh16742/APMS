'use client';
import Sidebar from './Sidebar';
export default function AppShell({role,username,children,title,subtitle}){return <div className="app-shell"><Sidebar role={role} username={username}/><main className="main"><header className="topbar"><div><div className="eyebrow">ARMY PERSONNEL MANAGEMENT SYSTEM</div><h1>{title}</h1><p>{subtitle}</p></div><div className="top-status"><span className="status-dot"/> System operational</div></header>{children}</main></div>}

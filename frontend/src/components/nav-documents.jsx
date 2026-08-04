"use client";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavDocuments({ items }) {
  const location = useLocation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={item.name}
              isActive={location.pathname === item.url}
              className="justify-between"
            >
              <Link to={item.url} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {Boolean(item.badgeCount && item.badgeCount > 0) && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground animate-pulse">
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

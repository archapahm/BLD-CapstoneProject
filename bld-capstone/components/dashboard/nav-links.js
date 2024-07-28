'use client';

import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import RuleIcon from '@mui/icons-material/Rule';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListItemButton, ListItemIcon, ListItemText,  } from '@mui/material';
const isAdmin = true; // Replace with your logic to determine if the user is an admin

const adminLink = { name: 'Admin', href: '/dashboard/admin', icon: SupervisorAccountIcon };


const links = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Projects', href: '/dashboard/projects', icon: HomeWorkIcon },
  { name: 'Phases', href: '/dashboard/phases', icon: FormatListNumberedIcon },
  { name: 'Project Phases', href: '/dashboard/projectphases', icon: ViewTimelineIcon },
  { name: 'Markup Review', href: '/dashboard/markup', icon: RuleIcon },
  { name: 'Time Tracker', href: '/dashboard/timetracker', icon: AlarmOnIcon },
  { name: 'Admin', href: '/dashboard/admin', icon: SupervisorAccountIcon }
];



export default function NavLinks() {
  const pathname = usePathname();
  return (
    <React.Fragment>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link 
            key={link.name}
            href={link.href}
            passHref
            style={{textDecoration: 'none', color: 'inherit'}}
          >
            <ListItemButton>
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText 
                primary={link.name} 
              />
            </ListItemButton>
          </Link>
        );
      })}
    </React.Fragment>
  );
}

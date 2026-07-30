import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarCheck, Sliders, LineChart, Zap } from 'lucide-react';

export const NavBar = () => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <div className="brand-icon">
            <Zap size={22} fill="currentColor" />
          </div>
          <div>
            <div className="brand-title">Daily Tracker</div>
          </div>
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <CalendarCheck size={18} />
            <span>Today</span>
          </NavLink>

          <NavLink
            to="/activities"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Sliders size={18} />
            <span>Manage</span>
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LineChart size={18} />
            <span>Progress</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

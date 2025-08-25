import React from "react";
import Svg, { Path, Circle, Rect } from "react-native-svg";

type P = { size?: number; color?: string };

export const SearchIcon = ({ size = 22, color = "#0A7D36" }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill={color}/>
  </Svg>
);

export const SettingsIcon = ({ size = 22, color = "#0A7D36" }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.007 7.007 0 0 0-1.63-.95l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.41l-.36 2.54c-.58.22-1.12.53-1.63.95l-2.39-.96a.5.5 0 0 0-.6.22L2.82 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.05.31-.07.63-.07.94s.02.63.07.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.31.6.22l2.39-.96c.51.41 1.05.73 1.63.95l.36 2.54c.06.24.26.41.49.41h3.8c.24 0 .44-.17.49-.41l.36-2.54c.58-.22 1.12-.53 1.63-.95l2.39.96c.22.09.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" fill={color}/>
  </Svg>
);

export const ChevronRight = ({ size = 18, color = "#0A7D36" }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></Svg>
);

export const GolfIcon = ({ size = 44, color = "#0A7D36" }: P) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path d="M28 8v24l12-6-12-6" fill={color}/>
    <Path d="M20 58c0-5 8-6 12-6s12 1 12 6" stroke={color} strokeWidth={3} strokeLinecap="round"/>
    <Circle cx="48" cy="14" r="2" fill={color}/>
  </Svg>
);

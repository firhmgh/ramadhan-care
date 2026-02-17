"use client";

import * as React from "react";
import { cn } from "./utils";
import { useStore } from "../../store/useStore";

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

interface RamadhanDayProps {
  hijriDay: number;
  gregorianDate: string;
  isToday?: boolean;
}

const RamadhanDay = ({ hijriDay, gregorianDate, isToday }: RamadhanDayProps) => {
  const [day, month] = gregorianDate.split(" ");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-3 px-1 border transition-all duration-300",
        "w-full rounded-full aspect-[1/2.2] min-h-[90px]",
        "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20",
        isToday ? "ring-2 ring-primary border-primary bg-primary/5" : "text-slate-600"
      )}
    >
      <span className={cn(
        "text-lg sm:text-xl font-black mb-1 leading-none",
        isToday ? "text-primary" : "text-slate-900"
      )}>
        {hijriDay}
      </span>
      
      <div className="flex flex-col items-center leading-none text-slate-400">
        <span className="text-[10px] font-bold">{day}</span>
        <span className="text-[8px] font-medium uppercase tracking-tighter">{month}</span>
      </div>
    </div>
  );
};

function Calendar({ className }: { className?: string }) {
  const { user } = useStore();
  const mazhabLabel = user?.mazhab || 'Muhammadiyah';
  const isNU = mazhabLabel.toLowerCase() === 'nu';

  const { ramadhanDates, startOffset } = React.useMemo(() => {
    const dates = [];
    const startDate = new Date(2026, 1, 18); 
    
    if (isNU) startDate.setDate(startDate.getDate() + 1);

    const jsDay = startDate.getDay();
    const offset = jsDay === 0 ? 6 : jsDay - 1; 

    for (let i = 1; i <= 30; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + (i - 1));
      
      dates.push({
        hijri: i,
        gregorian: `${current.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][current.getMonth()]}`,
        fullDate: current.toDateString()
      });
    }
    return { ramadhanDates: dates, startOffset: offset };
  }, [isNU]);

  const todayStr = new Date().toDateString();

  return (
    <div className={cn("w-full bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-soft-xl border border-slate-50", className)}>
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          30 Hari Ramadhan 1447 H
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4 px-1">
        {DAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs sm:text-sm font-semibold text-slate-400">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`spacer-${i}`} className="w-full aspect-[1/2.2]" />
        ))}

        {ramadhanDates.map((item) => (
          <RamadhanDay 
            key={item.hijri} 
            hijriDay={item.hijri} 
            gregorianDate={item.gregorian}
            isToday={item.fullDate === todayStr}
          />
        ))}
      </div>
    </div>
  );
}

export { Calendar };
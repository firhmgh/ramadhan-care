"use client";

import * as React from "react";
import { cn } from "./utils";
import { useStore } from "../../store/useStore";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

interface CalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date) => void;
  mode?: string; 
  locale?: any;   
  modifiers?: {
    active?: (date: Date) => boolean;
    complete?: (date: Date) => boolean;
  };
  modifiersClassNames?: Record<string, string>;
}

const RamadhanDay = ({ 
  hijriDay, 
  gregorianDate, 
  isToday, 
  isSelected, 
  onClick,
  statusClass 
}: any) => {
  const dateObj = new Date(gregorianDate);
  const day = format(dateObj, 'd');
  const month = format(dateObj, 'MMM', { locale: id });

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex flex-col items-center justify-center py-3 px-1 border transition-all duration-300",
        "w-full rounded-full aspect-[1/2.2] min-h-[90px]",
        "bg-white border-slate-100 shadow-sm hover:shadow-md",
        isSelected ? "ring-2 ring-primary bg-primary/10 border-primary" : "text-slate-600",
        isToday && !isSelected ? "border-primary/50 bg-primary/5" : "",
        statusClass
      )}
    >
      <span className={cn(
        "text-lg sm:text-xl font-black mb-1 leading-none",
        isSelected || isToday ? "text-primary" : "text-slate-900"
      )}>
        {hijriDay}
      </span>
      
      <div className="flex flex-col items-center leading-none text-slate-400">
        <span className="text-[10px] font-bold">{day}</span>
        <span className="text-[8px] font-medium uppercase tracking-tighter">{month}</span>
      </div>
    </button>
  );
};

export function Calendar({ className, selected, onSelect, modifiers }: CalendarProps) {
  const { imsakiyahData, user } = useStore();
  
  const { days, startOffset } = React.useMemo(() => {
    if (imsakiyahData.length === 0) return { days: [], startOffset: 0 };

    const firstDate = new Date(imsakiyahData[0].tanggal_masehi);
    let offset = firstDate.getDay(); 
    offset = offset === 0 ? 6 : offset - 1; 

    return { days: imsakiyahData, startOffset: offset };
  }, [imsakiyahData]);

  const todayStr = new Date().toISOString().split('T')[0];
  const selectedStr = selected ? format(selected, 'yyyy-MM-dd') : '';

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

        {days.map((item) => {
          const itemDate = new Date(item.tanggal_masehi);
          
          let statusClass = "";
          // Gunakan fungsi modifier dari CalendarPage untuk menentukan warna
          if (modifiers?.complete?.(itemDate)) {
            statusClass = "bg-success/20 border-success/30 font-bold";
          } else if (modifiers?.active?.(itemDate)) {
            statusClass = "bg-accent/20 border-accent/30";
          }

          return (
            <RamadhanDay 
              key={item.id} 
              hijriDay={item.hari_ke} 
              gregorianDate={item.tanggal_masehi}
              isToday={item.tanggal_masehi === todayStr}
              isSelected={item.tanggal_masehi === selectedStr}
              statusClass={statusClass}
              onClick={() => onSelect?.(itemDate)}
            />
          );
        })}
      </div>
    </div>
  );
}
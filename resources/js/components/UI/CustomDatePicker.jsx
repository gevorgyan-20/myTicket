import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomDatePicker = ({ value, onChange, placeholder = "Select date" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
    const dropdownRef = useRef(null);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (day) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Format to YYYY-MM-DD for consistency
        const formatted = selectedDate.toISOString().split('T')[0];
        onChange(formatted);
        setIsOpen(false);
    };

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Padding for first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square" />);
        }

        // Current month days
        const selectedDay = value ? new Date(value).getDate() : null;
        const isSelectedMonth = value && new Date(value).getMonth() === month && new Date(value).getFullYear() === year;

        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = isSelectedMonth && selectedDay === day;
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            days.push(
                <button
                    key={day}
                    onClick={(e) => { e.stopPropagation(); handleDateSelect(day); }}
                    className={`aspect-square !p-0 flex items-center justify-center rounded-full text-xs transition-all
                        ${isSelected ? 'bg-[#C14FE6] text-white shadow-[0_0_15px_rgba(193,79,230,0.4)]' : 'text-gray-300 hover:bg-white/10'}
                        ${isToday && !isSelected ? 'border border-[#C14FE6]/50 text-[#C14FE6]' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const formattedDisplayDate = value ? new Date(value).toLocaleDateString(undefined, { 
        month: 'short', day: 'numeric', year: 'numeric' 
    }) : placeholder;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="bg-transparent border-none outline-none text-white text-[16px] w-full text-left flex items-center justify-between group"
            >
                <span className={!value ? 'text-gray-600' : ''}>{formattedDisplayDate}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-4 p-5 bg-[#1b1b1b] border border-[#303030] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[999] w-[300px]">
                    <div className="flex items-center justify-between mb-5">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="font-bold text-white text-sm">
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {daysOfWeek.map(day => (
                            <div key={day} className="aspect-square flex items-center justify-center text-[10px] uppercase font-bold text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {renderDays()}
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onChange(""); setIsOpen(false); }}
                            className="text-[11px] text-gray-500 hover:text-white transition-colors"
                        >
                            Clear
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDateSelect(new Date().getDate()); }}
                            className="text-[11px] text-[#C14FE6] font-bold hover:opacity-80 transition-opacity"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;

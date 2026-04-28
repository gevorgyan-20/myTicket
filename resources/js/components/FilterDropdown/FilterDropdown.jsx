import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";

export default function FilterDropdown({
  label,
  icon,
  value,
  displayText,
  options = [],
  children,
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasCustomContent = Boolean(children);

  return (
    <div className="relative flex flex-col gap-1 w-full" ref={ref}>
      <label className="text-xs text-[#999999]">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 w-full h-10 md:h-12 px-3 rounded-xl bg-[#1A1A1A] border border-[#303030] hover:border-[#404040] transition-colors text-left"
      >
        <span className="text-[#999999] flex-shrink-0">{icon}</span>
        <span className="flex-1 text-sm text-white truncate">
          {displayText || "Select"}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-[#999] flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl bg-[#1A1A1A] border border-[#303030] shadow-lg overflow-hidden min-w-[200px]">
          {hasCustomContent ? (
            <div className="p-3">
              {typeof children === "function" ? children(() => setIsOpen(false)) : children}
            </div>
          ) : (
            <ul className="py-2">
              {options.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-[#252525] ${
                      value === opt.value ? "text-[#E4AFF8]" : "text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

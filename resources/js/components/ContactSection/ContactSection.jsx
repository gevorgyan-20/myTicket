import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+374 98 11 22 33"
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@myticket.am"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Yerevan, Armenia"
  }
];

export default function ContactSection() {
  return (
    <section className="relative w-full py-20 px-[108px]">
      <div className="max-w-7xl mx-auto">
        <h2 className="[font-family:'Inter',Helvetica] text-4xl font-bold text-white text-center mb-12">
          Join to enjoy your <span className="text-[#E4AFF8]">moments</span>!
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div
                key={index}
                className="bg-[#1B1B1B] rounded-2xl p-8 border border-[#303030] hover:border-[#E4AFF8] transition-colors text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#2A2A2A] flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-[#E4AFF8]" />
                </div>
                <h3 className="[font-family:'Inter',Helvetica] text-lg font-semibold text-white mb-2">
                  {contact.label}
                </h3>
                <p className="[font-family:'Inter',Helvetica] text-base text-[#999999]">
                  {contact.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


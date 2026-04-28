import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactSection() {
  const { t } = useTranslation();

  const contactInfo = useMemo(() => [
    {
      icon: Phone,
      label: t('contact.phone'),
      value: "+374 98 11 22 33"
    },
    {
      icon: Mail,
      label: t('contact.email'),
      value: "info@myticket.am"
    },
    {
      icon: MapPin,
      label: t('contact.location'),
      value: t('contact.locationValue', "Yerevan, Armenia")
    }
  ], [t]);

  return (
    <section className="relative w-full py-12 md:py-20 px-4 md:px-[108px]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-poppins text-2xl md:text-4xl font-bold text-white text-center mb-12">
          {t('contact.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div
                key={index}
                className="bg-[#1B1B1B] rounded-2xl p-6 md:p-8 border border-[#303030] hover:border-[#E4AFF8] transition-colors text-center group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#2A2A2A] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-[#E4AFF8]" />
                </div>
                <h3 className="font-poppins text-base md:text-lg font-semibold text-white mb-2">
                  {contact.label}
                </h3>
                <p className="font-mulish text-sm md:text-base text-[#999999]">
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


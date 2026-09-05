import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton({ phoneNumber = '7498784109' }) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const message = `Hello NK SkillEdge Team! I am visiting your official platform (${currentUrl}) and would like to inquire about your training programs and software services.`;
  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodedMsg}`;

  return (
    <aside aria-label="Quick WhatsApp Contact">
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noreferrer" 
        className="whatsapp-float"
        title="Chat instantly with an NK SkillEdge Counselor on WhatsApp"
      >
        <MessageCircle size={32} />
      </a>
    </aside>
  );
}

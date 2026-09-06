import React, { useState } from 'react';

export default function Footer() {
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  const teamMembers = [
    { name: "Alexandra Kazimirskaya", handle: "@lunary_me" },
    { name: "Daria Zubareva", handle: "@mi_shunia" },
    { name: "Olga Kopyeva", handle: "@imkopyova" },
    { name: "Stefania Orlova", handle: "@whybitchcry" },
    { name: "Dobrinya Karepin", handle: "@donkarepin" },
    { name: "Maya Melnichuk", handle: "@MYaroslavovna" },
    { name: "Valeria Yalova-Chernova", handle: "@Yalova_Valeriya" },
    { name: "Natalia Borovkova", handle: "@NatalieMeribel" },
    { name: "Anastasia Voronova", handle: "@Anastasia_coin" }
  ];

  return (
    <footer id="about" className="py-20 bg-black text-white/50 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left copyright */}
        <div>
          <span className="text-white/80 font-medium">@2026 Nōta Team</span>
          <span className="mx-2">•</span>
          <span>Writing Infrastructure for Modern Thinking</span>
        </div>

        {/* Center Credits */}
        <div className="flex items-center gap-4">
          <a href="https://www.behance.net/alicem" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Designed by Alice
          </a>
          <span>&</span>
          <a href="https://www.uprock.ru/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            UPROCK Studio
          </a>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-6">
          <a href="https://taptop.pro/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Made in Taptop
          </a>
          <button 
            onClick={() => setTeamModalOpen(true)}
            className="hover:text-white transition-colors underline cursor-pointer"
          >
            Built by NōtaTeam
          </button>
        </div>
      </div>

      {/* Team Overlay Modal */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="absolute inset-0" onClick={() => setTeamModalOpen(false)} />
          
          <div className="relative z-10 w-full max-w-lg glass-panel p-8 bg-zinc-950/90 rounded-3xl border border-white/20 text-white">
            <button 
              onClick={() => setTeamModalOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-2xl font-light text-gradient mb-6">NŌTA Core Team</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
              {teamMembers.map((member, idx) => (
                <a 
                  key={idx}
                  href={`https://telegram.me/${member.handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-white/90">{member.name}</span>
                  <span className="text-white/40">{member.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

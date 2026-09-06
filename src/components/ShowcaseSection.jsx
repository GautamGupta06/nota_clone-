import React, { useState } from 'react';

export default function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState(0);

  const showcases = [
    {
      title: "Designers & Architects",
      desc: "Sketch ideas, draft spatial layouts, and capture rapid freehand concepts with zero digital distraction.",
      img: "/assets/images/nota_scene_4_img_01.jpg",
      tag: "Spatial Thinking"
    },
    {
      title: "Writers & Researchers",
      desc: "Experience uninterrupted focus. Write naturally on paper while AI automatically indexes, structures, and transcribes your notes.",
      img: "/assets/images/nota_scene_4_img_02.jpg",
      tag: "Distraction-Free"
    },
    {
      title: "Engineers & Strategists",
      desc: "Formulate complex equations, diagrams, and system architectures with real-time digital vector preservation.",
      img: "/assets/images/nota_scene_4_img_03.jpg",
      tag: "Vector Precision"
    },
    {
      title: "Executives & Thinkers",
      desc: "Capture meeting insights, personal reflections, and long-term vision in leather-bound smart notebooks synced to all devices.",
      img: "/assets/images/nota_scene_4_img_04.jpg",
      tag: "Omnipresent Sync"
    }
  ];

  return (
    <section id="who-its-for" className="py-32 bg-black text-white relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {showcases.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-3 rounded-full text-xs font-medium transition-all ${
                activeTab === idx
                  ? 'bg-white text-black font-semibold shadow-lg shadow-white/10'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>

        {/* Tab Card Content */}
        <div className="glass-panel p-6 md:p-10 overflow-hidden rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/10">
          
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-white/50 px-3 py-1 bg-white/10 rounded-md w-fit">
              {showcases[activeTab].tag}
            </span>
            
            <h3 className="text-3xl md:text-5xl font-light text-white leading-tight">
              {showcases[activeTab].title}
            </h3>

            <p className="text-base text-white/70 leading-relaxed">
              {showcases[activeTab].desc}
            </p>

            <div className="pt-6 border-t border-white/10 flex items-center gap-8">
              <div>
                <span className="block text-3xl font-light text-white font-mono">0.1ms</span>
                <span className="text-xs text-white/40">Sync Latency</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div>
                <span className="block text-3xl font-light text-white font-mono">100%</span>
                <span className="text-xs text-white/40">Offline Buffer</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative h-[360px] md:h-[480px] rounded-2xl overflow-hidden group">
            <img 
              src={showcases[activeTab].img} 
              alt={showcases[activeTab].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>

      </div>
    </section>
  );
}

import React from 'react';

export default function InsideBoxSection({ onOpenOrder }) {
  const boxItems = [
    {
      name: "NŌTA Smart Pen",
      desc: "Anodized aluminum body with precision optical sensor & nib",
      img: "/assets/images/library_image-14700-symbol-iw3g92519-nota_scene_2_img.png"
    },
    {
      name: "Intelligent Paper Notebook",
      desc: "192 dot-grid pages with invisible micro-dot matrix positioning",
      img: "/assets/images/41_block.jpg"
    },
    {
      name: "Magnetic Charging Dock",
      desc: "Fast USB-C charging base with ambient state light indicator",
      img: "/assets/images/library_image-14634-symbol-is6ru9kkd-nota_hero_image_adaptive_866220.png"
    },
    {
      name: "Refill Ink Set",
      desc: "3x archival fountain pen ink cartridges (Black & Midnight Blue)",
      img: "/assets/images/library_image-14639-symbol-ibp1e2m59-popup_order-img.png"
    }
  ];

  return (
    <section id="inside-the-box" className="py-32 bg-white text-black relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-black/40 font-semibold block mb-2">Unboxing experience</span>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight">
              Inside <span className="font-serif-title italic font-normal text-black">the box</span>
            </h2>
          </div>
          <button 
            onClick={onOpenOrder}
            className="px-6 py-3 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider hover:bg-black/90 transition-all w-fit shadow-lg"
          >
            Order Complete Kit — $300
          </button>
        </div>

        {/* Box Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boxItems.map((item, idx) => (
            <div key={idx} className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-6 flex flex-col justify-between group hover:border-black/30 hover:shadow-lg transition-all duration-300">
              <div className="h-52 w-full flex items-center justify-center overflow-hidden rounded-xl bg-white mb-6 relative border border-neutral-100">
                <img 
                  src={item.img} 
                  alt={item.name}
                  className="max-h-40 max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div>
                <span className="text-xs font-mono text-black/40 block mb-1">0{idx + 1}</span>
                <h3 className="text-lg font-medium text-black mb-2">{item.name}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

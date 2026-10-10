import React from 'react';
import { motion } from 'framer-motion';
import { GlassWater, Sparkles, Lamp, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_COPIES, WELCOME_RITUAL_STEPS } from '../data/spaData';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { EditableText } from './editor/EditableText';
import { EditableImage } from './editor/EditableImage';
import { EditableIcon } from './editor/EditableIcon';
import ritualBoasVindasImg from '../assets/images/ritual-boas-vindas.webp';

export const ManifestoSection: React.FC = () => {
  return (
    <section id="manifesto" className="relative py-28 sm:py-36 bg-[#FBF9F6] text-[#2C2C2C] overflow-hidden">
      {/* Decorative ambient silk glow com respiração zen */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#F0EAE1]/80 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#D3B8AA]/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Editorial Subheader */}
        <div className="text-center max-w-5xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE_ORGANIC }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0EAE1] text-[#2D4536] border border-[#2D4536]/20 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <EditableIcon id="manifesto.badge.icon" defaultIcon="Sparkles" className="w-3.5 h-3.5 text-[#D4AF37]" />
            <EditableText id="manifesto.badge" defaultText="O Ritual de Recepção Maliviê" as="span">
              O Ritual de Recepção Maliviê
            </EditableText>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-[#2C2C2C] font-light leading-[1.15] whitespace-nowrap"
          >
            <EditableText
              id="manifesto.heading"
              defaultText={`"Aqui, você é recebido(a) com calma."`}
              as="span"
              className="whitespace-nowrap"
            >
              "Aqui, você é recebido(a) com <span className="italic font-normal text-[#2D4536]">calma</span>."
            </EditableText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_ORGANIC }}
            className="mt-4 text-base sm:text-lg text-[#555555] font-sans font-normal leading-relaxed max-w-2xl mx-auto"
          >
            <EditableText
              id="manifesto.welcome"
              defaultText={OFFICIAL_COPIES.welcome}
              as="span"
            >
              {OFFICIAL_COPIES.welcome}
            </EditableText>
          </motion.p>
        </div>

        {/* High-Fashion Asymmetric Layout (Inspora Design Inspired) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Atmospheric Image with Editorial Overlay */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: EASE_LUXURY }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Luxury Frame Accent */}
              <div className="absolute -inset-3 rounded-3xl border border-[#D4AF37]/30 -rotate-1 pointer-events-none" />
              
              <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(18,28,22,0.15)] aspect-[4/5] bg-[#121C16]">
                <EditableImage
                  id="manifesto.ritualBoasVindas"
                  defaultImage={ritualBoasVindasImg}
                  alt="Ritual de boas-vindas Maliviê SPA com escalda-pés em bacia de madeira e welcome drink em cristal"
                  prefix="manifesto"
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
                />
                    {/* Floating Micro-Badge */}
                <div
                  className="absolute bottom-5 left-5 right-5 z-30 pointer-events-auto p-4 rounded-xl bg-[#121C16]/90 backdrop-blur-md text-[#F3EFE6] border border-[#F3EFE6]/15"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-[#7A8B7B]/30 text-[#D4AF37]">
                      <EditableIcon id="manifesto.drink.icon" defaultIcon="CupSoda" className="w-5 h-5" fallbackComponent={GlassWater} />
                    </div>
                    <div>
                      <p className="font-serif italic text-base text-[#F3EFE6] font-medium">
                        <EditableText id="manifesto.drinkTitle" defaultText="Taça de Cristal & Boas-Vindas" as="span">
                          Taça de Cristal & Boas-Vindas
                        </EditableText>
                      </p>
                      <p className="text-xs text-[#F3EFE6]/70 font-sans">
                        <EditableText id="manifesto.drinkDesc" defaultText="Infusão artesanal de frutas e ervas" as="span">
                          Infusão artesanal de frutas e ervas
                        </EditableText>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Manifesto Quote & Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center space-y-8"
          >
            {/* The Quote Block */}
            <div className="relative p-7 sm:p-9 rounded-3xl bg-[#F0EAE1]/70 border border-[#D4AF37]/25 shadow-sm space-y-4">
              <span className="font-serif text-5xl sm:text-6xl text-[#D4AF37]/35 leading-none select-none absolute top-4 left-6">
                “
              </span>
              <p className="font-serif text-lg sm:text-2xl text-[#8C6D1F] italic font-normal leading-relaxed relative z-10 pt-3">
                <EditableText
                  id="manifesto.mainQuote"
                  defaultText={OFFICIAL_COPIES.manifestoMain}
                  as="span"
                >
                  {OFFICIAL_COPIES.manifestoMain}
                </EditableText>
              </p>
            </div>

            {/* The 4 pillars of the Arrival Experience */}
            <div className="space-y-4 pt-2">
              <h3 className="font-serif text-2xl text-[#2C2C2C]">
                <EditableText id="manifesto.pillarsTitle" defaultText="O que acontece no minuto em que você chega:" as="span">
                  O que acontece no minuto em que você chega:
                </EditableText>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WELCOME_RITUAL_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#E8E0D5] hover:border-[#7A8B7B]/60 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(18,28,22,0.06)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col gap-2 group cursor-default"
                  >
                    <div className="flex items-center gap-2 text-[#7A8B7B] group-hover:text-[#677868] transition-colors">
                      <EditableIcon
                        id={`manifesto.step.${idx}.icon`}
                        defaultIcon="CheckCircle2"
                        className="w-4 h-4 text-[#7A8B7B] group-hover:scale-110 transition-transform duration-300"
                      />
                      <h4 className="font-sans font-semibold text-sm text-[#2C2C2C]">
                        <EditableText id={`manifesto.step.${idx}.title`} defaultText={step.title} as="span">
                          {step.title}
                        </EditableText>
                      </h4>
                    </div>
                    <div className="text-xs text-[#555555] leading-relaxed">
                      <EditableText id={`manifesto.step.${idx}.description`} defaultText={step.description} as="p">
                        {step.description}
                      </EditableText>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ambient Lighting & Temperature note */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#E8E0D5]/50 border border-[#D3B8AA]/40 text-xs text-[#2C2C2C]">
              <EditableIcon id="manifesto.atmosphere.icon" defaultIcon="Sparkles" className="w-5 h-5 text-[#D4AF37] flex-shrink-0" fallbackComponent={Lamp} />
              <EditableText
                id="manifesto.atmosphereNote"
                defaultText="**Atmosfera Sensorial:** Luzes indiretas em temperatura de cor aquecida de 3000K, aromatização com sálvia e lavanda, toalhas aquecidas e chinelos aveludados antes de qualquer procedimento."
                as="span"
              >
                **Atmosfera Sensorial:** Luzes indiretas em temperatura de cor aquecida de 3000K, aromatização com sálvia e lavanda, toalhas aquecidas e chinelos aveludados antes de qualquer procedimento.
              </EditableText>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

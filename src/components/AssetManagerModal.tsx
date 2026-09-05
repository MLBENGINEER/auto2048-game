import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, CheckCircle2, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';
import { getCustomImageSync, saveCustomImage, saveMultipleCustomImages, clearCustomImages, onCustomImagesChange } from '../utils/customImages';
import { cleanImageFilename, getVehicleImageUrl, getVehicleImageFallbackUrl } from '../utils/imagePath';
import { EvolutionIcon } from './EvolutionIcon';

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CarSlot {
  key: string;
  name: string;
  level: number;
  colorName: string;
  badgeClass: string;
  borderClass: string;
}

const CAR_SLOTS: CarSlot[] = [
  {
    key: '1.png',
    name: 'Tuerca',
    level: 1,
    colorName: 'Neón Cian',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderClass: 'border-cyan-400',
  },
  {
    key: '2.png',
    name: 'Engranaje',
    level: 2,
    colorName: 'Neón Celeste',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    borderClass: 'border-sky-400',
  },
  {
    key: '3.png',
    name: 'Volante',
    level: 3,
    colorName: 'Neón Ámbar',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderClass: 'border-amber-400',
  },
  {
    key: '4.png',
    name: 'Chasis',
    level: 4,
    colorName: 'Neón Esmeralda',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderClass: 'border-emerald-400',
  },
  {
    key: '5.png',
    name: 'Auto Clásico 20s',
    level: 5,
    colorName: 'Neón Dorado',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderClass: 'border-amber-400',
  },
  {
    key: '6.png',
    name: 'Taller',
    level: 6,
    colorName: 'Neón Naranja',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    borderClass: 'border-orange-400',
  },
  {
    key: '7.png',
    name: 'Sedán 50s',
    level: 7,
    colorName: 'Neón Cian',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderClass: 'border-cyan-400',
  },
  {
    key: '8.png',
    name: 'Motor V8',
    level: 8,
    colorName: 'Neón Carmesí',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
    borderClass: 'border-red-500',
  },
  {
    key: '9.png',
    name: 'Muscle Car 70s',
    level: 9,
    colorName: 'Neón Naranja',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    borderClass: 'border-orange-500',
  },
  {
    key: '10.png',
    name: 'Alerón',
    level: 10,
    colorName: 'Neón Púrpura',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderClass: 'border-purple-400',
  },
  {
    key: '11.png',
    name: 'Superdeportivo Moderno',
    level: 11,
    colorName: 'Neón Magenta SVJ',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderClass: 'border-rose-400',
  },
  {
    key: '12.png',
    name: 'Neumático',
    level: 12,
    colorName: 'Neón Índigo',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    borderClass: 'border-indigo-400',
  },
  {
    key: '13.png',
    name: 'Hipercoche Conceptual',
    level: 13,
    colorName: 'Neón Fucsia',
    badgeClass: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    borderClass: 'border-fuchsia-400',
  },
  {
    key: '14.png',
    name: 'Nave Espacial',
    level: 14,
    colorName: 'Neón Oro Cósmico',
    badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    borderClass: 'border-yellow-300',
  },
  {
    key: '15.png',
    name: 'Hipercoche 3D',
    level: 15,
    colorName: 'Neón Cian & Magenta',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderClass: 'border-cyan-400',
  },
  {
    key: '16.png',
    name: 'Batimóvil Cyberpunk',
    level: 16,
    colorName: 'Neón Violeta Stealth',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderClass: 'border-purple-400',
  },
  {
    key: '17.png',
    name: 'Auto Volador Neón',
    level: 17,
    colorName: 'Neón Celeste Antigravedad',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    borderClass: 'border-sky-400',
  },
  {
    key: '18.png',
    name: 'Portal de Hiperviaje',
    level: 18,
    colorName: 'Modo Infinito Stargate',
    badgeClass: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40',
    borderClass: 'border-yellow-300',
  },
];

export const AssetManagerModal: React.FC<AssetManagerModalProps> = ({ isOpen, onClose }) => {
  const [, setTick] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onCustomImagesChange(() => setTick((t) => t + 1));
  }, []);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const updated = await saveMultipleCustomImages(e.dataTransfer.files);
      if (updated.length > 0) {
        setSuccessMsg(`¡${updated.length} imagen(es) asignadas con éxito!`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    }
  };

  const handleIndividualUpload = async (key: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      await saveCustomImage(key, dataUrl);
      setSuccessMsg(`Imagen actualizada para ${key}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = async () => {
    if (window.confirm('¿Deseas restaurar las imágenes y diseños de neón originales?')) {
      await clearCustomImages();
      setSuccessMsg('Imágenes restauradas por defecto');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div
      id="asset-manager-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none"
    >
      <div
        id="asset-manager-container"
        className="w-full max-w-2xl max-h-[90vh] bg-[var(--bg-surface)] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[var(--bg-deep)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Galería de Autos Neón
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-[var(--text-dim)]">
                Gestiona y personaliza las imágenes de tus 14 niveles de evolución
              </p>
            </div>
          </div>
          <button
            id="close-asset-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Alert */}
          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-sky-400 bg-sky-500/10 scale-[1.01]'
                : 'border-white/15 hover:border-white/30 bg-[var(--bg-deep)]'
            }`}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = 'image/*';
              input.onchange = async (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files.length > 0) {
                  const updated = await saveMultipleCustomImages(target.files);
                  if (updated.length > 0) {
                    setSuccessMsg(`¡${updated.length} imagen(es) asignadas con éxito!`);
                    setTimeout(() => setSuccessMsg(null), 3000);
                  }
                }
              };
              input.click();
            }}
          >
            <Upload className="w-8 h-8 text-sky-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-white">
              Arrastra y suelta aquí tus imágenes de niveles
            </p>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Reconoce automáticamente archivos secuenciales <span className="text-cyan-300 font-mono">1.png</span> a <span className="text-yellow-300 font-mono">18.png</span> o nombres con números de nivel
            </p>
          </div>

          {/* 4 Car Slots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CAR_SLOTS.map((slot) => {
              const cleanKey = cleanImageFilename(slot.key);
              const customData = getCustomImageSync(cleanKey);
              const hasCustom = Boolean(customData);
              const defaultPath = getVehicleImageUrl(cleanKey);
              const activeSrc = customData || defaultPath;

              return (
                <div
                  key={slot.key}
                  id={`slot-${slot.key.replace('.', '-')}`}
                  className="bg-[var(--bg-deep)] border border-white/10 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden"
                >
                  {/* Thumbnail Preview */}
                  <div
                    className={`w-16 h-16 rounded-lg border-2 shrink-0 relative overflow-hidden bg-black flex items-center justify-center ${slot.borderClass}`}
                  >
                    <img
                      src={activeSrc}
                      alt={slot.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover block"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        const current = img.getAttribute('src') || '';
                        const fallback = getVehicleImageFallbackUrl(cleanKey);
                        if (!current.includes('assets/')) {
                          img.src = fallback;
                        } else {
                          img.style.display = 'none';
                          const fallbackEl = img.parentElement?.querySelector('.slot-svg-fallback');
                          if (fallbackEl) (fallbackEl as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="slot-svg-fallback hidden w-full h-full items-center justify-center p-1 bg-black">
                      <EvolutionIcon level={slot.level} className="w-full h-full" />
                    </div>
                  </div>

                  {/* Slot Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-xs font-bold text-white truncate">
                        {slot.name}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-theme-mono ${slot.badgeClass}`}>
                        L{slot.level}
                      </span>
                    </div>

                    <p className="text-[11px] text-[var(--text-dim)] font-theme-mono truncate mb-2">
                      {slot.key} • {slot.colorName}
                    </p>

                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 cursor-pointer inline-flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded transition-colors">
                        <Upload className="w-3 h-3" />
                        {hasCustom ? 'Cambiar' : 'Subir'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleIndividualUpload(slot.key, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      {hasCustom && (
                        <span className="text-[10px] text-emerald-400 inline-flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Personalizada
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/10 bg-[var(--bg-deep)]">
          <button
            id="reset-images-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer por defecto
          </button>
          <button
            id="close-asset-modal-done-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors border border-white/10"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { MapPin, Camera, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../utils/api';

export default function VirtualTours() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/destinations?limit=20')
      .then(r => {
        const withTours = (r.data.destinations ?? []).filter((d: any) => d.virtualTour);
        setDestinations(withTours);
        if (withTours.length > 0) loadTour(withTours[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function loadTour(dest: any) {
    setSelected(null);
    setCurrentImg(0);
    try {
      const res = await api.get(`/destinations/${dest.id}`);
      setSelected(res.data.destination);
    } catch {}
  }

  const images360: string[] = selected?.virtualTour?.images360
    ? (() => { try { return JSON.parse(selected.virtualTour.images360); } catch { return []; } })()
    : [];

  const highlights: string[] = selected?.virtualTour?.highlights
    ? (() => { try { return JSON.parse(selected.virtualTour.highlights); } catch { return []; } })()
    : [];

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <Camera className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h1 className="text-3xl font-display font-bold text-white mb-2">Virtual Tours</h1>
          <p className="text-gray-400">Experience destinations before you book — explore stunning visuals and video highlights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading virtual tours...</div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No virtual tours available yet</h3>
            <p className="text-gray-500 mt-2">Check back soon — we're adding more destinations!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Destination List */}
            <div className="lg:col-span-1 space-y-2">
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Available Tours</h3>
              {destinations.map(d => (
                <button
                  key={d.id}
                  onClick={() => loadTour(d)}
                  className={`w-full text-left rounded-xl overflow-hidden border transition-all ${selected?.id === d.id ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-700 hover:border-gray-500'}`}
                >
                  <div className="relative h-20">
                    <img src={d.coverImage} alt={d.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200'; }} />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                      <div>
                        <p className="text-white font-semibold text-sm">{d.name}</p>
                        <p className="text-white/70 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{d.state}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Tour Viewer */}
            <div className="lg:col-span-3">
              {!selected ? (
                <div className="flex items-center justify-center h-80 bg-gray-800 rounded-2xl text-gray-500">
                  <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <p>Select a destination to start the virtual tour</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Main image viewer */}
                  {images360.length > 0 && (
                    <div className="relative bg-gray-800 rounded-2xl overflow-hidden">
                      <img
                        src={images360[currentImg]}
                        alt="Virtual tour"
                        className="w-full h-96 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'; }}
                      />
                      <div className="absolute inset-0 flex items-center justify-between p-4">
                        <button
                          onClick={() => setCurrentImg(i => Math.max(0, i - 1))}
                          disabled={currentImg === 0}
                          className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCurrentImg(i => Math.min(images360.length - 1, i + 1))}
                          disabled={currentImg === images360.length - 1}
                          className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images360.map((_: string, i: number) => (
                          <button key={i} onClick={() => setCurrentImg(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentImg ? 'bg-white' : 'bg-white/40'}`} />
                        ))}
                      </div>
                      <div className="absolute top-4 right-4 bg-purple-600/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-white font-medium">
                        📸 {currentImg + 1} / {images360.length}
                      </div>
                    </div>
                  )}

                  {/* Video */}
                  {selected.virtualTour?.videoUrl && (
                    <div className="bg-gray-800 rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
                        <Play className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-medium text-sm">Video Highlights</span>
                      </div>
                      <div className="aspect-video">
                        <iframe
                          src={selected.virtualTour.videoUrl}
                          title={`${selected.name} virtual tour`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="bg-gray-800 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-xl font-display font-bold text-white">{selected.name}</h2>
                        <p className="text-gray-400 text-sm flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selected.state}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{selected.virtualTour?.description}</p>

                    {highlights.length > 0 && (
                      <div>
                        <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Tour Highlights</h4>
                        <div className="flex flex-wrap gap-2">
                          {highlights.map((h: string) => (
                            <span key={h} className="text-xs bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full">✦ {h}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

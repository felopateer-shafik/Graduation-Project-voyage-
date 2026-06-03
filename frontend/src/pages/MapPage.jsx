import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '@/components/common/Navbar';
import { hotelsAPI } from '@/api/hotels';
import { citiesAPI } from '@/api/cities';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

// حل مشكلة أيقونة الماركر (ضروري جداً)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_CENTER = [30.0444, 31.2357];
const DEFAULT_ZOOM = 6;

const FILTERS = [
    { id: 'all',      label: 'All' },
    { id: 'hotels',   label: 'Hotels' },
    { id: 'landmarks', label: 'Landmarks' },
];

export default function MapPage() {
    const [hotels, setHotels] = useState([]);
    const [landmarks, setLandmarks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadData = useCallback(async () => {
        try {
            const [hotelData, landmarkData] = await Promise.all([
                hotelsAPI.getAll(),
                citiesAPI.getLandmarks(),
            ]);
            // التأكد من وجود الاحداثيات قبل العرض
            setHotels(hotelData.filter(h => h.latitude && h.longitude));
            setLandmarks(landmarkData.filter(l => l.latitude && l.longitude));
        } catch (err) {
            console.error('Failed to load map data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    return (
        <div className="h-screen w-full overflow-hidden relative bg-gray-50">
            <Navbar />

            {/* Filter bar - z-index عالي عشان يظهر فوق الخريطة */}
            <div className="absolute top-20 left-0 right-0 z-[1001] bg-white/95 backdrop-blur-sm border-b px-4 py-3 shadow-sm">
                <div className="max-w-5xl mx-auto flex items-center gap-3">
                    {FILTERS.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={cn(
                                'px-5 py-1.5 rounded-full text-xs font-bold transition-all border',
                                filter === f.id
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                    {!loading && (
                        <span className="ml-auto text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                           Found: {hotels.length + landmarks.length} Places
                        </span>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="absolute inset-0 pt-32 z-0">
                <MapContainer
                    center={DEFAULT_CENTER}
                    zoom={DEFAULT_ZOOM}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                    />

                    {/* رندر الفنادق */}
                    {(filter === 'all' || filter === 'hotels') && hotels.map(hotel => (
                        <Marker key={`h-${hotel.id}`} position={[hotel.latitude, hotel.longitude]}>
                            <Popup>
                                <div className="w-44 p-1">
                                    {hotel.imageUrl && (
                                        <img src={hotel.imageUrl} className="w-full h-24 object-cover rounded-md mb-2" alt={hotel.name} />
                                    )}
                                    <h3 className="font-bold text-sm text-gray-800 leading-tight">{hotel.name}</h3>
                                    <p className="text-blue-600 font-extrabold text-sm mt-1">
                                        {formatCurrency(hotel.pricePerNight)}
                                    </p>
                                    <button
                                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* رندر المعالم */}
                    {(filter === 'all' || filter === 'landmarks') && landmarks.map(lm => (
                        <Marker key={`l-${lm.id}`} position={[lm.latitude, lm.longitude]}>
                            <Popup>
                                <div className="w-44 p-1">
                                    <h3 className="font-bold text-sm text-gray-800">{lm.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{lm.description}</p>
                                    <button
                                        onClick={() => navigate(`/landmarks/${lm.id}`)}
                                        className="w-full mt-3 bg-gray-900 hover:bg-black text-white text-xs font-bold py-2 rounded-lg transition-colors"
                                    >
                                        View Landmark
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* شاشة التحميل */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[2000]">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-blue-600 font-bold text-sm">Loading Places...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
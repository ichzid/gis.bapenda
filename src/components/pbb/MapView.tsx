"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TaxObject {
  id: number;
  nop: string;
  nama_wp: string;
  nik: string;
  alamat: string;
  kecamatan: string;
  lat: number;
  lng: number;
  luas_tanah: number;
  luas_bangunan: number;
  nilai_pbb: number;
  status: string;
}

interface MapViewProps {
  taxObjects: TaxObject[];
  onMarkerClick: (obj: TaxObject) => void;
}

function MapController() {
  const map = useMap();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      map.setView([3.16166, 99.52652], 12);
      isInitialized.current = true;
    }
  }, [map]);

  return null;
}

const statusColors: Record<string, string> = {
  lunas: "#16a34a",
  belum: "#dc2626",
  kurang: "#ca8a04",
};

function createRectangleCoords(
  lat: number,
  lng: number,
  luasTanah: number
): [number, number][] {
  const sideMeters = Math.sqrt(luasTanah);
  const sideDeg = sideMeters / 111000;
  const half = Math.max(sideDeg / 2, 0.0005);
  return [
    [lat - half, lng - half],
    [lat - half, lng + half],
    [lat + half, lng + half],
    [lat + half, lng - half],
  ];
}

export default function MapView({ taxObjects, onMarkerClick }: MapViewProps) {
  const [mapType, setMapType] = useState<"osm" | "esri" | "google" | "google-satellite">("osm");

  const mapTileSources = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    esri: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    },
    google: {
      url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      attribution: '&copy; <a href="https://www.google.com/maps">Google</a>',
    },
    "google-satellite": {
      url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      attribution: '&copy; <a href="https://www.google.com/maps">Google</a>',
    },
  };

  const currentTile = mapTileSources[mapType];

  const mapLabels: Record<typeof mapType, string> = {
    osm: "Peta",
    esri: "Satelit",
    google: "Google Maps",
    "google-satellite": "Google Satelit",
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[3.16166, 99.52652]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
        minZoom={6}
      >
        <MapController />
        <TileLayer
          attribution={currentTile.attribution}
          url={currentTile.url}
        />

        {/* Polygon bidang tanah objek pajak */}
        {taxObjects.map((obj) => {
          const coords = createRectangleCoords(obj.lat, obj.lng, obj.luas_tanah);
          const color = statusColors[obj.status] || "#6b7280";
          const label = `${obj.id}`;
          const center: [number, number] = [obj.lat, obj.lng];

          return (
            <GeoJSON
              key={obj.id}
              data={
                {
                  type: "Feature",
                  properties: { id: obj.id, status: obj.status },
                  geometry: {
                    type: "Polygon",
                    coordinates: [[...coords, coords[0]]],
                  },
                } as GeoJSON.GeoJsonObject
              }
              style={() => ({
                fillColor: color,
                fillOpacity: 0.45,
                color: color,
                weight: 2.5,
              })}
              eventHandlers={{ click: () => onMarkerClick(obj) }}
            >
              {/* Marker label angka di tengah polygon */}
              <Marker
                position={center}
                icon={L.divIcon({
                  className: "",
                  html: `<div style="
                    background: ${color}; 
                    color: white; 
                    width: 22px; 
                    height: 22px; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 11px; 
                    font-weight: 700; 
                    border: 2px solid white;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                    cursor: pointer;
                  ">${label}</div>`,
                  iconSize: [22, 22],
                  iconAnchor: [11, 11],
                })}
                eventHandlers={{ click: () => onMarkerClick(obj) }}
              />
              <Popup>
                <div className="text-sm min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-block w-3 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-gray-900">
                      #{obj.id} {obj.nama_wp}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mb-0.5">{obj.nop}</p>
                  <p className="text-gray-600 text-xs mb-1">{obj.kecamatan}</p>
                  <p className="text-gray-600 text-xs">
                    Luas Tanah: {obj.luas_tanah.toLocaleString()} m²
                  </p>
                  <p className="text-gray-600 text-xs">
                    Luas Bangunan: {obj.luas_bangunan.toLocaleString()} m²
                  </p>
                  <p className="text-xs font-medium mt-1">Rp {obj.nilai_pbb.toLocaleString("id-ID")}</p>
                </div>
              </Popup>
            </GeoJSON>
          );
        })}
      </MapContainer>

      {/* Legend overlay (kiri bawah peta) */}
      <div className="absolute bottom-5 left-5 z-[999] bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg text-sm">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Legenda</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: "#16a34a", opacity: 0.7 }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Lunas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: "#ca8a04", opacity: 0.7 }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Kurang Bayar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: "#dc2626", opacity: 0.7 }} />
            <span className="text-xs text-gray-600 dark:text-gray-400">Belum Bayar</span>
          </div>
        </div>
      </div>

      {/* Zoom control (kanan atas) */}
      <div className="absolute top-5 right-5 z-[999] flex flex-col gap-1">
        <button
          onClick={() => {
            const el = document.querySelector(".leaflet-container") as unknown as { _leaflet_map?: L.Map } | null;
            el?._leaflet_map?.zoomIn();
          }}
          className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow text-lg font-bold"
        >+</button>
        <button
          onClick={() => {
            const el = document.querySelector(".leaflet-container") as unknown as { _leaflet_map?: L.Map } | null;
            el?._leaflet_map?.zoomOut();
          }}
          className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow text-lg font-bold"
        >−</button>
      </div>

      {/* Map type radio button (kanan bawah) */}
      <div className="absolute bottom-5 right-5 z-[999] bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2.5 shadow-lg text-sm">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Jenis Peta</p>
        <div className="space-y-1.5">
          {(["osm", "esri", "google", "google-satellite"] as const).map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setMapType(type)}
            >
              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${mapType === type ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-gray-600"}`}>
                {mapType === type && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
              </div>
              <span className={`text-xs ${mapType === type ? "text-gray-800 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}`}>
                {mapLabels[type]}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

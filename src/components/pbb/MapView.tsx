"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Map,
  Popup,
  NavigationControl,
  useMap,
  MapMouseEvent,
} from "@vis.gl/react-maplibre";

interface BoundaryPoint {
  lat: number;
  lng: number;
}

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
  boundary: BoundaryPoint[];
}

interface MapViewProps {
  taxObjects: TaxObject[];
  onMarkerClick: (obj: TaxObject) => void;
  highlightFeature: GeoJSON.Feature | null;
}

const mapTileSources: Record<
  "osm" | "esri" | "google" | "google-satellite",
  { url: string; attribution: string }
> = {
  osm: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
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

const mapLabels: Record<keyof typeof mapTileSources, string> = {
  osm: "Peta",
  esri: "Satelit",
  google: "Google Maps",
  "google-satellite": "Google Satelit",
};

// Hitung bounding box dari GeoJSON Feature
function getFeatureBounds(feature: GeoJSON.Feature): [[number, number], [number, number]] | null {
  const coords: [number, number][] = [];

  function extract(geom: GeoJSON.Geometry | undefined) {
    if (!geom) return;
    if (geom.type === "Polygon") {
      geom.coordinates[0].forEach((c) => coords.push([c[0], c[1]]));
    } else if (geom.type === "MultiPolygon") {
      geom.coordinates.forEach((poly) => {
        poly[0].forEach((c) => coords.push([c[0], c[1]]));
      });
    }
  }

  extract(feature.geometry);
  if (coords.length === 0) return null;

  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ] as [[number, number], [number, number]];
}

function MapController({ highlightFeature }: { highlightFeature: GeoJSON.Feature | null }) {
  const { current: map } = useMap();

  useEffect(() => {
    if (highlightFeature && map) {
      const bounds = getFeatureBounds(highlightFeature);
      if (bounds) {
        map.fitBounds(bounds, { padding: 50, maxZoom: 16 });
      }
    }
  }, [map, highlightFeature]);

  return null;
}

export default function MapView({ taxObjects, onMarkerClick, highlightFeature }: MapViewProps) {
  const [mapType, setMapType] = useState<keyof typeof mapTileSources>("osm");
  const [hoverObj, setHoverObj] = useState<{ lng: number; lat: number; obj: TaxObject } | null>(null);

  // Konversi taxObjects ke GeoJSON FeatureCollection
  const geoJsonData = useMemo((): GeoJSON.FeatureCollection => ({
    type: "FeatureCollection",
    features: taxObjects.map((obj) => ({
      type: "Feature" as const,
      properties: {
        id: obj.id,
        nama_wp: obj.nama_wp,
        nop: obj.nop,
        kecamatan: obj.kecamatan,
        luas_tanah: obj.luas_tanah,
        nilai_pbb: obj.nilai_pbb,
        status: obj.status,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          obj.boundary.map((p) => [p.lng, p.lat]).concat([[obj.boundary[0].lng, obj.boundary[0].lat]]),
        ],
      },
    })),
  }), [taxObjects]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapStyle: any = useMemo(
    () => ({
      version: 8,
      sources: {
        "raster-tiles": {
          type: "raster",
          tiles: [mapTileSources[mapType].url],
          tileSize: 256,
          attribution: mapTileSources[mapType].attribution,
        },
        "tax-source": {
          type: "geojson",
          data: geoJsonData,
        },
      },
      layers: [
        {
          id: "raster-layer",
          type: "raster",
          source: "raster-tiles",
        },
        {
          id: "tax-polygon-fill",
          type: "fill",
          source: "tax-source",
          paint: {
            "fill-color": [
              "match",
              ["get", "status"],
              "lunas", "#16a34a",
              "belum", "#dc2626",
              "kurang", "#ca8a04",
              "#6b7280",
            ],
            "fill-opacity": 0.5,
            "fill-outline-color": [
              "match",
              ["get", "status"],
              "lunas", "#16a34a",
              "belum", "#dc2626",
              "kurang", "#ca8a04",
              "#6b7280",
            ],
          },
        },
      ],
    }),
    [mapType, geoJsonData],
  );

  // Klik pada polygon
  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      try {
        const features = e.target.queryRenderedFeatures(e.point, {
          layers: ["tax-polygon-fill"],
        });
        if (features.length > 0) {
          const id = features[0].properties?.id;
          const obj = taxObjects.find((o) => o.id === id);
          if (obj) onMarkerClick(obj);
        }
      } catch {
        // layer belum terpasang, abaikan
      }
    },
    [taxObjects, onMarkerClick],
  );

  // Hover → tooltip
  const handleMouseMove = useCallback(
    (e: MapMouseEvent) => {
      try {
        const features = e.target.queryRenderedFeatures(e.point, {
          layers: ["tax-polygon-fill"],
        });
        if (features.length > 0) {
          const id = features[0].properties?.id;
          const obj = taxObjects.find((o) => o.id === id);
          if (obj) {
            setHoverObj({ lng: e.lngLat.lng, lat: e.lngLat.lat, obj });
            e.target.getCanvas().style.cursor = "pointer";
            return;
          }
        }
      } catch {
        // layer belum terpasang, abaikan
      }
      setHoverObj(null);
      e.target.getCanvas().style.cursor = "";
    },
    [taxObjects],
  );

  return (
    <div className="h-full w-full relative">
      <Map
        initialViewState={{
          longitude: 99.52652,
          latitude: 3.16166,
          zoom: 12,
        }}
        mapStyle={mapStyle}
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        minZoom={6}
        attributionControl={false}
      >
        <MapController highlightFeature={highlightFeature} />
        <NavigationControl position="top-right" />

        {hoverObj && (
          <Popup
            longitude={hoverObj.lng}
            latitude={hoverObj.lat}
            closeButton={false}
            offset={[0, -20]}
          >
            <table>
              <tbody>
                <tr>
                  <td style={{ paddingRight: 6 }}>NOP</td>
                  <td style={{ paddingRight: 6 }}>:</td>
                  <td>
                    <strong>{hoverObj.obj.nop}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: 6 }}>Nama</td>
                  <td style={{ paddingRight: 6 }}>:</td>
                  <td>
                    <strong>{hoverObj.obj.nama_wp}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </Popup>
        )}
      </Map>

      {/* Legenda (kiri bawah) */}
      <div className="absolute bottom-5 left-5 z-[10] bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 shadow-md">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          Legenda
        </p>
        <div className="space-y-2">
          {[
            { color: "#16a34a", label: "Lunas" },
            { color: "#ca8a04", label: "Kurang Bayar" },
            { color: "#dc2626", label: "Belum Bayar" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded" style={{ backgroundColor: color, opacity: 0.7 }} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Jenis Peta (kanan bawah) */}
      <div className="absolute bottom-5 right-5 z-[10] bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 shadow-md">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          Jenis Peta
        </p>
        <div className="space-y-1.5">
          {(Object.keys(mapTileSources) as (keyof typeof mapTileSources)[]).map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setMapType(type)}
            >
              <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  mapType === type
                    ? "border-brand-500 bg-brand-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {mapType === type && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
              </div>
              <span
                className={`text-xs ${
                  mapType === type
                    ? "text-gray-800 dark:text-white font-medium"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {mapLabels[type]}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

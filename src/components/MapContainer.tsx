import 'leaflet/dist/leaflet.css';

import { mdiMapMarker } from '@mdi/js';
import { divIcon, LeafletMouseEvent, Map } from 'leaflet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { MapContainer as MapBox, Marker, TileLayer } from 'react-leaflet';

export interface IMapContainer {
    readonly height: number;
    readonly zoom?: number;
    readonly minZoom: number;
    readonly maxZoom: number;
    readonly tile: string;
    readonly coordinates: number[];
    readonly scrollWheelZoom?: boolean;
    readonly zoomControl?: boolean;
    readonly borderRadius?: string;
    readonly dragging?: boolean;
    readonly onClick?: (lat: number, lng: number) => void;
}

export const MapContainer = ({
    height,
    minZoom,
    maxZoom,
    zoom,
    tile,
    borderRadius = '8px',
    coordinates,
    scrollWheelZoom,
    zoomControl,
    dragging,
    onClick
}: IMapContainer) => {
    const [latitude, longitude] = useMemo(() => coordinates, [coordinates]);
    const icon = useMemo(
        () =>
            divIcon({
                className: 'leaflet-data-marker',
                html: `<svg viewBox="0 0 24 24" style="width: 32px; height: 32px; fill: #364153; filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5));">
            <path d="${mdiMapMarker}" stroke="white" stroke-width="0.7" />
        </svg>`,
                iconAnchor: [16, 32]
            }),
        []
    );

    const mapRef = useRef<Map>(null);
    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            map.flyTo([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const handleClick = useCallback(
        (e: LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            const normalizedLng = ((((lng + 180) % 360) + 360) % 360) - 180;
            onClick?.(lat, normalizedLng);
        },
        [onClick]
    );
    useEffect(() => {
        const map = mapRef.current;
        if (!map) {
            return;
        }
        map.on('click', handleClick);
        return () => {
            map.off('click', handleClick);
        };
    }, [handleClick]);

    return (
        <MapBox
            ref={mapRef}
            zoom={zoom ?? 6}
            scrollWheelZoom={scrollWheelZoom}
            zoomControl={zoomControl}
            attributionControl={false}
            doubleClickZoom={false}
            dragging={dragging}
            maxZoom={maxZoom}
            minZoom={minZoom}
            center={[latitude, longitude]}
            style={{ cursor: 'default', borderRadius, height }}
        >
            <TileLayer url={tile} />
            <Marker position={[latitude, longitude]} icon={icon} />
        </MapBox>
    );
};

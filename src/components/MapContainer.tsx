import { Map, Marker } from 'pigeon-maps';

interface IMapContainer {
    readonly height: number;
    readonly zoom?: number;
    readonly borderRadius?: string;
    readonly coordinates: number[];
    readonly onClick?: (latitude: number, longitude: number) => void;
}

export const MapContainer = ({
    height,
    coordinates,
    zoom,
    onClick,
    borderRadius = '8px'
}: IMapContainer) => {
    const [latitude, longitude] = coordinates;

    return (
        <div
            style={{
                borderRadius: borderRadius,
                overflow: 'hidden',
                width: '100%',
                height: `${height}px`,
                position: 'relative'
            }}
        >
            <Map
                animate={true}
                height={height}
                center={[latitude, longitude]}
                defaultZoom={zoom ?? 6}
                maxZoom={16}
                minZoom={2}
                attribution={false}
                metaWheelZoom={true}
                metaWheelZoomWarning="Use Ctrl + Scroll to zoom!"
                onClick={({ latLng }) => onClick?.(latLng[0], latLng[1])}
            >
                <Marker width={30} anchor={[latitude, longitude]} />
            </Map>
        </div>
    );
};

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { MapContainer } from '../components/MapContainer';
import { ISchema } from '../config/schema';
import { sendUserAlert } from '../helpers/alert/sendUserAlert';

const defaultConfig = {
    latitude: 40.844184,
    longitude: -73.863995,
    elevation: 100
};

export const Location = ({ onCreate, onUpdate }: ISchema) => {
    const initialized = useRef(false);
    const [currentConfig, setCurrentConfig] = useState({ ...defaultConfig });
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            onCreate(currentConfig);
        }
    }, [currentConfig, onCreate]);

    const handleConfigUpdate = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const numValue = Number(target.value);
        if (isNaN(numValue)) {
            return;
        }
        switch (target.name) {
            case 'latitude':
                if (numValue < -90 || numValue > 90) {
                    sendUserAlert('Latitude must be between -90 and 90', true);
                    return;
                }
                break;
            case 'longitude':
                if (numValue < -180 || numValue > 180) {
                    sendUserAlert('Longitude must be between -180 and 180', true);
                    return;
                }
                break;
            case 'elevation':
                if (numValue < 0) {
                    sendUserAlert('Elevation must be greater than 0', true);
                    return;
                }
                break;
        }
        const updated = { ...currentConfig, [target.name]: numValue };
        setCurrentConfig(updated);
        onUpdate(updated);
    };

    const handleMapClick = (lat: number, lng: number) => {
        const updated = {
            ...currentConfig,
            latitude: Math.round(lat * 100000) / 100000,
            longitude: Math.round(lng * 100000) / 100000
        };
        setCurrentConfig(updated);
        onUpdate(updated);
    };

    return (
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box flex flex-col gap-4 border p-4 lg:flex-row">
            <div className="flex flex-col space-y-2 lg:w-1/3">
                <label className="label">Latitude</label>
                <input
                    name="latitude"
                    type="number"
                    value={currentConfig.latitude}
                    className="input w-full"
                    placeholder="Input or pick on map"
                    onChange={handleConfigUpdate}
                />
                <label className="label">Longitude</label>
                <input
                    name="longitude"
                    type="number"
                    value={currentConfig.longitude}
                    className="input w-full"
                    placeholder="Input or pick on map"
                    onChange={handleConfigUpdate}
                />
                <label className="label">Elevation (m)</label>
                <input
                    name="elevation"
                    type="number"
                    value={currentConfig.elevation}
                    className="input w-full"
                    placeholder="Input your elevation"
                    onChange={handleConfigUpdate}
                />
            </div>

            <div className="flex-1 lg:w-2/3">
                <label className="label mb-2">Pick Location</label>
                <MapContainer
                    zoom={2}
                    height={200}
                    onClick={handleMapClick}
                    coordinates={[currentConfig.latitude, currentConfig.longitude]}
                />
            </div>
        </fieldset>
    );
};

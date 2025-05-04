import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { ISchema } from '../config/schema';
import { sendUserAlert } from '../helpers/alert/sendUserAlert';

const defaultConfig = {
    level: 'info',
    rotation: 5,
    lifecycle: 3,
    size: 0,
    path: './logs/observer.log'
};

export const Logger = ({ onCreate, onUpdate }: ISchema) => {
    const initialized = useRef(false);
    const [currentConfig, setCurrentConfig] = useState({ ...defaultConfig });
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            onCreate(currentConfig);
        }
    }, [currentConfig, onCreate]);

    const prevConfigRef = useRef(currentConfig);
    useEffect(() => {
        if (prevConfigRef.current !== currentConfig) {
            prevConfigRef.current = currentConfig;
            onUpdate(currentConfig);
        }
    }, [currentConfig, onUpdate]);

    const handleConfigUpdate = useCallback(
        ({ target }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setCurrentConfig((prev) => ({
                ...prev,
                [target.name]: target.type === 'number' ? Number(target.value) : target.value
            }));
        },
        []
    );

    return (
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box space-y-2 border p-4">
            <div className="flex flex-col space-y-2">
                <label className="label">Debug Mode</label>
                <select
                    name="level"
                    className="select w-full"
                    onChange={handleConfigUpdate}
                    defaultValue={currentConfig.level}
                >
                    <option disabled>Select logging level</option>
                    <option value="info">Info</option>
                    <option value="warn">Warn</option>
                    <option value="error">Error</option>
                </select>
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Log Rotation</label>
                <input
                    name="rotation"
                    type="number"
                    className="input w-full"
                    onChange={(e) => {
                        const numVal = Number(e.target.value);
                        if (numVal < 0) {
                            sendUserAlert('Rotation must be greater than 0', true);
                            return;
                        }
                        handleConfigUpdate(e);
                    }}
                    value={currentConfig.rotation}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Log Lifecycle</label>
                <input
                    name="lifecycle"
                    type="number"
                    className="input w-full"
                    onChange={(e) => {
                        const numVal = Number(e.target.value);
                        if (numVal < 0) {
                            sendUserAlert('Life cycle must be greater than 0', true);
                            return;
                        }
                        handleConfigUpdate(e);
                    }}
                    value={currentConfig.lifecycle}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Archive Size</label>
                <input
                    name="size"
                    type="number"
                    className="input w-full"
                    onChange={(e) => {
                        const numVal = Number(e.target.value);
                        if (numVal < 0) {
                            sendUserAlert('Archive size must be greater than 0', true);
                            return;
                        }
                        handleConfigUpdate(e);
                    }}
                    value={currentConfig.size}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Log Path</label>
                <input
                    name="path"
                    type="text"
                    className="input w-full"
                    onChange={handleConfigUpdate}
                    value={currentConfig.path}
                />
            </div>
        </fieldset>
    );
};

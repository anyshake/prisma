import { useCallback, useEffect, useRef, useState } from 'react';

import { ISchema } from '../config/schema';
import { sendUserAlert } from '../helpers/alert/sendUserAlert';

const defaultConfig = {
    listen: '0.0.0.0:8073',
    debug: false,
    cors: true
};

export const Server = ({ onCreate, onUpdate }: ISchema) => {
    const initialized = useRef(false);
    const [currentConfig, setCurrentConfig] = useState({ ...defaultConfig });
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            onCreate(currentConfig);
        }
    }, [currentConfig, onCreate]);

    const [listenHostname, setListenHostname] = useState('0.0.0.0');
    const [listenPort, setListenPort] = useState('8073');

    const updateListenAddr = useCallback(() => {
        return `${listenHostname}:${listenPort}`;
    }, [listenHostname, listenPort]);

    useEffect(() => {
        const newAddr = updateListenAddr();
        setCurrentConfig((prev) => ({ ...prev, listen: newAddr }));
    }, [updateListenAddr]);

    const prevConfigRef = useRef(currentConfig);
    useEffect(() => {
        if (prevConfigRef.current !== currentConfig) {
            prevConfigRef.current = currentConfig;
            onUpdate(currentConfig);
        }
    }, [currentConfig, onUpdate]);

    return (
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box space-y-2 border p-4">
            <div className="flex flex-col space-y-2">
                <label className="label">Listen Hostname</label>
                <input
                    type="text"
                    className="input w-full"
                    value={listenHostname}
                    onChange={({ target }) => setListenHostname(target.value)}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Listen Port</label>
                <input
                    type="number"
                    className="input w-full"
                    value={listenPort}
                    onChange={({ target }) => {
                        const numVal = Number(target.value);
                        if (numVal < 0 || numVal > 65535) {
                            sendUserAlert('Port must be between 0 and 65535', true);
                            return;
                        }
                        setListenPort(target.value);
                    }}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Debug Mode</label>
                <select
                    name="protocol"
                    className="select w-full"
                    onChange={({ target }) =>
                        setCurrentConfig((prev) => ({ ...prev, debug: target.value === 'true' }))
                    }
                    defaultValue={currentConfig.debug ? 'true' : 'false'}
                >
                    <option disabled>Select debug mode enabled</option>
                    <option value="true">Enable</option>
                    <option value="false">Disable</option>
                </select>
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Allow Cross-Origin Requests</label>
                <select
                    name="protocol"
                    className="select w-full"
                    onChange={({ target }) =>
                        setCurrentConfig((prev) => ({ ...prev, cors: target.value === 'true' }))
                    }
                    defaultValue={currentConfig.cors ? 'true' : 'false'}
                >
                    <option disabled>Select allow CORS requests</option>
                    <option value="true">Enable</option>
                    <option value="false">Disable</option>
                </select>
            </div>
        </fieldset>
    );
};

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { ISchema } from '../config/schema';
import { sendUserAlert } from '../helpers/alert/sendUserAlert';

const defaultConfig = {
    endpoint: 'ntp://pool.ntp.org:123',
    timeout: 5,
    retry: 5
};

export const NtpClient = ({ onCreate, onUpdate }: ISchema) => {
    const initialized = useRef(false);
    const [currentConfig, setCurrentConfig] = useState({ ...defaultConfig });
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            onCreate(currentConfig);
        }
    }, [currentConfig, onCreate]);

    const [ntpHostname, setNtpHostname] = useState('pool.ntp.org');
    const [ntpPort, setNtpPort] = useState('123');

    const updateEndpoint = useCallback(() => {
        const url = new URL('ntp://');
        url.hostname = ntpHostname;
        url.port = ntpPort;
        return url.toString();
    }, [ntpHostname, ntpPort]);

    useEffect(() => {
        const newEndpoint = updateEndpoint();
        setCurrentConfig((prev) => ({ ...prev, endpoint: newEndpoint }));
    }, [updateEndpoint]);

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
                <label className="label">NTP Server Hostname</label>
                <input
                    type="text"
                    className="input w-full"
                    value={ntpHostname}
                    onChange={({ target }) => setNtpHostname(target.value)}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">NTP Server Port</label>
                <input
                    type="number"
                    className="input w-full"
                    value={ntpPort}
                    onChange={({ target }) => {
                        const numVal = Number(target.value);
                        if (numVal < 0 || numVal > 65535) {
                            sendUserAlert('Port must be between 0 and 65535', true);
                            return;
                        }
                        setNtpPort(target.value);
                    }}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Connection Timeout (s)</label>
                <input
                    type="number"
                    name="timeout"
                    className="input w-full"
                    onChange={(e) => {
                        if (Number(e.target.value) < 0) {
                            sendUserAlert('Connection timeout must be greater than 0', true);
                            return;
                        }
                        handleConfigUpdate(e);
                    }}
                    value={currentConfig.timeout}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Connection Retry</label>
                <input
                    type="number"
                    name="retry"
                    className="input w-full"
                    onChange={(e) => {
                        if (Number(e.target.value) < 0) {
                            sendUserAlert('Retry must be greater than 0', true);
                            return;
                        }
                        handleConfigUpdate(e);
                    }}
                    value={currentConfig.retry}
                />
            </div>
        </fieldset>
    );
};

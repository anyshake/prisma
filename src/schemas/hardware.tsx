import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { ISchema } from '../config/schema';
import { sendUserAlert } from '../helpers/alert/sendUserAlert';

const defaultConfig = {
    endpoint: '',
    protocol: 'v3',
    model: 'E-C111G',
    timeout: 5
};

export const Hardware = ({ onCreate, onUpdate }: ISchema) => {
    const initialized = useRef(false);
    const [currentConfig, setCurrentConfig] = useState({ ...defaultConfig });
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            onCreate(currentConfig);
        }
    }, [currentConfig, onCreate]);

    const [isCustomModel, setIsCustomModel] = useState(false);
    const [customModelName, setCustomModelName] = useState(defaultConfig.model);

    const [transportType, setTransportType] = useState('serial');
    const [tcpHostname, setTcpHostname] = useState('10.0.0.100');
    const [tcpPort, setTcpPort] = useState('12345');
    const [serialPort, setSerialPort] = useState(
        navigator.userAgent.includes('Windows') ? 'COM3' : '/dev/ttyUSB0'
    );
    const [serialBaudrate, setSerialBaudrate] = useState('57600');

    const updateEndpoint = useCallback(() => {
        const url = new URL(`${transportType}://`);
        if (transportType === 'tcp') {
            url.hostname = tcpHostname;
            url.port = tcpPort;
        } else if (transportType === 'serial') {
            url.pathname = serialPort.startsWith('/') ? serialPort : '';
            url.hostname = serialPort.startsWith('/') ? '' : serialPort.toUpperCase();
            url.searchParams.set('baudrate', serialBaudrate);
        }
        return url.toString();
    }, [transportType, tcpHostname, tcpPort, serialPort, serialBaudrate]);

    useEffect(() => {
        const newEndpoint = updateEndpoint();
        setCurrentConfig((prev) => ({
            ...prev,
            endpoint: newEndpoint,
            ...(isCustomModel && { model: customModelName })
        }));
    }, [updateEndpoint, isCustomModel, customModelName]);

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
                <label className="label">Data Protocol</label>
                <select
                    name="protocol"
                    className="select w-full"
                    defaultValue="v3"
                    onChange={handleConfigUpdate}
                >
                    <option disabled>Select your data protocol</option>
                    <option value="v3">v3</option>
                    <option value="v2">v2 (previously "mainline")</option>
                    <option value="v1">v1 (previously "legacy")</option>
                </select>
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Product Model</label>
                <select
                    name="model"
                    className="select w-full"
                    defaultValue="E-C111G"
                    onChange={(e) => {
                        setIsCustomModel(e.target.value === 'custom-model');
                        handleConfigUpdate(e);
                    }}
                >
                    <option disabled>Select your product model</option>
                    <option value="E-C111G">E-C111G</option>
                    <option value="E-C121G">E-C121G</option>
                    <option value="custom-model">Custom</option>
                </select>
            </div>

            {isCustomModel && (
                <div className="flex flex-col space-y-2">
                    <label className="label">Custom Model</label>
                    <input
                        type="text"
                        name="custom_model"
                        className="input w-full"
                        value={customModelName}
                        onChange={({ target }) => {
                            if (!target.value.length) {
                                sendUserAlert('Custom model cannot be empty', true);
                                return;
                            }
                            setCustomModelName(target.value.trim().toUpperCase());
                        }}
                    />
                </div>
            )}

            <div className="flex flex-col space-y-2">
                <label className="label">Transport Type</label>
                <select
                    className="select w-full"
                    value={transportType}
                    onChange={({ target }) => setTransportType(target.value)}
                >
                    <option disabled>Select your transport type</option>
                    <option value="serial">Serial</option>
                    <option value="tcp">TCP</option>
                </select>
            </div>

            {transportType === 'serial' ? (
                <div className="flex flex-col space-y-2">
                    <label className="label">Serial Port</label>
                    <input
                        type="text"
                        className="input w-full"
                        value={serialPort}
                        onChange={({ target }) => {
                            if (!target.value.length) {
                                sendUserAlert('Serial port cannot be empty', true);
                                return;
                            }
                            setSerialPort(target.value);
                        }}
                    />
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    <label className="label">TCP Hostname</label>
                    <input
                        type="text"
                        className="input w-full"
                        value={tcpHostname}
                        onChange={({ target }) => {
                            if (!target.value.length) {
                                sendUserAlert('TCP hostname cannot be empty', true);
                                return;
                            }
                            setTcpHostname(target.value);
                        }}
                    />
                </div>
            )}

            {transportType === 'serial' ? (
                <div className="flex flex-col space-y-2">
                    <label className="label">Serial Baudrate</label>
                    <input
                        step={100}
                        type="number"
                        className="input w-full"
                        value={serialBaudrate}
                        onChange={({ target }) => {
                            if (Number(target.value) < 0) {
                                sendUserAlert('Serial baudrate must be greater than 0', true);
                                return;
                            }
                            setSerialBaudrate(target.value);
                        }}
                    />
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    <label className="label">TCP Port</label>
                    <input
                        type="number"
                        className="input w-full"
                        value={tcpPort}
                        onChange={({ target }) => {
                            const numVal = Number(target.value);
                            if (numVal < 0 || numVal > 65535) {
                                sendUserAlert('Port must be between 0 and 65535', true);
                                return;
                            }
                            setTcpPort(target.value);
                        }}
                    />
                </div>
            )}

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
        </fieldset>
    );
};

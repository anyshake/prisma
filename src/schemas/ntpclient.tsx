import { mdiMinus, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { ISchema } from '../config/schema';
import { sendUserAlert } from '../helpers/alert/sendUserAlert';

const defaultConfig = {
    pool: [''],
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

    const [ntpAddrs, setNtpAddrs] = useState([
        { address: 'ntp-a2.nict.go.jp', port: '123' },
        { address: 'ntp-a3.nict.go.jp', port: '123' },
        { address: 'ntp-b2.nict.go.jp', port: '123' },
        { address: 'ntp-b3.nict.go.jp', port: '123' },
        { address: 'ntp-k1.nict.jp', port: '123' },
        { address: 'ptbtime1.ptb.de', port: '123' },
        { address: 'ptbtime2.ptb.de', port: '123' },
        { address: 'ptbtime3.ptb.de', port: '123' },
        { address: 'stdtime.gov.hk', port: '123' },
        { address: 'time1.chu.nrc.ca', port: '123' },
        { address: 'time2.chu.nrc.ca', port: '123' },
        { address: 'ntp.metas.ch', port: '123' },
        { address: 'hora.roa.es', port: '123' },
        { address: 'minuto.roa.es', port: '123' }
    ]);

    const handleUpdateNtpAddr = (index: number, value: string) => {
        if (ntpAddrs.filter((item) => item.address.length > 0).length === 1 && value.length === 0) {
            sendUserAlert('At least one NTP server is required', true);
            return;
        }
        setNtpAddrs((prev) =>
            prev.map((item, i) => (i === index ? { ...item, address: value } : item))
        );
    };

    const handleUpdateNtpPort = (index: number, value: number) => {
        if (value < 0 || value > 65535) {
            sendUserAlert('Port must be between 0 and 65535', true);
            return;
        }
        setNtpAddrs((prev) => {
            const newNtpAddrs = [...prev];
            newNtpAddrs[index] = { ...newNtpAddrs[index], port: String(value) };
            return newNtpAddrs;
        });
    };

    const handleAddNtpItem = () => {
        setNtpAddrs([...ntpAddrs, { address: '', port: '123' }]);
    };

    const handleRemoveNtpItem = (index: number) => {
        if (ntpAddrs.length > 1) {
            setNtpAddrs(ntpAddrs.filter((_, i) => i !== index));
        } else {
            sendUserAlert('At least one NTP server is required', true);
        }
    };

    const updatePool = useCallback(() => {
        return ntpAddrs
            .filter((addr) => addr.address.length > 0)
            .map((addr) => {
                const url = new URL('ntp://');
                url.hostname = addr.address;
                url.port = addr.port;
                return url.toString();
            });
    }, [ntpAddrs]);

    useEffect(() => {
        const newPool = updatePool();
        setCurrentConfig((prev) => ({ ...prev, pool: newPool }));
    }, [updatePool]);

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
                {ntpAddrs.map((addr, index) => (
                    <div className="flex items-center justify-center space-x-2" key={index}>
                        <div className="w-1/2 space-y-2 lg:w-4/6">
                            <label className="label">Host {index + 1}</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={addr.address}
                                placeholder='e.g. "ntp-a2.nict.go.jp"'
                                onChange={({ target }) => handleUpdateNtpAddr(index, target.value)}
                            />
                        </div>
                        <div className="w-1/2 space-y-2 lg:w-2/6">
                            <label className="label">Port</label>
                            <input
                                type="number"
                                className="input w-full"
                                value={addr.port}
                                onChange={({ target }) =>
                                    handleUpdateNtpPort(index, Number(target.value))
                                }
                            />
                        </div>
                        <button
                            className="btn btn-circle btn-sm mt-6 bg-red-400 hover:bg-red-500"
                            onClick={() => handleRemoveNtpItem(index)}
                        >
                            <Icon className="text-white" path={mdiMinus} size={0.8} />
                        </button>
                    </div>
                ))}
                <button
                    className="btn btn-circle btn-sm bg-purple-500 hover:bg-purple-600"
                    onClick={handleAddNtpItem}
                >
                    <Icon className="text-white" path={mdiPlus} size={0.8} />
                </button>
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

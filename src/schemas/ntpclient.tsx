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

const defaultNtpGroup = [
    {
        tag: 'university-provider',
        servers: [
            { address: 'time.mit.edu', port: '123' },
            { address: 'ntp1.lsu.edu', port: '123' },
            { address: 'ntp2.lsu.edu', port: '123' },
            { address: 'ntp3.lsu.edu', port: '123' },
            { address: 'ntp1.tamu.edu', port: '123' },
            { address: 'ntp2.tamu.edu', port: '123' },
            { address: 'ntp3.tamu.edu', port: '123' },
            { address: 'ntp1.cs.princeton.edu', port: '123' },
            { address: 'ntp2.cs.princeton.edu', port: '123' },
            { address: 'ntppub.tamu.edu', port: '123' },
            { address: 'ntp.illinois.edu', port: '123' },
            { address: 'ntp1.tohoku.ac.jp', port: '123' },
            { address: 'ntp2.tohoku.ac.jp', port: '123' },
            { address: 'ntp1.noc.titech.ac.jp', port: '123' },
            { address: 'gpsntp.miz.nao.ac.jp', port: '123' },
            { address: 'ntp.nc.u-tokyo.ac.jp', port: '123' },
            { address: 'clock.cit.nihon-u.ac.jp', port: '123' },
            { address: 'ntp.osakafu-u.ac.jp', port: '123' },
            { address: 'ntp.kuins.kyoto-u.ac.jp', port: '123' },
            { address: 'ntp.tut.ac.jp', port: '123' },
            { address: 'ntp.netlab.is.tsukuba.ac.jp', port: '123' },
            { address: 'ntp.nagaokaut.ac.jp', port: '123' },
            { address: 'ntp.hiroshima-u.ac.jp', port: '123' },
            { address: 'ntp.kj.yamagata-u.ac.jp', port: '123' },
            { address: 'ntp0.cam.ac.uk', port: '123' },
            { address: 'ntp1.cam.ac.uk', port: '123' },
            { address: 'ntp2.cam.ac.uk', port: '123' },
            { address: 'ntp3.cam.ac.uk', port: '123' },
            { address: 'ntp1.uni-ulm.de', port: '123' },
            { address: 'ntp2.uni-ulm.de', port: '123' },
            { address: 'ntp3.uni-ulm.de', port: '123' },
            { address: 'ntp.ntu.edu.tw', port: '123' },
            { address: 'ntp2.ntu.edu.tw', port: '123' },
            { address: 'time.upd.edu.ph:123', port: '123' }
        ]
    },
    {
        tag: 'authority-provider',
        servers: [
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
        ]
    },
    {
        tag: 'apple-inc',
        servers: [
            { address: 'krseo1-ntp-002.aaplimg.com', port: '123' },
            { address: 'dkblp1-ntp-001.aaplimg.com', port: '123' },
            { address: 'dkblp1-ntp-002.aaplimg.com', port: '123' },
            { address: 'frcch1-ntp-001.aaplimg.com', port: '123' },
            { address: 'frcch1-ntp-002.aaplimg.com', port: '123' },
            { address: 'krsel6-ntp-001.aaplimg.com', port: '123' },
            { address: 'krsel6-ntp-002.aaplimg.com', port: '123' },
            { address: 'nlams2-ntp-001.aaplimg.com', port: '123' },
            { address: 'nlams2-ntp-002.aaplimg.com', port: '123' },
            { address: 'twtpe2-ntp-001.aaplimg.com', port: '123' },
            { address: 'twtpe2-ntp-002.aaplimg.com', port: '123' },
            { address: 'usmes1-ntp-002.aaplimg.com', port: '123' },
            { address: 'ntp.euro.apple.com', port: '123' },
            { address: 'uklon5-ntp-001.aaplimg.com', port: '123' },
            { address: 'zaisd1-ntp-001.aaplimg.com', port: '123' },
            { address: 'zaisd1-ntp-002.aaplimg.com', port: '123' },
            { address: 'jptyo5-ntp-001.aaplimg.com', port: '123' },
            { address: 'jptyo5-ntp-004.aaplimg.com', port: '123' },
            { address: 'defra1-ntp-001.aaplimg.com', port: '123' },
            { address: 'sesto4-ntp-002.aaplimg.com', port: '123' },
            { address: 'sesto4-ntp-001.aaplimg.com', port: '123' },
            { address: 'defra1-ntp-004.aaplimg.com', port: '123' },
            { address: 'usatl4-ntp-001.aaplimg.com', port: '123' },
            { address: 'usatl4-ntp-002.aaplimg.com', port: '123' },
            { address: 'uschi5-ntp-002.aaplimg.com', port: '123' },
            { address: 'uschi5-ntp-003.aaplimg.com', port: '123' },
            { address: 'usscz2-ntp-002.aaplimg.com', port: '123' },
            { address: 'ussjc2-ntp-002.aaplimg.com', port: '123' },
            { address: 'usscz2-ntp-001.aaplimg.com', port: '123' },
            { address: 'ussjc2-ntp-001.aaplimg.com', port: '123' },
            { address: 'jptyo5-ntp-003.aaplimg.com', port: '123' },
            { address: 'jptyo5-ntp-002.aaplimg.com', port: '123' },
            { address: 'hkhkg1-ntp-002.aaplimg.com', port: '123' },
            { address: 'hkhkg1-ntp-001.aaplimg.com', port: '123' },
            { address: 'hkhkg1-ntp-003.aaplimg.com', port: '123' },
            { address: 'defra1-ntp-003.aaplimg.com', port: '123' },
            { address: 'defra1-ntp-002.aaplimg.com', port: '123' },
            { address: 'uklon5-ntp-004.aaplimg.com', port: '123' },
            { address: 'usmes1-ntp-001.aaplimg.com', port: '123' },
            { address: 'usmia1-ntp-001.aaplimg.com', port: '123' },
            { address: 'usmia1-ntp-002.aaplimg.com', port: '123' },
            { address: 'usnyc3-ntp-003.aaplimg.com', port: '123' },
            { address: 'usnyc3-ntp-001.aaplimg.com', port: '123' },
            { address: 'usnyc3-ntp-004.aaplimg.com', port: '123' },
            { address: 'usnyc3-ntp-002.aaplimg.com', port: '123' },
            { address: 'brsao4-ntp-001.aaplimg.com', port: '123' },
            { address: 'brsao4-ntp-002.aaplimg.com', port: '123' },
            { address: 'usqas2-ntp-001.aaplimg.com', port: '123' },
            { address: 'usqas2-ntp-002.aaplimg.com', port: '123' },
            { address: 'uschi5-ntp-001.aaplimg.com', port: '123' },
            { address: 'ussea4-ntp-001.aaplimg.com', port: '123' },
            { address: 'ussea4-ntp-002.aaplimg.com', port: '123' },
            { address: 'uklon5-ntp-003.aaplimg.com', port: '123' },
            { address: 'uklon5-ntp-002.aaplimg.com', port: '123' },
            { address: 'ausyd2-ntp-001.aaplimg.com', port: '123' },
            { address: 'ausyd2-ntp-002.aaplimg.com', port: '123' },
            { address: 'sgsin3-ntp-001.aaplimg.com', port: '123' },
            { address: 'sgsin3-ntp-002.aaplimg.com', port: '123' },
            { address: 'hkhkg1-ntp-004.aaplimg.com', port: '123' }
        ]
    },
    {
        tag: 'google-inc',
        servers: [
            { address: 'time1.google.com', port: '123' },
            { address: 'time2.google.com', port: '123' },
            { address: 'time3.google.com', port: '123' },
            { address: 'time4.google.com', port: '123' }
        ]
    }
];

export const NtpClient = ({ onCreate, onUpdate }: ISchema) => {
    const initialized = useRef(false);
    const [currentConfig, setCurrentConfig] = useState({ ...defaultConfig });
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            onCreate(currentConfig);
        }
    }, [currentConfig, onCreate]);

    const [ntpAddrs, setNtpAddrs] = useState([...defaultNtpGroup[0].servers]);

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
        if (ntpAddrs[index].address.length === 0) {
            setNtpAddrs(ntpAddrs.filter((_, i) => i !== index));
            return;
        }
        if (ntpAddrs.filter((i) => i.address.length > 0).length === 1) {
            sendUserAlert('At least one NTP server is required', true);
            return;
        }
        setNtpAddrs(ntpAddrs.filter((_, i) => i !== index));
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
                <div className="flex flex-wrap items-center gap-2">
                    {defaultNtpGroup.map(({ servers, tag }, index) => (
                        <button
                            className="btn btn-sm text-gray-700"
                            onClick={() => {
                                setNtpAddrs(servers);
                            }}
                            key={index}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
                {ntpAddrs.map(({ address, port }, index) => (
                    <div className="flex items-center justify-center space-x-2" key={index}>
                        <div className="w-1/2 space-y-2 lg:w-4/6">
                            <label className="label">Host {index + 1}</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={address}
                                placeholder='e.g. "ntp-a2.nict.go.jp"'
                                onChange={({ target }) => handleUpdateNtpAddr(index, target.value)}
                            />
                        </div>
                        <div className="w-1/2 space-y-2 lg:w-2/6">
                            <label className="label">Port</label>
                            <input
                                type="number"
                                className="input w-full"
                                value={port}
                                onChange={({ target }) =>
                                    handleUpdateNtpPort(index, Number(target.value))
                                }
                            />
                        </div>
                        <button
                            className="btn btn-circle btn-xs mt-6.5 bg-red-400 hover:bg-red-500"
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

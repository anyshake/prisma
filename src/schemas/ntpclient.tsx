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
        notice: '',
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
            { address: 'time.upd.edu.ph', port: '123' }
        ]
    },
    {
        tag: 'authority-provider',
        notice: '',
        servers: [
            { address: 'ntp.nict.jp', port: '123' },
            { address: 'time.nist.gov', port: '123' },
            { address: 'time.stdtime.gov.tw', port: '123' },
            { address: 'ptbtime1.ptb.de', port: '123' },
            { address: 'ptbtime2.ptb.de', port: '123' },
            { address: 'ptbtime3.ptb.de', port: '123' },
            { address: 'stdtime.gov.hk', port: '123' },
            { address: 'time1.chu.nrc.ca', port: '123' },
            { address: 'time2.chu.nrc.ca', port: '123' },
            { address: 'hora.roa.es', port: '123' },
            { address: 'minuto.roa.es', port: '123' }
        ]
    },
    {
        tag: 'commercial-provider',
        notice:
            'Cloudflare and Microsoft do not use leap smear. ' +
            'The leap-second policy for Apple is unconfirmed.',
        servers: [
            { address: 'time.apple.com', port: '123' },
            { address: 'time.cloudflare.com', port: '123' },
            { address: 'time.windows.com', port: '123' }
        ]
    },
    {
        tag: 'google-inc (leap smear)',
        notice:
            'Google Public NTP uses a 24-hour linear leap smear and may differ from UTC ' +
            'by up to 0.5 seconds. Do not mix it with non-smearing NTP servers or servers ' +
            'using a different smear policy, including Facebook Public NTP.',
        servers: [
            { address: 'time1.google.com', port: '123' },
            { address: 'time2.google.com', port: '123' },
            { address: 'time3.google.com', port: '123' },
            { address: 'time4.google.com', port: '123' }
        ]
    },
    {
        tag: 'facebook-inc (leap smear)',
        notice:
            'Facebook Public NTP uses leap smear with a different schedule from Google. ' +
            'Do not mix it with non-smearing NTP servers or servers using a different ' +
            'smear policy, including Google Public NTP.',
        servers: [
            { address: 'time1.facebook.com', port: '123' },
            { address: 'time2.facebook.com', port: '123' },
            { address: 'time3.facebook.com', port: '123' },
            { address: 'time4.facebook.com', port: '123' },
            { address: 'time5.facebook.com', port: '123' }
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
    const [ntpNotice, setNtpNotice] = useState(defaultNtpGroup[0].notice);

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
                    {defaultNtpGroup.map(({ servers, tag, notice }, index) => (
                        <button
                            className="btn btn-sm text-gray-700"
                            onClick={() => {
                                setNtpAddrs(servers);
                                setNtpNotice(notice);
                            }}
                            key={index}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
                {ntpNotice.length > 0 && <p className="text-warning text-sm">{ntpNotice}</p>}
                {ntpAddrs.map(({ address, port }, index) => (
                    <div className="flex items-center justify-center space-x-2" key={index}>
                        <div className="w-1/2 space-y-2 lg:w-4/6">
                            <label className="label">Host {index + 1}</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={address}
                                placeholder='e.g. "ntp.nict.jp"'
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

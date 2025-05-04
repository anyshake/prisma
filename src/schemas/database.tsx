import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { ISchema } from '../config/schema';
import { sendUserAlert } from '../helpers/alert/sendUserAlert';

const defaultConfig = {
    endpoint: 'sqlite://',
    username: '',
    password: '',
    database: '',
    prefix: 'as_',
    timeout: 5
};

export const Database = ({ onCreate, onUpdate }: ISchema) => {
    const initialized = useRef(false);
    const [currentConfig, setCurrentConfig] = useState({ ...defaultConfig });
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            onCreate(currentConfig);
        }
    }, [currentConfig, onCreate]);

    const [databaseEngine, setDatabaseEngine] = useState('sqlite');
    const [databaseHost, setDatabaseHost] = useState('');
    const [databasePort, setDatabasePort] = useState('');

    const updateEndpoint = useCallback(() => {
        const url = new URL(`${databaseEngine}://`);
        if (databaseEngine === 'sqlite') {
            return url.toString();
        }
        url.hostname = databaseHost;
        url.port = databasePort;
        return url.toString();
    }, [databaseEngine, databaseHost, databasePort]);

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
                <label className="label">Database Engine</label>
                <select
                    className="select w-full"
                    defaultValue={databaseEngine}
                    onChange={({ target }) => setDatabaseEngine(target.value)}
                >
                    <option disabled>Select your database engine</option>
                    <option value="sqlite">SQLite</option>
                    <option value="mysql">MySQL (MariaDB)</option>
                    <option value="postgres">PostgreSQL</option>
                    <option value="mssql">Microsoft SQL Server</option>
                </select>
            </div>

            {databaseEngine !== 'sqlite' && (
                <div className="flex flex-col space-y-2">
                    <label className="label">Database Host</label>
                    <input
                        type="text"
                        className="input w-full"
                        onChange={({ target }) => setDatabaseHost(target.value)}
                    />
                </div>
            )}

            {databaseEngine !== 'sqlite' && (
                <div className="flex flex-col space-y-2">
                    <label className="label">Database Port</label>
                    <input
                        type="number"
                        className="input w-full"
                        value={databasePort}
                        onChange={({ target }) => {
                            const numVal = Number(target.value);
                            if (numVal < 0 || numVal > 65535) {
                                sendUserAlert('Port must be between 0 and 65535', true);
                                return;
                            }
                            setDatabasePort(target.value);
                        }}
                    />
                </div>
            )}

            {databaseEngine !== 'sqlite' && (
                <div className="flex flex-col space-y-2">
                    <label className="label">Username</label>
                    <input
                        type="text"
                        className="input w-full"
                        name="username"
                        onChange={handleConfigUpdate}
                    />
                </div>
            )}

            {databaseEngine !== 'sqlite' && (
                <div className="flex flex-col space-y-2">
                    <label className="label">Password</label>
                    <input
                        type="text"
                        className="input w-full"
                        name="password"
                        onChange={handleConfigUpdate}
                    />
                </div>
            )}

            <div className="flex flex-col space-y-2">
                <label className="label">
                    {databaseEngine === 'sqlite' ? 'Database Path' : 'Database Name'}
                </label>
                <input
                    type="text"
                    className="input w-full"
                    name="database"
                    onChange={handleConfigUpdate}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="label">Table Prefix</label>
                <input
                    type="text"
                    className="input w-full"
                    name="prefix"
                    onChange={(e) => {
                        if (e.target.value.length === 0) {
                            sendUserAlert('Table prefix cannot be empty', true);
                            return;
                        }
                        if (!e.target.value.endsWith('_')) {
                            sendUserAlert('Table prefix must end with an underscore', true);
                            return;
                        }
                        handleConfigUpdate(e);
                    }}
                    value={currentConfig.prefix}
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
        </fieldset>
    );
};

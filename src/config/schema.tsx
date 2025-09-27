import {
    mdiChip,
    mdiClockTimeEight,
    mdiDatabase,
    mdiFileClock,
    mdiMapMarker,
    mdiServer
} from '@mdi/js';
import { JSXElementConstructor } from 'react';

import { Database } from '../schemas/database';
import { Hardware } from '../schemas/hardware';
import { Location } from '../schemas/location';
import { Logger } from '../schemas/logger';
import { NtpClient } from '../schemas/ntpclient';
import { Server } from '../schemas/server';

export interface ISchema {
    readonly onUpdate: (obj: object) => void;
    readonly onCreate: (obj: object) => void;
}

interface ISchemaConfig {
    readonly fileName: string;
    readonly language: string;
    readonly compatibility: string;
    readonly schema: Record<
        string,
        {
            readonly icon: string;
            readonly title: string;
            readonly description: string;
            readonly element: JSXElementConstructor<ISchema>;
        }
    >;
}

export const schemaConfig: ISchemaConfig = {
    fileName: 'config.json',
    language: 'json',
    compatibility: 'v4.2.0+',
    schema: {
        location: {
            icon: mdiMapMarker,
            element: Location,
            title: 'Location',
            description:
                'The geographic coordinates of the AnyShake Explorer device. This setting serves as a fallback when GNSS location is unavailable.'
        },
        hardware: {
            icon: mdiChip,
            element: Hardware,
            title: 'Hardware',
            description:
                'Defines the hardware settings, such as sensor interfaces, data protocol, and device-specific options.'
        },
        database: {
            icon: mdiDatabase,
            element: Database,
            title: 'Database',
            description:
                'Parameters for database connectivity, including type, address, and credentials.'
        },
        ntpclient: {
            icon: mdiClockTimeEight,
            element: NtpClient,
            title: 'NTP Client',
            description:
                'Configuration for the NTP client, which is used as a secondary time source when GNSS time data is not available.'
        },
        server: {
            icon: mdiServer,
            element: Server,
            title: 'Server',
            description:
                'Settings related to the built-in web server, including host, port, and debug mode.'
        },
        logger: {
            icon: mdiFileClock,
            element: Logger,
            title: 'Logger',
            description:
                'Specifies how logs are recorded, including log level, output format, and file path.'
        }
    }
};

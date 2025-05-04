import logo from '/anyshake.svg';

import { getVersionTag } from '../helpers/app/getVersionTag';

export const globalConfig = {
    logo,
    update: 10 * 60 * 1000,
    version: getVersionTag(),
    name: 'AnyShake Prisma',
    copyright: 'SensePlex Limited',
    footer: 'Listen to the whispering earth.',
    repository: 'https://github.com/anyshake/prisma',
    title: 'AnyShake Prisma - Online configuration tool for AnyShake Observer'
};

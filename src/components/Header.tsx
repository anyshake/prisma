import { mdiGithub } from '@mdi/js';
import Icon from '@mdi/react';

interface IHeader {
    readonly title: string;
    readonly logo: string;
    readonly repository: string;
}

export const Header = ({ title, logo, repository }: IHeader) => {
    return (
        <div className="flex h-14 items-center justify-between bg-gray-900 px-6 text-white">
            <img
                className="hidden size-14 transition-all duration-500 hover:scale-110 sm:flex"
                src={logo}
                alt="Logo"
            />

            <div className="absolute left-1/2 hidden -translate-x-1/2 transform text-xl font-semibold select-none sm:block">
                {title}
            </div>
            <div className="text-xl font-semibold select-none sm:hidden">{title}</div>

            <a
                href={repository}
                target="_blank"
                className="text-sm transition-all hover:underline hover:opacity-80"
            >
                <Icon path={mdiGithub} size={1} />
            </a>
        </div>
    );
};

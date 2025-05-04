import { useState } from 'react';

interface IFooter {
    readonly copyright: string;
    readonly text: string;
}

export const Footer = ({ text, copyright }: IFooter) => {
    const [currentYear] = useState(new Date().getFullYear());

    return (
        <footer className="bg-base-300 flex w-full flex-col justify-between px-8 py-2 text-gray-500 sm:flex-row">
            <span className="self-center text-center text-xs italic">{text}</span>
            <div className="flex items-center justify-center text-center">
                {`© ${currentYear} ${copyright}`}
            </div>
        </footer>
    );
};

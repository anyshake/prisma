import Icon from '@mdi/react';
import { useCallback, useState } from 'react';

import { CodeBlock } from './components/CodeBlock';
import { schemaConfig } from './config/schema';

export const Wizard = () => {
    const [currentConfig, setCurrentConfig] = useState({});
    const handleSchemaChanged = useCallback((key: string, obj: object) => {
        setCurrentConfig((prev) => ({ ...prev, [key]: obj }));
    }, []);

    return (
        <div className="mx-auto flex max-w-[1200px] flex-col md:flex-row">
            <div className="animate-fade animate-delay-500 mt-2 flex flex-1 flex-col space-y-4 p-2 md:w-1/2">
                {Object.entries(schemaConfig.schema).map(
                    ([key, { title, description, icon, element: Element }]) => {
                        return (
                            <div
                                key={key}
                                className="card card-border bg-base-100 w-full shadow-lg"
                            >
                                <div className="card-body">
                                    <h2 className="card-title">
                                        <Icon path={icon} size={1} />
                                        <span>{title}</span>
                                    </h2>
                                    <p>{description}</p>
                                    <div className="mt-4">
                                        <Element
                                            onUpdate={(obj) => handleSchemaChanged(key, obj)}
                                            onCreate={(obj) => handleSchemaChanged(key, obj)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    }
                )}
            </div>

            <div className="animate-fade-down animate-delay-500 p-4 md:w-1/2">
                <div className="sticky top-4 overflow-y-auto rounded-lg md:h-[calc(100vh-2rem)]">
                    <CodeBlock
                        language={schemaConfig.language}
                        fileName={schemaConfig.fileName}
                        badge={schemaConfig.compatibility}
                    >
                        {JSON.stringify(currentConfig, null, 4)}
                    </CodeBlock>
                </div>
            </div>
        </div>
    );
};

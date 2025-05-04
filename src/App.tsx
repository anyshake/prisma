import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Scroller } from './components/Scroller';
import { globalConfig } from './config/global';
import { sendUserConfirm } from './helpers/alert/sendUserConfirm';
import { hideLoaderAnimation } from './helpers/app/hideLoaderAnimation';
import { Wizard } from './Wizard';

const App = () => {
    useEffect(() => {
        document.title = globalConfig.title;
        hideLoaderAnimation();
    }, []);

    const {
        needRefresh: [needRefreshApp, setNeedRefreshApp],
        updateServiceWorker
    } = useRegisterSW({
        onRegistered(r) {
            if (r) {
                setInterval(() => {
                    r.update();
                }, globalConfig.update);
            }
        }
    });
    useEffect(() => {
        if (needRefreshApp) {
            sendUserConfirm('Update available, do you want to update?', {
                title: 'Update Available',
                cancelBtnText: 'Cancel',
                confirmBtnText: 'OK',
                onConfirmed: () => updateServiceWorker(),
                onCancelled: () => setNeedRefreshApp(false)
            });
        }
    }, [needRefreshApp, setNeedRefreshApp, updateServiceWorker]);

    return (
        <div className="animate-fade animate-duration-500 animate-delay-300">
            <div className="min-h-screen w-full justify-between">
                <div className="min-h-screen">
                    <Header
                        title={globalConfig.name}
                        logo={globalConfig.logo}
                        repository={globalConfig.repository}
                    />

                    <div className="mt-2 mb-4">
                        <Wizard />
                    </div>
                </div>

                <Footer text={globalConfig.footer} copyright={globalConfig.copyright} />
            </div>

            <Toaster />
            <Scroller threshold={100} />
        </div>
    );
};

export default App;

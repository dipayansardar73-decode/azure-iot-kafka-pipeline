import React from 'react';
import {
    makeStyles,
    shorthands,
    tokens,
    TabList,
    Tab,
    Title3
} from '@fluentui/react-components';
import {
    HomeRegular,
    DeviceMeetingRoomRegular,
    SettingsRegular,
    HomeFilled,
    DeviceMeetingRoomFilled,
    SettingsFilled,
    DataUsageRegular,
    DataUsageFilled
} from '@fluentui/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        height: '100vh',
        backgroundColor: tokens.colorNeutralBackground1,
    },
    sidebar: {
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRight('1px', 'solid', tokens.colorNeutralStroke1),
        ...shorthands.padding('20px', '10px'),
    },
    content: {
        flexGrow: 1,
        overflowY: 'auto',
        ...shorthands.padding('24px'),
    },
    appTitle: {
        marginBottom: '24px',
        paddingLeft: '10px',
        color: tokens.colorBrandForeground1,
    }
});

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const styles = useStyles();
    const navigate = useNavigate();
    const location = useLocation();

    const path = location.pathname;
    let selectedValue = 'overview';
    if (path.includes('devices')) selectedValue = 'devices';
    if (path.includes('analytics')) selectedValue = 'analytics';
    if (path.includes('settings')) selectedValue = 'settings';

    return (
        <div className={styles.root}>
            <div className={styles.sidebar}>
                <Title3 className={styles.appTitle}>IoT Admin</Title3>
                <TabList
                    selectedValue={selectedValue}
                    onTabSelect={(_, data) => {
                        if (data.value === 'overview') navigate('/');
                        else navigate(`/${data.value}`);
                    }}
                    vertical
                    size="large"
                >
                    <Tab
                        value="overview"
                        icon={selectedValue === 'overview' ? <HomeFilled /> : <HomeRegular />}
                    >
                        Overview
                    </Tab>
                    <Tab
                        value="devices"
                        icon={selectedValue === 'devices' ? <DeviceMeetingRoomFilled /> : <DeviceMeetingRoomRegular />}
                    >
                        Devices
                    </Tab>
                    <Tab
                        value="analytics"
                        icon={selectedValue === 'analytics' ? <DataUsageFilled /> : <DataUsageRegular />}
                    >
                        Analytics
                    </Tab>
                    <Tab
                        value="settings"
                        icon={selectedValue === 'settings' ? <SettingsFilled /> : <SettingsRegular />}
                    >
                        Settings
                    </Tab>
                </TabList>
            </div>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
};

export default Layout;

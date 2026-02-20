import React from 'react';
import {
    Title1,
    Card,
    CardHeader,
    Text,
    Switch,
    Input,
    Button,
    makeStyles
} from '@fluentui/react-components';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #eee'
    }
});

const Settings: React.FC = () => {
    const styles = useStyles();

    return (
        <div className={styles.root}>
            <Title1>System Settings</Title1>

            <Card>
                <CardHeader header={<Text weight="semibold">General Configuration</Text>} />
                <div className={styles.section}>
                    <div className={styles.row}>
                        <Text>Dark Mode</Text>
                        <Switch />
                    </div>
                    <div className={styles.row}>
                        <Text>Auto-refresh Interval (s)</Text>
                        <Input type="number" defaultValue="5" style={{ width: '80px' }} />
                    </div>
                    <div className={styles.row}>
                        <Text>Notifications</Text>
                        <Switch defaultChecked />
                    </div>
                </div>
            </Card>

            <Card>
                <CardHeader header={<Text weight="semibold">Kafka Connection</Text>} />
                <div className={styles.section}>
                    <div className={styles.row}>
                        <Text>Broker URL</Text>
                        <Input defaultValue="localhost:9092" readOnly />
                    </div>
                    <div className={styles.row}>
                        <Text>Consumer Group</Text>
                        <Input defaultValue="iot-dashboard-group" readOnly />
                    </div>
                </div>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button appearance="secondary">Reset Defaults</Button>
                <Button appearance="primary">Save Changes</Button>
            </div>
        </div>
    );
};

export default Settings;

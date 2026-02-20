import React from 'react';
import {
    makeStyles,
    shorthands,
    tokens,
    Card,
    CardHeader,
    Text,
    LargeTitle,
    Subtitle2
} from '@fluentui/react-components';
import {
    PulseRegular,
    AlertRegular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
    },
    card: {
        ...shorthands.padding('16px'),
        height: '140px',
    },
    cardValue: {
        marginTop: '12px',
        fontSize: '32px',
        fontWeight: '600',
        color: tokens.colorNeutralForeground1,
    },
    cardIcon: {
        fontSize: '24px',
        color: tokens.colorBrandForeground1
    }
});

const Overview: React.FC = () => {
    const styles = useStyles();

    return (
        <div className={styles.root}>
            <LargeTitle>Dashboard</LargeTitle>
            <Subtitle2>Real-time telemetry overview</Subtitle2>

            <div className={styles.cardGrid}>
                <Card className={styles.card}>
                    <CardHeader
                        header={<Text weight="semibold">Active Devices</Text>}
                        description={<Text size={200}>Online now</Text>}
                        action={<PulseRegular className={styles.cardIcon} />}
                    />
                    <div className={styles.cardValue}>48,291</div>
                </Card>

                <Card className={styles.card}>
                    <CardHeader
                        header={<Text weight="semibold">Messages / Sec</Text>}
                        description={<Text size={200}>Kafka throughput</Text>}
                    />
                    <div className={styles.cardValue}>192,400</div>
                </Card>

                <Card className={styles.card}>
                    <CardHeader
                        header={<Text weight="semibold">Active Alerts</Text>}
                        action={<AlertRegular style={{ color: tokens.colorPaletteRedForeground1 }} className={styles.cardIcon} />}
                    />
                    <div className={styles.cardValue} style={{ color: tokens.colorPaletteRedForeground1 }}>23</div>
                </Card>

                <Card className={styles.card}>
                    <CardHeader
                        header={<Text weight="semibold">Avg Latency</Text>}
                    />
                    <div className={styles.cardValue}>12ms</div>
                </Card>
            </div>

            {/* Placeholder for Charts */}
            <Card>
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Real-time Charts Loading...</Text>
                </div>
            </Card>
        </div>
    );
};

export default Overview;

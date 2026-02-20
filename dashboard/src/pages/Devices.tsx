import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    Table,
    TableHeader,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    TableCellLayout,
    Avatar,
    Badge,
    Title1,
    Button
} from '@fluentui/react-components';
import { AddRegular, ArrowClockwiseRegular } from '@fluentui/react-icons';
import { fetchDevices, Device } from '../services/api';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tableContainer: {
        overflowX: 'auto',
    },
});

const Devices: React.FC = () => {
    const styles = useStyles();
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    const loadDevices = async () => {
        setLoading(true);
        const data = await fetchDevices(0, 50); // initial fetch
        setDevices(data);
        setLoading(false);
    };

    useEffect(() => {
        loadDevices();
    }, []);

    const getStatusColor = (status: string | undefined) => {
        if (status === 'ON') return 'success';
        if (status === 'OFF') return 'important'; // 'important' is usually dark/neutral in Fluent 2
        return 'warning';
    };

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Title1>Device Management</Title1>
                <div>
                    <Button icon={<ArrowClockwiseRegular />} onClick={loadDevices} appearance="subtle">Refresh</Button>
                    <Button icon={<AddRegular />} appearance="primary">Add Device</Button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Device</TableHeaderCell>
                            <TableHeaderCell>Type</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell>Power (W)</TableHeaderCell>
                            <TableHeaderCell>Temperature</TableHeaderCell>
                            <TableHeaderCell>Last Seen</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {devices.map((device) => (
                            <TableRow key={device.deviceId}>
                                <TableCell>
                                    <TableCellLayout
                                        media={<Avatar name={device.deviceId} />}
                                    >
                                        {device.deviceId}
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell>{device.deviceType}</TableCell>
                                <TableCell>
                                    <Badge
                                        appearance="filled"
                                        color={getStatusColor(device.metrics.status || device.metrics.compressor)}
                                    >
                                        {device.metrics.status || device.metrics.compressor || 'Unknown'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{device.metrics.power?.toFixed(1) || '-'}</TableCell>
                                <TableCell>{device.metrics.temperature?.toFixed(1) || '-'}</TableCell>
                                <TableCell>{new Date(device.timestamp).toLocaleTimeString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {devices.length === 0 && !loading && (
                    <div style={{ padding: '20px', textAlign: 'center' }}>No active devices found. Ensure Simulator is running.</div>
                )}
            </div>
        </div>
    );
};

export default Devices;

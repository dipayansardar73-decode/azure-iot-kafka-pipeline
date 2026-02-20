import React from 'react';
import { Title1, Subtitle1, Card, CardHeader, Text } from '@fluentui/react-components';

const Analytics: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Title1>Analytics & Insights</Title1>
            <Subtitle1>Historical trends and anomaly detection</Subtitle1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Card>
                    <CardHeader header={<Text weight="semibold">Power Consumption Trend</Text>} />
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                        [Line Chart Placeholder]
                    </div>
                </Card>
                <Card>
                    <CardHeader header={<Text weight="semibold">Device Distribution</Text>} />
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                        [Pie Chart Placeholder]
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;

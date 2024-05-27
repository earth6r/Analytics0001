interface ProgressChartProps {
    data: any[];
    maxValue: number;
}

// usage:
// data={[
//     { 'January': 50 },
//     { 'February': 100 },
//     { 'March': 150 },
//     { 'April': 200 },
// ]}


const ProgressChart = (props: ProgressChartProps) => {
    const { data, maxValue } = props;

    return (
        <div className='space-y-3 pl-4 pr-4'>
            {(data)
                .map((item, index) => (
                    <div key={index} className="relative flex items-center justify-between px-4 py-2 rounded-lg" style={{ backgroundColor: 'transparent' }}>
                        <div className="absolute left-0 top-0 h-full bg-secondary rounded-lg" style={{ width: `${(Object.values(item)[0] / maxValue) * 100}%` }}></div>
                        <span className="relative text-muted-foreground">{Object.keys(item)[0]}</span>
                        <span className="relative text-muted-foreground">{Object.values(item)[0]}</span>
                    </div>
                ))}
        </div>
    );
};

export default ProgressChart;

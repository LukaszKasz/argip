import { useTranslation } from 'react-i18next';

const mockupRows = [
    {
        type1: 'Śruba',
        type: 'Imbusowa',
        norm: 'ISO 4762',
        materialClass: '8.8 / stal węglowa',
        coating: 'Ocynk płatkowy',
        diameter: 'M8',
        length: '40 mm',
        weightPer1000: '12,4 kg',
        onRequest: 'tak',
        coatingService: 'tak',
        nylon: 'nie',
    },
    {
        type1: 'Nakrętka',
        type: 'Sześciokątna',
        norm: 'DIN 934',
        materialClass: '10 / stal',
        coating: 'Ocynk galwaniczny',
        diameter: 'M10',
        length: '-',
        weightPer1000: '7,8 kg',
        onRequest: 'tak',
        coatingService: 'tak',
        nylon: 'tak',
    },
    {
        type1: 'Podkładka',
        type: 'Poszerzana',
        norm: 'DIN 9021',
        materialClass: '200 HV / stal',
        coating: 'Fosforan',
        diameter: '10',
        length: '-',
        weightPer1000: '3,1 kg',
        onRequest: 'nie',
        coatingService: 'tak',
        nylon: 'nie',
    },
    {
        type1: 'Wkręt',
        type: 'Samowiercący',
        norm: 'DIN 7504',
        materialClass: 'A2 / nierdzewna',
        coating: 'Bez powłoki',
        diameter: '4,8',
        length: '19 mm',
        weightPer1000: '5,6 kg',
        onRequest: 'tak',
        coatingService: 'nie',
        nylon: 'nie',
    },
];

const coatingMachineRows = [
    {
        machine: 'Maszyna 1',
        norm: 'ISO 4762',
        material: 'Nierdzewka',
        diameter: '10',
        length: '50',
        efficiency: '4200 szt/h',
        paint: 'Geomet 321',
        completed: 'tak',
    },
    {
        machine: 'Maszyna 2',
        norm: 'DIN 933',
        material: 'Nierdzewka',
        diameter: '10',
        length: '50',
        efficiency: '5000 szt/h',
        paint: 'Delta Protekt',
        completed: 'tak',
    },
    {
        machine: 'Maszyna 3',
        norm: 'DIN 603',
        material: 'Stal węglowa',
        diameter: '8',
        length: '40',
        efficiency: '3800 szt/h',
        paint: 'Ocynk płatkowy',
        completed: 'nie',
    },
    {
        machine: 'Maszyna 2',
        norm: 'DIN 9021',
        material: 'Nierdzewka',
        diameter: '12',
        length: '-',
        efficiency: '6100 szt/h',
        paint: 'Xylan',
        completed: 'tak',
    },
    {
        machine: 'Maszyna 1',
        norm: 'ISO 8752',
        material: 'Mosiądz',
        diameter: '6',
        length: '30',
        efficiency: '2900 szt/h',
        paint: 'Bez farby',
        completed: 'nie',
    },
];

const preapplicationMachineRows = [
    {
        machine: 'Maszyna 3',
        norm: 'ISO 4762',
        material: 'Nierdzewka',
        diameter: '10',
        length: '50',
        efficiency: '',
        power: '',
        completed: '',
    },
];

const machineMasterRows = [
    {
        machine: '1',
        machineName: 'Maszyna 1',
        changeoverTime: '40',
        coatingService: 'tak',
        preapplication: 'nie',
    },
    {
        machine: '2',
        machineName: 'Maszyna 2',
        changeoverTime: '50',
        coatingService: 'tak',
        preapplication: 'nie',
    },
    {
        machine: '3',
        machineName: 'Maszyna 3',
        changeoverTime: '45',
        coatingService: 'nie',
        preapplication: 'tak',
    },
];

const costRows = [
    {
        costType: 'Pracownik',
        perHour: '100',
    },
    {
        costType: 'Prąd',
        perHour: '1000',
    },
    {
        costType: 'Gaz',
        perHour: '100',
    },
];

function MockupTableView() {
    const { t } = useTranslation();

    const columns = [
        { key: 'type1', label: t('mockupTable.type1') },
        { key: 'type', label: t('mockupTable.type') },
        { key: 'norm', label: t('mockupTable.norm') },
        { key: 'materialClass', label: t('mockupTable.materialClass') },
        { key: 'coating', label: t('mockupTable.coating') },
        { key: 'diameter', label: t('mockupTable.diameter') },
        { key: 'length', label: t('mockupTable.length') },
        { key: 'weightPer1000', label: t('mockupTable.weightPer1000') },
        { key: 'onRequest', label: t('mockupTable.onRequest') },
        { key: 'coatingService', label: t('mockupTable.coatingService') },
        { key: 'nylon', label: t('mockupTable.nylon') },
    ];
    const machineColumns = [
        { key: 'machine', label: t('mockupTable.machine') },
        { key: 'norm', label: t('mockupTable.norm') },
        { key: 'material', label: t('mockupTable.material') },
        { key: 'diameter', label: t('mockupTable.diameter') },
        { key: 'length', label: t('mockupTable.length') },
        { key: 'efficiency', label: t('mockupTable.efficiency') },
        { key: 'paint', label: t('mockupTable.paint') },
        { key: 'completed', label: t('mockupTable.completed') },
    ];
    const preapplicationMachineColumns = [
        { key: 'machine', label: t('mockupTable.machine') },
        { key: 'norm', label: t('mockupTable.norm') },
        { key: 'material', label: t('mockupTable.material') },
        { key: 'diameter', label: t('mockupTable.diameter') },
        { key: 'length', label: t('mockupTable.length') },
        { key: 'efficiency', label: t('mockupTable.efficiency') },
        { key: 'power', label: t('mockupTable.power') },
        { key: 'completed', label: t('mockupTable.completed') },
    ];
    const machineMasterColumns = [
        { key: 'machine', label: t('mockupTable.machine') },
        { key: 'machineName', label: t('mockupTable.machineName') },
        { key: 'changeoverTime', label: t('mockupTable.changeoverTime') },
        { key: 'coatingService', label: t('mockupTable.coatingService') },
        { key: 'preapplication', label: t('mockupTable.preapplication') },
    ];
    const costColumns = [
        { key: 'costType', label: t('mockupTable.costType') },
        { key: 'perHour', label: t('mockupTable.perHour') },
    ];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="card">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('mockupTable.title')}</h1>
                    <p className="text-slate-600">{t('mockupTable.subtitle')}</p>
                </div>

                <div className="card overflow-x-auto">
                    <table className="w-full min-w-[1400px]">
                        <thead>
                            <tr className="border-b border-slate-200">
                                {columns.map((column) => (
                                    <th key={column.key} className="text-left py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockupRows.map((row) => (
                                <tr key={`${row.type1}-${row.norm}-${row.diameter}`} className="border-b border-slate-100 hover:bg-slate-50">
                                    {columns.map((column) => (
                                        <td key={column.key} className="py-4 px-4 text-slate-700 whitespace-nowrap">
                                            {row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('mockupTable.machinesTitle')}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    {machineMasterColumns.map((column) => (
                                        <th key={column.key} className="text-left py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {machineMasterRows.map((row) => (
                                    <tr key={`${row.machine}-${row.machineName}`} className="border-b border-slate-100 hover:bg-slate-50">
                                        {machineMasterColumns.map((column) => (
                                            <td key={column.key} className="py-4 px-4 text-slate-700 whitespace-nowrap">
                                                {row[column.key] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('mockupTable.coatingMachinesTitle')}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    {machineColumns.map((column) => (
                                        <th key={column.key} className="text-left py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {coatingMachineRows.map((row) => (
                                    <tr key={`${row.machine}-${row.norm}-${row.diameter}`} className="border-b border-slate-100 hover:bg-slate-50">
                                        {machineColumns.map((column) => (
                                            <td key={column.key} className="py-4 px-4 text-slate-700 whitespace-nowrap">
                                                {row[column.key] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('mockupTable.preapplicationMachinesTitle')}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    {preapplicationMachineColumns.map((column) => (
                                        <th key={column.key} className="text-left py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preapplicationMachineRows.map((row) => (
                                    <tr key={`${row.machine}-${row.norm}-${row.diameter}`} className="border-b border-slate-100 hover:bg-slate-50">
                                        {preapplicationMachineColumns.map((column) => (
                                            <td key={column.key} className="py-4 px-4 text-slate-700 whitespace-nowrap">
                                                {row[column.key] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('mockupTable.costsTitle')}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[400px]">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    {costColumns.map((column) => (
                                        <th key={column.key} className="text-left py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {costRows.map((row) => (
                                    <tr key={row.costType} className="border-b border-slate-100 hover:bg-slate-50">
                                        {costColumns.map((column) => (
                                            <td key={column.key} className="py-4 px-4 text-slate-700 whitespace-nowrap">
                                                {row[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MockupTableView;

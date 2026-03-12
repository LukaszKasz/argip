import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { screwLengthsAPI } from '../api';

function Calculator() {
    const { t } = useTranslation();
    const [screws, setScrews] = useState([]);
    const [selectedScrew, setSelectedScrew] = useState('');
    const [selectedDiameter, setSelectedDiameter] = useState('');
    const [quantity, setQuantity] = useState('');
    const [weight, setWeight] = useState('');
    const [lastEdited, setLastEdited] = useState('quantity'); // 'quantity' or 'weight'
    const [conversionResult, setConversionResult] = useState(null);
    const [processType, setProcessType] = useState('coating'); // 'coating', 'preapplication', or 'coatingAndPreapplication'
    const [productType, setProductType] = useState('screw');
    const [screwType, setScrewType] = useState('mushroom');
    const [selectedNorm, setSelectedNorm] = useState('');
    const [normQuery, setNormQuery] = useState('');
    const [isNormDropdownOpen, setIsNormDropdownOpen] = useState(false);
    const [machine, setMachine] = useState('');
    const [machineInputs, setMachineInputs] = useState({
        efficiency: 10000,
        changeoverMin: 40,
        changeoverRate: 150,
        employeeRate: 78,
        mediaRate: 258,
        paintRate: 150,
    });
    const [margin, setMargin] = useState(20);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newDiameter, setNewDiameter] = useState('');
    const [newLength, setNewLength] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchScrews();
    }, []);

    const fetchScrews = async () => {
        try {
            setLoading(true);
            const data = await screwLengthsAPI.getAll();
            setScrews(data);
            setError('');
        } catch (err) {
            setError(t('calculator.errorFetch'));
        } finally {
            setLoading(false);
        }
    };

    const handleAddScrew = async (e) => {
        e.preventDefault();
        setError('');

        if (!newDiameter || parseFloat(newDiameter) <= 0) {
            setError(t('calculator.errorInvalidDiameter'));
            return;
        }

        if (!newLength || parseFloat(newLength) <= 0) {
            setError(t('calculator.errorInvalidLength'));
            return;
        }

        try {
            await screwLengthsAPI.create({
                srednica: parseFloat(newDiameter),
                dlugosc: parseFloat(newLength)
            });
            await fetchScrews();
            setNewDiameter('');
            setNewLength('');
            setShowAddForm(false);
        } catch (err) {
            setError(err.response?.data?.detail || t('calculator.errorSave'));
        }
    };

    const handleDeleteScrew = async (id) => {
        if (!window.confirm(t('calculator.confirmDelete'))) return;

        try {
            await screwLengthsAPI.delete(id);
            await fetchScrews();
            if (selectedScrew === id.toString()) {
                setSelectedScrew('');
            }
        } catch (err) {
            setError(t('calculator.errorDelete'));
        }
    };

    const MACHINE_DEFAULTS = {
        machine1: {
            efficiency: 10000,
            changeoverMin: 40,
            changeoverRate: 150,
            employeeRate: 78,
            mediaRate: 258,
            paintRate: 150,
        },
        machine2: {
            efficiency: 20000,
            changeoverMin: 60,
            changeoverRate: 150,
            employeeRate: 78,
            mediaRate: 258,
            paintRate: 150,
        },
    };
    const productOptions = processType === 'coating'
        ? ['screw', 'washer', 'nut', 'selfTappingScrew']
        : ['screw'];
    const screwTypeOptions = ['mushroom', 'hexSocket', 'carriage'];
    const normOptions = [
        'ISO 4762',
        'ISO 4762 **',
        'DIN 603',
        'DIN 316',
        'DIN 963',
        'DIN 931',
        '~DIN 931',
        'DIN 125 A',
        'DIN 9021',
        'DIN 976',
        'DIN 6888',
        'DIN 933',
        'DIN 188',
        'DIN 6885 B',
        'ISO 2341 B',
        'ISO 8752',
        'AN 213',
        'DIN 470'
    ].sort((a, b) => a.localeCompare(b));
    const filteredNormOptions = normOptions.filter((norm) =>
        norm.toLowerCase().includes(normQuery.toLowerCase())
    );
    const requiresNormSelection = productType === 'screw' && screwType === 'hexSocket';
    const canShowScrewSelection = productType === 'screw' && screwType === 'hexSocket' && Boolean(selectedNorm);

    useEffect(() => {
        if (machine && MACHINE_DEFAULTS[machine]) {
            setMachineInputs(MACHINE_DEFAULTS[machine]);
        }
    }, [machine]);

    const handleMachineInputChange = (field, value) => {
        setMachineInputs((current) => ({
            ...current,
            [field]: value === '' ? '' : Number(value),
        }));
    };

    let machineMetrics = null;
    let calculatedTotalCost = 0;

    if (machine && conversionResult) {
        const efficiency = Number(machineInputs.efficiency) || 0;
        const changeoverMin = Number(machineInputs.changeoverMin) || 0;
        const changeoverRate = Number(machineInputs.changeoverRate) || 0;
        const employeeRate = Number(machineInputs.employeeRate) || 0;
        const mediaRate = Number(machineInputs.mediaRate) || 0;
        const paintRate = Number(machineInputs.paintRate) || 0;
        const hours = efficiency > 0 ? conversionResult.q / efficiency : 0;

        const changeoverCost = (changeoverMin / 60) * changeoverRate;
        const employeeCost = hours * employeeRate;
        const mediaCost = hours * mediaRate;

        let paintCost = 0;
        if (processType === 'coating' || processType === 'coatingAndPreapplication') {
            paintCost = (conversionResult.q / 1000) * paintRate;
        }

        calculatedTotalCost = changeoverCost + employeeCost + mediaCost + paintCost;

        machineMetrics = (
            <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-lg">
                <h4 className="font-semibold text-slate-700 mb-4">{t('calculator.metricsTitle')}</h4>
                <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span>{t('calculator.efficiency')}</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                value={machineInputs.efficiency}
                                onChange={(e) => handleMachineInputChange('efficiency', e.target.value)}
                                className="input-field w-28 py-1.5 text-right"
                            />
                            <span className="font-medium text-slate-800">{t('calculator.pcsPerHour')}</span>
                        </div>
                    </div>

                    {(processType === 'coating' || processType === 'coatingAndPreapplication') && (
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span>{t('calculator.paintCost')}</span>
                            <div className="text-right flex items-center justify-end min-w-[150px]">
                                <div className="flex items-center gap-2 mr-4">
                                    <input
                                        type="number"
                                        min="0"
                                        value={machineInputs.paintRate}
                                        onChange={(e) => handleMachineInputChange('paintRate', e.target.value)}
                                        className="input-field w-24 py-1.5 text-right"
                                    />
                                    <span className="font-medium text-slate-800 whitespace-nowrap">PLN / 1000 {t('calculator.pieces')}</span>
                                </div>
                                <span className="font-semibold text-blue-600 w-24 text-right">{paintCost.toFixed(2)} PLN</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span>{t('calculator.changeover')}</span>
                        <div className="text-right flex items-center justify-end min-w-[150px]">
                            <div className="flex items-center gap-2 mr-4">
                                <input
                                    type="number"
                                    min="0"
                                    value={machineInputs.changeoverMin}
                                    onChange={(e) => handleMachineInputChange('changeoverMin', e.target.value)}
                                    className="input-field w-20 py-1.5 text-right"
                                />
                                <span className="font-medium text-slate-800">{t('calculator.minutes')}</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={machineInputs.changeoverRate}
                                    onChange={(e) => handleMachineInputChange('changeoverRate', e.target.value)}
                                    className="input-field w-24 py-1.5 text-right"
                                />
                                <span className="font-medium text-slate-800">PLN/h</span>
                            </div>
                            <span className="font-semibold text-blue-600 w-24 text-right">{changeoverCost.toFixed(2)} PLN</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span>{t('calculator.employeeTime')}</span>
                        <div className="text-right flex items-center justify-end min-w-[150px]">
                            <span className="font-medium text-slate-800 w-20 text-right mr-4">{hours.toFixed(2)} {t('calculator.hours')}</span>
                            <input
                                type="number"
                                min="0"
                                value={machineInputs.employeeRate}
                                onChange={(e) => handleMachineInputChange('employeeRate', e.target.value)}
                                className="input-field w-24 py-1.5 text-right mr-2"
                            />
                            <span className="font-medium text-slate-800 mr-4">PLN/h</span>
                            <span className="font-semibold text-blue-600 w-24 text-right">{employeeCost.toFixed(2)} PLN</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span>{t('calculator.mediaTime')}</span>
                        <div className="text-right flex items-center justify-end min-w-[150px]">
                            <span className="font-medium text-slate-800 w-20 text-right mr-4">{hours.toFixed(2)} {t('calculator.hours')}</span>
                            <input
                                type="number"
                                min="0"
                                value={machineInputs.mediaRate}
                                onChange={(e) => handleMachineInputChange('mediaRate', e.target.value)}
                                className="input-field w-24 py-1.5 text-right mr-2"
                            />
                            <span className="font-medium text-slate-800 mr-4">PLN/h</span>
                            <span className="font-semibold text-blue-600 w-24 text-right">{mediaCost.toFixed(2)} PLN</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-slate-800 text-base">{t('calculator.totalCost')}</span>
                        <span className="font-bold text-blue-700 text-lg">{calculatedTotalCost.toFixed(2)} PLN</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">{t('calculator.title')}</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="card mb-6">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">
                                {t('calculator.processType')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => {
                                        setProcessType('coating');
                                        setProductType('screw');
                                        setScrewType('mushroom');
                                        setSelectedNorm('');
                                        setNormQuery('');
                                        setIsNormDropdownOpen(false);
                                        setMachine('');
                                    }}
                                    className={`p-4 border-2 rounded-lg text-center transition-all ${processType === 'coating'
                                        ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                                        : 'border-slate-200 hover:border-blue-300 text-slate-600'
                                        }`}
                                >
                                    {t('calculator.processCoating')}
                                </button>
                                <button
                                    onClick={() => {
                                        setProcessType('preapplication');
                                        setProductType('screw');
                                        setScrewType('mushroom');
                                        setSelectedNorm('');
                                        setNormQuery('');
                                        setIsNormDropdownOpen(false);
                                        setMachine('');
                                    }}
                                    className={`p-4 border-2 rounded-lg text-center transition-all ${processType === 'preapplication'
                                        ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                                        : 'border-slate-200 hover:border-blue-300 text-slate-600'
                                        }`}
                                >
                                    {t('calculator.processPreapplication')}
                                </button>
                                <button
                                    onClick={() => {
                                        setProcessType('coatingAndPreapplication');
                                        setProductType('screw');
                                        setScrewType('mushroom');
                                        setSelectedNorm('');
                                        setNormQuery('');
                                        setIsNormDropdownOpen(false);
                                        setMachine('');
                                    }}
                                    className={`p-4 border-2 rounded-lg text-center transition-all ${processType === 'coatingAndPreapplication'
                                        ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                                        : 'border-slate-200 hover:border-blue-300 text-slate-600'
                                        }`}
                                >
                                    {t('calculator.processCoatingAndPreapplication')}
                                </button>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">
                                {t('calculator.productType')}
                            </h2>
                            <div className={`grid grid-cols-1 ${productOptions.length > 1 ? 'md:grid-cols-4' : 'md:grid-cols-1'} gap-4`}>
                                {productOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setProductType(option);
                                            setScrewType('mushroom');
                                            setSelectedNorm('');
                                            setNormQuery('');
                                            setIsNormDropdownOpen(false);
                                            setSelectedDiameter('');
                                            setSelectedScrew('');
                                            setConversionResult(null);
                                            setQuantity('');
                                            setWeight('');
                                            setMachine('');
                                        }}
                                        className={`p-4 border-2 rounded-lg text-center transition-all ${productType === option
                                            ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                                            : 'border-slate-200 hover:border-blue-300 text-slate-600'
                                            }`}
                                    >
                                        {t(`calculator.product.${option}`)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {productType === 'screw' && (
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                                    {t('calculator.screwType')}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {screwTypeOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setScrewType(option);
                                                setSelectedNorm('');
                                                setNormQuery('');
                                                setIsNormDropdownOpen(false);
                                                setSelectedDiameter('');
                                                setSelectedScrew('');
                                                setConversionResult(null);
                                                setQuantity('');
                                                setWeight('');
                                                setMachine('');
                                            }}
                                            className={`p-4 border-2 rounded-lg text-center transition-all ${screwType === option
                                                ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                                                : 'border-slate-200 hover:border-blue-300 text-slate-600'
                                                }`}
                                        >
                                            {t(`calculator.screwType.${option}`)}
                                        </button>
                                    ))}
                                </div>

                                {screwType === 'hexSocket' && (
                                    <div className="mt-4 relative">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            {t('calculator.norm')}
                                        </label>
                                        <input
                                            value={normQuery}
                                            onChange={(e) => {
                                                setNormQuery(e.target.value);
                                                setIsNormDropdownOpen(true);
                                                if (selectedNorm && e.target.value !== selectedNorm) {
                                                    setSelectedNorm('');
                                                }
                                            }}
                                            onFocus={() => setIsNormDropdownOpen(true)}
                                            onBlur={() => {
                                                window.setTimeout(() => {
                                                    setIsNormDropdownOpen(false);
                                                }, 150);
                                            }}
                                            className="input-field"
                                            placeholder={t('calculator.chooseNorm')}
                                        />
                                        {isNormDropdownOpen && (
                                            <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                                                {filteredNormOptions.length > 0 ? (
                                                    filteredNormOptions.map((norm) => (
                                                        <button
                                                            key={norm}
                                                            type="button"
                                                            onMouseDown={() => {
                                                                setSelectedNorm(norm);
                                                                setNormQuery(norm);
                                                                setSelectedDiameter('');
                                                                setSelectedScrew('');
                                                                setConversionResult(null);
                                                                setQuantity('');
                                                                setWeight('');
                                                                setMachine('');
                                                                setIsNormDropdownOpen(false);
                                                            }}
                                                            className={`block w-full px-4 py-3 text-left text-sm transition-colors ${
                                                                selectedNorm === norm
                                                                    ? 'bg-blue-50 text-blue-800'
                                                                    : 'text-slate-700 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            {norm}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-slate-500">
                                                        {t('calculator.noNormResults')}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {canShowScrewSelection ? (
                <div className="card mb-6">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">
                        {t('calculator.selectDiameter')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t('calculator.diameter')}
                            </label>
                            <select
                                value={selectedDiameter}
                                onChange={(e) => {
                                    setSelectedDiameter(e.target.value);
                                    setSelectedScrew('');
                                    setConversionResult(null);
                                    setQuantity('');
                                    setWeight('');
                                }}
                                className="input-field"
                                disabled={loading}
                            >
                                <option value="">{t('calculator.chooseDiameter')}</option>
                                {[...new Set(screws.map(s => s.srednica))].sort((a, b) => a - b).map((diameter) => (
                                    <option key={diameter} value={diameter}>
                                        ⌀{diameter} mm
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t('calculator.length')}
                            </label>
                            <select
                                value={selectedScrew}
                                onChange={(e) => {
                                    setSelectedScrew(e.target.value);
                                    setConversionResult(null);
                                    setQuantity('');
                                    setWeight('');
                                    setMachine('');
                                }}
                                className="input-field"
                                disabled={!selectedDiameter || loading}
                            >
                                <option value="">{t('calculator.chooseLength')}</option>
                                {screws
                                    .filter(s => s.srednica === (selectedDiameter ? parseFloat(selectedDiameter) : null))
                                    .sort((a, b) => a.dlugosc - b.dlugosc)
                                    .map((screw) => (
                                        <option key={screw.id} value={screw.id}>
                                            {screw.dlugosc} mm
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="btn-primary whitespace-nowrap"
                        >
                            {showAddForm ? t('calculator.cancel') : t('calculator.addButton')}
                        </button>
                    </div>

                    {selectedScrew && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 mb-3">
                                {t('calculator.selectedScrew')}:{' '}
                                <strong>
                                    ⌀{screws.find(s => s.id === parseInt(selectedScrew))?.srednica} mm × {screws.find(s => s.id === parseInt(selectedScrew))?.dlugosc} mm
                                </strong>
                            </p>
                            <div className="flex flex-wrap items-end gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-800 mb-1">
                                        {t('calculator.quantity')}:
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={quantity}
                                            onChange={(e) => {
                                                setQuantity(e.target.value);
                                                setLastEdited('quantity');
                                            }}
                                            className="input-field w-32"
                                            placeholder="np. 1000"
                                        />
                                        <span className="text-sm text-blue-600">{t('calculator.pieces')}</span>
                                    </div>
                                </div>

                                <span className="text-blue-800 font-medium mb-2">lub</span>

                                <div>
                                    <label className="block text-sm font-medium text-blue-800 mb-1">
                                        {t('calculator.weight')}:
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.001"
                                            value={weight}
                                            onChange={(e) => {
                                                setWeight(e.target.value);
                                                setLastEdited('weight');
                                            }}
                                            className="input-field w-32"
                                            placeholder="np. 0.2"
                                        />
                                        <span className="text-sm text-blue-600">kg</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        // 1000 pcs = 200g = 0.2 kg
                                        // 1 pc = 0.0002 kg
                                        const weightPerPiece = 0.0002;

                                        if (lastEdited === 'quantity' && quantity !== '') {
                                            const q = parseInt(quantity);
                                            const w = q * weightPerPiece;
                                            setWeight(w.toFixed(4));
                                            setConversionResult({ q, w: w.toFixed(4) });
                                        } else if (lastEdited === 'weight' && weight !== '') {
                                            const w = parseFloat(weight);
                                            const q = Math.round(w / weightPerPiece);
                                            setQuantity(q);
                                            setConversionResult({ q, w: w.toFixed(4) });
                                        }
                                    }}
                                    className="btn-primary mb-1 pl-4 pr-4"
                                >
                                    {t('calculator.calculate')}
                                </button>
                            </div>

                            {conversionResult && (
                                <div className="mt-4 p-3 bg-white border border-blue-100 rounded text-blue-900">
                                    <p className="font-semibold text-sm">{t('calculator.resultInfo')}</p>
                                    <p className="mt-1">
                                        {t('calculator.resultText', {
                                            quantity: conversionResult.q,
                                            weight: conversionResult.w
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedScrew && (
                        <div className="mt-6">
                            <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                <div className="p-5">
                                    <div className="mb-4 flex items-center justify-between gap-4">
                                        <h3 className="text-lg font-medium text-slate-800">
                                            {t('calculator.machineSelection')} ({processType === 'preapplication'
                                                ? t('calculator.processPreapplication')
                                                : processType === 'coatingAndPreapplication'
                                                    ? t('calculator.processCoatingAndPreapplication')
                                                    : t('calculator.processCoating')})
                                        </h3>
                                        <button
                                            type="button"
                                            className="btn-primary whitespace-nowrap"
                                        >
                                            {t('calculator.addMachine')}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setMachine('machine1')}
                                            className={`p-4 border-2 rounded-lg text-center transition-all ${machine === 'machine1'
                                                ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                                                : 'border-slate-200 hover:border-blue-300 text-slate-600'
                                                }`}
                                        >
                                            {t('calculator.machine1')}
                                        </button>
                                        <button
                                            onClick={() => setMachine('machine2')}
                                            className={`p-4 border-2 rounded-lg text-center transition-all ${machine === 'machine2'
                                                ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                                                : 'border-slate-200 hover:border-blue-300 text-slate-600'
                                                }`}
                                        >
                                            {t('calculator.machine2')}
                                        </button>
                                    </div>
                                </div>

                                {machineMetrics}

                                {machine && conversionResult && (
                                    <div className="p-5 border-t border-green-200 bg-green-50 rounded-b-lg">
                                        <h3 className="text-lg font-semibold text-green-800 mb-4">{t('calculator.salePriceSection')}</h3>

                                        <div className="flex justify-between items-center mb-5 text-green-900">
                                            <span>{t('calculator.costPer100')}:</span>
                                            <span className="font-medium">
                                                {((calculatedTotalCost / conversionResult.q) * 100).toFixed(2)} PLN
                                            </span>
                                        </div>

                                        <div className="mb-6 bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="text-sm font-medium text-green-800">{t('calculator.margin')}:</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={margin}
                                                        onChange={(e) => setMargin(Number(e.target.value))}
                                                        className="input-field w-24 text-right py-1.5"
                                                    />
                                                    <span className="text-green-800 font-medium">%</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-green-600 font-medium">20%</span>
                                                <input
                                                    type="range"
                                                    min="20"
                                                    max="100"
                                                    value={margin}
                                                    onChange={(e) => setMargin(Number(e.target.value))}
                                                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                                />
                                                <span className="text-xs text-green-600 font-medium">100%</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-green-200">
                                            <span className="font-bold text-green-800 text-lg">{t('calculator.finalPricePer100')}</span>
                                            <span className="font-bold text-green-700 text-2xl">
                                                {(((calculatedTotalCost / conversionResult.q) * 100) * (1 + margin / 100)).toFixed(2)} PLN
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                ) : (
                    <div className="card mb-6">
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                            {t('calculator.productTypeInfo', { product: t(`calculator.product.${productType}`) })}
                        </div>
                    </div>
                )}

                {showAddForm && (
                    <div className="card mb-6">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">
                            {t('calculator.addNewScrew')}
                        </h2>
                        <form onSubmit={handleAddScrew} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('calculator.diameterValue')} (mm)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={newDiameter}
                                    onChange={(e) => setNewDiameter(e.target.value)}
                                    className="input-field"
                                    placeholder={t('calculator.diameterPlaceholder')}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('calculator.lengthValue')} (mm)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={newLength}
                                    onChange={(e) => setNewLength(e.target.value)}
                                    className="input-field"
                                    placeholder={t('calculator.lengthPlaceholder')}
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary">
                                    {t('calculator.create')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setNewDiameter('');
                                        setNewLength('');
                                    }}
                                    className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                    {t('calculator.cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Calculator;

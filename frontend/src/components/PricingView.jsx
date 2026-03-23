import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const processOptions = ['coating', 'preapplication'];
const diameterOptions = ['2', '2.5', '3', '4', '5', '6', '8', '10', '12', '14', '16'];
const lengthOptions = ['5', '8', '10', '12', '14', '16', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100'];

const normOptionsByProcess = {
    coating: ['DIN 933', 'ISO 4762', 'DIN 9021'],
    preapplication: ['DIN 933', 'ISO 4762', 'DIN 7504'],
};

const productOptionsByProcess = {
    coating: ['screws', 'nuts', 'washers', 'rivets'],
    preapplication: ['screws'],
};

const initialFormData = {
    processType: 'preapplication',
    productType: 'screws',
    norm: '',
    diameters: [],
    lengths: [],
    pricePerKg: '',
};

function MultiSelectList({ title, fieldName, options, values, unitLabel, placeholder, tall, onItemMouseDown, onItemMouseEnter }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {title}
            </label>
            <div className="mb-2 text-sm text-slate-600">
                {values.length === 0 ? placeholder : values.map((value) => `${value} ${unitLabel}`).join(', ')}
            </div>
            <div className={`checked-listbox ${tall ? 'checked-listbox-tall' : ''}`}>
                {options.map((option) => {
                    const selected = values.includes(option);

                    return (
                        <button
                            key={option}
                            type="button"
                            className={`checked-listbox-row ${selected ? 'checked-listbox-row-selected' : ''}`}
                            onMouseDown={(event) => onItemMouseDown(event, fieldName, option)}
                            onMouseEnter={() => onItemMouseEnter(fieldName, option)}
                        >
                            <span>{option} {unitLabel}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function PricingView() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(initialFormData);
    const [savedEntries, setSavedEntries] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dragSelection, setDragSelection] = useState({
        active: false,
        fieldName: '',
        shouldSelect: true,
    });

    const normOptions = normOptionsByProcess[formData.processType];
    const productOptions = productOptionsByProcess[formData.processType];

    const handleProcessChange = (event) => {
        const nextProcessType = event.target.value;
        setFormData({
            processType: nextProcessType,
            productType: productOptionsByProcess[nextProcessType][0],
            norm: '',
            diameters: [],
            lengths: [],
            pricePerKg: '',
        });
        setError('');
        setSuccess('');
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
        setError('');
        setSuccess('');
    };

    useEffect(() => {
        const stopDragSelection = () => {
            setDragSelection({
                active: false,
                fieldName: '',
                shouldSelect: true,
            });
        };

        window.addEventListener('mouseup', stopDragSelection);

        return () => {
            window.removeEventListener('mouseup', stopDragSelection);
        };
    }, []);

    const setMultiValue = (fieldName, value, shouldSelect) => {
        setFormData((current) => {
            const isSelected = current[fieldName].includes(value);
            let values = current[fieldName];

            if (shouldSelect && !isSelected) {
                values = [...current[fieldName], value];
            }

            if (!shouldSelect && isSelected) {
                values = current[fieldName].filter((item) => item !== value);
            }

            return {
                ...current,
                [fieldName]: values,
            };
        });
        setError('');
        setSuccess('');
    };

    const handleMultiValueMouseDown = (event, fieldName, value) => {
        event.preventDefault();
        const shouldSelect = !formData[fieldName].includes(value);
        setDragSelection({
            active: true,
            fieldName,
            shouldSelect,
        });
        setMultiValue(fieldName, value, shouldSelect);
    };

    const handleMultiValueMouseEnter = (fieldName, value) => {
        if (!dragSelection.active || dragSelection.fieldName !== fieldName) {
            return;
        }

        setMultiValue(fieldName, value, dragSelection.shouldSelect);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.norm) {
            setError(t('pricing.errorNorm'));
            setSuccess('');
            return;
        }

        if (formData.diameters.length === 0) {
            setError(t('pricing.errorDiameters'));
            setSuccess('');
            return;
        }

        if (formData.lengths.length === 0) {
            setError(t('pricing.errorLength'));
            setSuccess('');
            return;
        }

        if (!formData.pricePerKg || Number(formData.pricePerKg) <= 0) {
            setError(t('pricing.errorPrice'));
            setSuccess('');
            return;
        }

        setSavedEntries((current) => [
            {
                ...formData,
                id: `${formData.processType}-${formData.norm}-${Date.now()}`,
            },
            ...current,
        ]);
        setFormData((current) => ({
            ...current,
            norm: '',
            diameters: [],
            lengths: [],
            pricePerKg: '',
        }));
        setError('');
        setSuccess(t('pricing.success'));
    };

    return (
        <div className="p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="card">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('pricing.title')}</h1>
                    <p className="text-slate-600">{t('pricing.subtitle')}</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('pricing.processType')}
                                </label>
                                <select
                                    name="processType"
                                    value={formData.processType}
                                    onChange={handleProcessChange}
                                    className="input-field"
                                >
                                    {processOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {t(`pricing.process.${option}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('pricing.productType')}
                                </label>
                                <select
                                    name="productType"
                                    value={formData.productType}
                                    onChange={handleFieldChange}
                                    className="input-field"
                                >
                                    {productOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {t(`pricing.product.${option}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('pricing.norm')}
                                </label>
                                <select
                                    name="norm"
                                    value={formData.norm}
                                    onChange={handleFieldChange}
                                    className="input-field"
                                >
                                    <option value="">{t('pricing.chooseNorm')}</option>
                                    {normOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <MultiSelectList
                            title={t('pricing.diameters')}
                            fieldName="diameters"
                            options={diameterOptions}
                            values={formData.diameters}
                            unitLabel="mm"
                            placeholder={t('pricing.chooseDiameters')}
                            onItemMouseDown={handleMultiValueMouseDown}
                            onItemMouseEnter={handleMultiValueMouseEnter}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MultiSelectList
                                title={t('pricing.length')}
                                fieldName="lengths"
                                options={lengthOptions}
                                values={formData.lengths}
                                unitLabel="mm"
                                placeholder={t('pricing.chooseLengths')}
                                tall
                                onItemMouseDown={handleMultiValueMouseDown}
                                onItemMouseEnter={handleMultiValueMouseEnter}
                            />

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('pricing.pricePerKg')}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="pricePerKg"
                                    value={formData.pricePerKg}
                                    onChange={handleFieldChange}
                                    className="input-field"
                                    placeholder={t('pricing.pricePlaceholder')}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="btn-primary">
                                {t('pricing.save')}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">{t('pricing.savedTitle')}</h2>
                    {savedEntries.length === 0 ? (
                        <p className="text-slate-600">{t('pricing.empty')}</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('pricing.processType')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('pricing.productType')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('pricing.norm')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('pricing.diameters')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('pricing.length')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('pricing.pricePerKg')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {savedEntries.map((entry) => (
                                        <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">{t(`pricing.process.${entry.processType}`)}</td>
                                            <td className="py-3 px-4">{t(`pricing.product.${entry.productType}`)}</td>
                                            <td className="py-3 px-4">{entry.norm}</td>
                                            <td className="py-3 px-4">{entry.diameters.map((diameter) => `${diameter} mm`).join(', ')}</td>
                                            <td className="py-3 px-4">{entry.lengths.map((length) => `${length} mm`).join(', ')}</td>
                                            <td className="py-3 px-4">{Number(entry.pricePerKg).toFixed(2)} PLN</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PricingView;

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { screwLengthsAPI } from '../api';

function Calculator() {
    const { t } = useTranslation();
    const [screws, setScrews] = useState([]);
    const [selectedScrew, setSelectedScrew] = useState('');
    const [selectedDiameter, setSelectedDiameter] = useState('');
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
                                onChange={(e) => setSelectedScrew(e.target.value)}
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
                            <p className="text-blue-800">
                                {t('calculator.selectedScrew')}:{' '}
                                <strong>
                                    ⌀{screws.find(s => s.id === parseInt(selectedScrew))?.srednica} mm × {screws.find(s => s.id === parseInt(selectedScrew))?.dlugosc} mm
                                </strong>
                            </p>
                        </div>
                    )}
                </div>

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

                <div className="card">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">
                        {t('calculator.availableScrews')}
                    </h2>
                    {loading ? (
                        <p className="text-slate-600">{t('calculator.loading')}</p>
                    ) : screws.length === 0 ? (
                        <p className="text-slate-600">{t('calculator.empty')}</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">
                                            {t('calculator.diameter')}
                                        </th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">
                                            {t('calculator.length')}
                                        </th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">
                                            {t('calculator.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {screws.map((screw) => (
                                        <tr key={screw.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">{screw.id}</td>
                                            <td className="py-3 px-4 font-medium">⌀{screw.srednica} mm</td>
                                            <td className="py-3 px-4 font-medium">{screw.dlugosc} mm</td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => handleDeleteScrew(screw.id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                >
                                                    {t('calculator.delete')}
                                                </button>
                                            </td>
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

export default Calculator;

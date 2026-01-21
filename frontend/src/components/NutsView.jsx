import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { nutsAPI, rangesAPI } from '../api';

function NutsView() {
    const { t } = useTranslation();
    const [nuts, setNuts] = useState([]);
    const [ranges, setRanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingNut, setEditingNut] = useState(null);
    const [filterRangeId, setFilterRangeId] = useState(null);
    const [formData, setFormData] = useState({
        id_zakresu: '',
        nazwa: '',
        srednica: '',
        cena: '',
    });

    useEffect(() => {
        fetchRanges();
        fetchNuts();
    }, []);

    useEffect(() => {
        fetchNuts();
    }, [filterRangeId]);

    const fetchRanges = async () => {
        try {
            const data = await rangesAPI.getAll();
            setRanges(data);
        } catch (err) {
            console.error('Error fetching ranges:', err);
        }
    };

    const fetchNuts = async () => {
        try {
            setLoading(true);
            const data = await nutsAPI.getAll(filterRangeId);
            setNuts(data);
            setError('');
        } catch (err) {
            setError(t('nuts.errorFetch'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const nutData = {
                ...formData,
                id_zakresu: parseInt(formData.id_zakresu),
                srednica: parseFloat(formData.srednica),
                cena: parseFloat(formData.cena),
            };

            if (editingNut) {
                await nutsAPI.update(editingNut.id, nutData);
            } else {
                await nutsAPI.create(nutData);
            }
            await fetchNuts();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.detail || t('nuts.errorSave'));
        }
    };

    const handleEdit = (nut) => {
        setEditingNut(nut);
        setFormData({
            id_zakresu: nut.id_zakresu.toString(),
            nazwa: nut.nazwa,
            srednica: nut.srednica.toString(),
            cena: nut.cena.toString(),
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('nuts.confirmDelete'))) return;

        try {
            await nutsAPI.delete(id);
            await fetchNuts();
        } catch (err) {
            setError(err.response?.data?.detail || t('nuts.errorDelete'));
        }
    };

    const resetForm = () => {
        setFormData({ id_zakresu: '', nazwa: '', srednica: '', cena: '' });
        setEditingNut(null);
        setShowForm(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const getRangeName = (rangeId) => {
        const range = ranges.find(r => r.id === rangeId);
        return range ? range.nazwa : rangeId;
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">{t('nuts.title')}</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary"
                    >
                        {showForm ? t('nuts.cancel') : t('nuts.addNew')}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {showForm && (
                    <div className="card mb-8">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">
                            {editingNut ? t('nuts.edit') : t('nuts.addNew')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('nuts.range')}
                                </label>
                                <select
                                    name="id_zakresu"
                                    value={formData.id_zakresu}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="">{t('nuts.selectRange')}</option>
                                    {ranges.map((range) => (
                                        <option key={range.id} value={range.id}>
                                            {range.nazwa} ({range.od} - {range.do})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('nuts.name')}
                                </label>
                                <input
                                    type="text"
                                    name="nazwa"
                                    value={formData.nazwa}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {t('nuts.diameter')}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="srednica"
                                        value={formData.srednica}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {t('nuts.price')}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="cena"
                                        value={formData.cena}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary">
                                    {editingNut ? t('nuts.update') : t('nuts.create')}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                    {t('nuts.cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="card mb-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-slate-700">
                            {t('nuts.filterByRange')}
                        </label>
                        <select
                            value={filterRangeId || ''}
                            onChange={(e) => setFilterRangeId(e.target.value ? parseInt(e.target.value) : null)}
                            className="input-field max-w-xs"
                        >
                            <option value="">{t('nuts.allRanges')}</option>
                            {ranges.map((range) => (
                                <option key={range.id} value={range.id}>
                                    {range.nazwa} ({range.od} - {range.do})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">{t('nuts.list')}</h2>
                    {loading ? (
                        <p className="text-slate-600">{t('nuts.loading')}</p>
                    ) : nuts.length === 0 ? (
                        <p className="text-slate-600">{t('nuts.empty')}</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('nuts.range')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('nuts.name')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('nuts.diameter')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('nuts.price')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('nuts.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nuts.map((nut) => (
                                        <tr key={nut.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">{nut.id}</td>
                                            <td className="py-3 px-4">{getRangeName(nut.id_zakresu)}</td>
                                            <td className="py-3 px-4 font-medium">{nut.nazwa}</td>
                                            <td className="py-3 px-4">{nut.srednica}</td>
                                            <td className="py-3 px-4">{parseFloat(nut.cena).toFixed(2)} zł</td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(nut)}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                    >
                                                        {t('nuts.edit')}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(nut.id)}
                                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                    >
                                                        {t('nuts.delete')}
                                                    </button>
                                                </div>
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

export default NutsView;

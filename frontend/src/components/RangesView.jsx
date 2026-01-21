import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { rangesAPI } from '../api';

function RangesView() {
    const { t } = useTranslation();
    const [ranges, setRanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRange, setEditingRange] = useState(null);
    const [formData, setFormData] = useState({
        nazwa: '',
        od: '',
        do: '',
    });

    useEffect(() => {
        fetchRanges();
    }, []);

    const fetchRanges = async () => {
        try {
            setLoading(true);
            const data = await rangesAPI.getAll();
            setRanges(data);
            setError('');
        } catch (err) {
            setError(t('ranges.errorFetch'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (parseFloat(formData.od) >= parseFloat(formData.do)) {
            setError(t('ranges.errorValidation'));
            return;
        }

        try {
            if (editingRange) {
                await rangesAPI.update(editingRange.id, formData);
            } else {
                await rangesAPI.create(formData);
            }
            await fetchRanges();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.detail || t('ranges.errorSave'));
        }
    };

    const handleEdit = (range) => {
        setEditingRange(range);
        setFormData({
            nazwa: range.nazwa,
            od: range.od.toString(),
            do: range.do.toString(),
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('ranges.confirmDelete'))) return;

        try {
            await rangesAPI.delete(id);
            await fetchRanges();
        } catch (err) {
            setError(err.response?.data?.detail || t('ranges.errorDelete'));
        }
    };

    const resetForm = () => {
        setFormData({ nazwa: '', od: '', do: '' });
        setEditingRange(null);
        setShowForm(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">{t('ranges.title')}</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary"
                    >
                        {showForm ? t('ranges.cancel') : t('ranges.addNew')}
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
                            {editingRange ? t('ranges.edit') : t('ranges.addNew')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {t('ranges.name')}
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
                                        {t('ranges.from')}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="od"
                                        value={formData.od}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {t('ranges.to')}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="do"
                                        value={formData.do}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary">
                                    {editingRange ? t('ranges.update') : t('ranges.create')}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                    {t('ranges.cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="card">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">{t('ranges.list')}</h2>
                    {loading ? (
                        <p className="text-slate-600">{t('ranges.loading')}</p>
                    ) : ranges.length === 0 ? (
                        <p className="text-slate-600">{t('ranges.empty')}</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('ranges.name')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('ranges.from')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('ranges.to')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('ranges.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ranges.map((range) => (
                                        <tr key={range.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">{range.id}</td>
                                            <td className="py-3 px-4 font-medium">{range.nazwa}</td>
                                            <td className="py-3 px-4">{range.od}</td>
                                            <td className="py-3 px-4">{range.do}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(range)}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                    >
                                                        {t('ranges.edit')}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(range.id)}
                                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                    >
                                                        {t('ranges.delete')}
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

export default RangesView;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { productAPI } from '../api';

const initialAsyncState = {
    id: false,
    sku: false,
};

const initialNullableState = {
    id: null,
    sku: null,
};

function formatValue(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }

    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : '—';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

function KeyValueTable({ rows }) {
    return (
        <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
                <tbody className="divide-y divide-slate-200 bg-white">
                    {rows.map((row) => (
                        <tr key={row.label}>
                            <th className="w-1/3 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                {row.label}
                            </th>
                            <td className="px-4 py-3 text-sm text-slate-700 break-words">
                                {formatValue(row.value)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function DataTable({ columns, rows, emptyLabel }) {
    if (!rows.length) {
        return (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                {emptyLabel}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 bg-white">
                <thead className="bg-slate-50">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {rows.map((row, index) => (
                        <tr key={`${index}-${columns.map((column) => row[column.key]).join('-')}`}>
                            {columns.map((column) => (
                                <td key={column.key} className="px-4 py-3 text-sm text-slate-700 align-top">
                                    {formatValue(row[column.key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ResultPanel({ title, data, emptyLabel, t }) {
    if (!data) {
        return (
            <div className="card h-full">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
                    {emptyLabel}
                </div>
            </div>
        );
    }

    const product = data.product || data;
    const generalRows = [
        { label: t('pimcore.product.id'), value: product.id },
        { label: t('pimcore.product.sku'), value: product.sku },
        { label: t('pimcore.product.name'), value: product.name },
        { label: t('pimcore.product.key'), value: product.key },
        { label: t('pimcore.product.parentId'), value: product.parentId },
        { label: t('pimcore.product.magentoId'), value: product.argipMagentoId },
        { label: t('pimcore.product.published'), value: product.published },
    ];

    const categoryRows = (product.categoryIds || []).map((item) => ({ id: item.id }));
    const channelRows = (product.channels || []).map((channel) => ({ value: channel }));
    const attributeRows = (product.argGlobal || []).map((item) => ({
        label: item.label,
        value: item.value,
        storeId: item.storeId,
        attributeCode: item.attributeCode,
        type: item.type,
        groupName: item.groupName,
    }));

    return (
        <div className="card h-full space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">{title}</h2>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {t('pimcore.section.general')}
                </h3>
                <KeyValueTable rows={generalRows} />
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {t('pimcore.section.channels')}
                </h3>
                <DataTable
                    columns={[{ key: 'value', label: t('pimcore.table.value') }]}
                    rows={channelRows}
                    emptyLabel={t('pimcore.emptyTable')}
                />
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {t('pimcore.section.categories')}
                </h3>
                <DataTable
                    columns={[{ key: 'id', label: t('pimcore.table.id') }]}
                    rows={categoryRows}
                    emptyLabel={t('pimcore.emptyTable')}
                />
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {t('pimcore.section.attributes')}
                </h3>
                <DataTable
                    columns={[
                        { key: 'label', label: t('pimcore.table.label') },
                        { key: 'value', label: t('pimcore.table.value') },
                        { key: 'attributeCode', label: t('pimcore.table.attributeCode') },
                        { key: 'type', label: t('pimcore.table.type') },
                        { key: 'storeId', label: t('pimcore.table.storeId') },
                        { key: 'groupName', label: t('pimcore.table.groupName') },
                    ]}
                    rows={attributeRows}
                    emptyLabel={t('pimcore.emptyTable')}
                />
            </div>
        </div>
    );
}

function PimcoreView() {
    const { t } = useTranslation();
    const [id, setId] = useState('');
    const [sku, setSku] = useState('');
    const [loading, setLoading] = useState(initialAsyncState);
    const [result, setResult] = useState(initialNullableState);
    const [error, setError] = useState(initialNullableState);

    const getErrorMessage = (err) => {
        if (axios.isAxiosError(err)) {
            return err.response?.data?.detail || err.response?.data?.message || err.message;
        }

        return t('pimcore.errorUnknown');
    };

    const handleFetchById = async () => {
        if (!id.trim()) {
            setError((current) => ({ ...current, id: t('pimcore.errorIdRequired') }));
            return;
        }

        setLoading((current) => ({ ...current, id: true }));
        setError((current) => ({ ...current, id: null }));

        try {
            const response = await productAPI.getById(id.trim());
            setResult((current) => ({ ...current, id: response }));
        } catch (err) {
            setResult((current) => ({ ...current, id: null }));
            setError((current) => ({ ...current, id: getErrorMessage(err) }));
        } finally {
            setLoading((current) => ({ ...current, id: false }));
        }
    };

    const handleFetchBySku = async () => {
        if (!sku.trim()) {
            setError((current) => ({ ...current, sku: t('pimcore.errorSkuRequired') }));
            return;
        }

        setLoading((current) => ({ ...current, sku: true }));
        setError((current) => ({ ...current, sku: null }));

        try {
            const response = await productAPI.getBySku(sku.trim());
            setResult((current) => ({ ...current, sku: response }));
        } catch (err) {
            setResult((current) => ({ ...current, sku: null }));
            setError((current) => ({ ...current, sku: getErrorMessage(err) }));
        } finally {
            setLoading((current) => ({ ...current, sku: false }));
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="card">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('pimcore.title')}</h1>
                    <p className="text-slate-600">{t('pimcore.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="card space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t('pimcore.byIdLabel')}
                            </label>
                            <input
                                type="text"
                                value={id}
                                onChange={(event) => setId(event.target.value)}
                                placeholder={t('pimcore.byIdPlaceholder')}
                                className="input-field"
                            />
                            <p className="mt-2 text-sm text-slate-500">/api/product/get-by-id/{'{id}'}</p>
                        </div>
                        {error.id && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                {error.id}
                            </div>
                        )}
                        <button type="button" onClick={handleFetchById} disabled={loading.id} className="btn-primary">
                            {loading.id ? t('pimcore.loadingButton') : t('pimcore.fetchButton')}
                        </button>
                    </div>

                    <div className="card space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t('pimcore.bySkuLabel')}
                            </label>
                            <input
                                type="text"
                                value={sku}
                                onChange={(event) => setSku(event.target.value)}
                                placeholder={t('pimcore.bySkuPlaceholder')}
                                className="input-field"
                            />
                            <p className="mt-2 text-sm text-slate-500">/api/product/get-by-sku/{'{sku}'}</p>
                        </div>
                        {error.sku && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                {error.sku}
                            </div>
                        )}
                        <button type="button" onClick={handleFetchBySku} disabled={loading.sku} className="btn-primary">
                            {loading.sku ? t('pimcore.loadingButton') : t('pimcore.fetchButton')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <ResultPanel title={t('pimcore.byIdResult')} data={result.id} emptyLabel={t('pimcore.emptyResult')} t={t} />
                    <ResultPanel title={t('pimcore.bySkuResult')} data={result.sku} emptyLabel={t('pimcore.emptyResult')} t={t} />
                </div>
            </div>
        </div>
    );
}

export default PimcoreView;

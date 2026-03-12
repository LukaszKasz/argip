import { useTranslation } from 'react-i18next';

const completedItems = [
    {
        date: '01-03-2026',
        product: 'Sruba 10mm x 50mm',
        quantity: '100.000 szt',
        weight: '20 kg',
        preapplicationPrice: '3,45',
        salePrice: '5,15',
    },
    {
        date: '03-03-2026',
        product: 'Sruba 8mm x 40mm',
        quantity: '75.000 szt',
        weight: '14 kg',
        preapplicationPrice: '2,95',
        salePrice: '4,60',
    },
    {
        date: '06-03-2026',
        product: 'Sruba 12mm x 70mm',
        quantity: '120.000 szt',
        weight: '32 kg',
        preapplicationPrice: '4,20',
        salePrice: '6,10',
    },
];

function CompletedView() {
    const { t } = useTranslation();

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="card">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('completed.title')}</h1>
                    <p className="text-slate-600">{t('completed.subtitle')}</p>
                </div>

                <div className="card overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('completed.date')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('completed.product')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('completed.quantity')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('completed.weight')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('completed.preapplicationPrice')}</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">{t('completed.salePrice')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedItems.map((item) => (
                                <tr key={`${item.date}-${item.product}`} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="py-4 px-4 text-slate-700">{item.date}</td>
                                    <td className="py-4 px-4 font-medium text-slate-800">{item.product}</td>
                                    <td className="py-4 px-4 text-slate-700">{item.quantity}</td>
                                    <td className="py-4 px-4 text-slate-700">{item.weight}</td>
                                    <td className="py-4 px-4 text-slate-700">{item.preapplicationPrice}</td>
                                    <td className="py-4 px-4 text-slate-800 font-semibold">{item.salePrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CompletedView;

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    PlusIcon,
    TrashIcon,
    ArrowPathIcon,
    BellAlertIcon,
    CurrencyDollarIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import {
    Button,
    Card,
    Input,
    Modal,
    PageHeader,
    Table,
    Badge,
} from '../../components/common';
import {
    StockMovementList,
    StockMovementModal,
    StockAlertList,
    MinimumStockModal,
    BulkUpdateModal,
    PriceHistoryList,
} from '../../components/stock';
import { productService } from '../../services/productService';
import { stockService } from '../../services/stockService';
import { Product } from '../../types';

export const ProductsPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [showStockMovementModal, setShowStockMovementModal] = useState(false);
    const [showMinimumStockModal, setShowMinimumStockModal] = useState(false);
    const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
    const [showPriceHistoryModal, setShowPriceHistoryModal] = useState(false);
    const [bulkUpdateType, setBulkUpdateType] = useState<'stock' | 'price'>('stock');
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'movements' | 'alerts'>('products');

    const queryClient = useQueryClient();

    // Ürünleri getir
    const {
        data: products = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['products', search],
        queryFn: async () => {
            const response = await productService.getAll(search);
            if (!response.data) {
                return [];
            }
            // Veriyi normalize et
            return response.data.map((product: any) => ({
                ...product,
                Stock: Number(product.Stock) || 0,
                Price: Number(product.Price) || 0,
                MinimumStock: Number(product.MinimumStock) || 0,
            }));
        },
    });

    // Excel yükleme mutation'ı
    const uploadMutation = useMutation({
        mutationFn: (file: File) => productService.uploadExcel(file),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(data.message || 'Ürünler başarıyla yüklendi');
            setShowUploadModal(false);
            setUploadFile(null);
        },
        onError: (error: any) => {
            console.error('Excel yükleme hatası:', error);
            toast.error('Ürünler yüklenirken bir hata oluştu');
        },
    });

    // Yeni ürün oluştur
    const createMutation = useMutation({
        mutationFn: (data: any) => productService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            setIsModalOpen(false);
            toast.success('Ürün başarıyla oluşturuldu');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Bir hata oluştu';
            toast.error(message);
        }
    });

    // Ürün güncelle
    const updateMutation = useMutation({
        mutationFn: (data: any) => 
            productService.update(selectedProduct!.ProductID!, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            setIsModalOpen(false);
            setSelectedProduct(null);
            toast.success('Ürün başarıyla güncellendi');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Bir hata oluştu';
            toast.error(message);
        }
    });

    // Ürün sil
    const deleteMutation = useMutation({
        mutationFn: (id: number) => productService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
            toast.success('Ürün başarıyla silindi');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Bir hata oluştu';
            toast.error(message);
        }
    });

    // Stok hareketlerini getir
    const { data: stockMovements = [], isLoading: isLoadingMovements } = useQuery({
        queryKey: ['stock-movements'],
        queryFn: () => stockService.getAllMovements(),
        enabled: activeTab === 'movements',
    });

    // Stok alarmlarını getir
    const { data: stockAlerts = [], isLoading: isLoadingAlerts } = useQuery({
        queryKey: ['stock-alerts'],
        queryFn: () => stockService.getAlerts(),
        enabled: activeTab === 'alerts',
    });

    // Fiyat geçmişini getir
    const { data: priceHistory = [], isLoading: isLoadingPriceHistory } = useQuery({
        queryKey: ['price-history', selectedProduct?.ProductID],
        queryFn: () => stockService.getPriceHistory(selectedProduct!.ProductID!),
        enabled: !!selectedProduct && showPriceHistoryModal,
    });

    // Stok hareketi oluştur
    const stockMovementMutation = useMutation({
        mutationFn: stockService.createMovement,
        onSuccess: () => {
            queryClient.invalidateQueries(['stock-movements', 'products']);
            setShowStockMovementModal(false);
            toast.success('Stok hareketi başarıyla oluşturuldu');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        },
    });

    // Minimum stok güncelle
    const minimumStockMutation = useMutation({
        mutationFn: ({ productId, minimumStock }: { productId: number; minimumStock: number }) =>
            stockService.updateMinimumStock(productId, minimumStock),
        onSuccess: () => {
            queryClient.invalidateQueries(['products', 'stock-alerts']);
            setShowMinimumStockModal(false);
            toast.success('Minimum stok başarıyla güncellendi');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        },
    });

    // Toplu stok güncelle
    const bulkStockMutation = useMutation({
        mutationFn: (updates: any[]) => stockService.updateStockBulk(updates),
        onSuccess: () => {
            queryClient.invalidateQueries(['products', 'stock-movements']);
            setShowBulkUpdateModal(false);
            setSelectedProducts([]);
            toast.success('Stoklar başarıyla güncellendi');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        },
    });

    // Toplu fiyat güncelle
    const bulkPriceMutation = useMutation({
        mutationFn: (updates: any[]) => stockService.updatePriceBulk(updates),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            setShowBulkUpdateModal(false);
            setSelectedProducts([]);
            toast.success('Fiyatlar başarıyla güncellendi');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        },
    });

    // Filtrelenmiş ürünler
    const filteredProducts = products.filter((product: Product) =>
        (product.Brand || '').toLowerCase().includes(search.toLowerCase()) ||
        (product.Code || '').toLowerCase().includes(search.toLowerCase()) ||
        (product.Description || '').toLowerCase().includes(search.toLowerCase())
    );

    // Excel şablonu indirme fonksiyonu
    const handleDownloadTemplate = async () => {
        try {
            const response = await productService.downloadTemplate();
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'urun_sablonu.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Şablon başarıyla indirildi');
        } catch (error: any) {
            console.error('Şablon indirme hatası:', error);
            toast.error('Şablon indirilirken bir hata oluştu');
        }
    };

    // Excel indirme fonksiyonu
    const handleExcelDownload = async () => {
        try {
            const response = await productService.downloadExcel();
            if (!response.data) {
                throw new Error('Excel verisi alınamadı');
            }

            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'urunler.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Excel dosyası başarıyla indirildi');
        } catch (error: any) {
            console.error('Excel indirme hatası:', error);
            toast.error('Excel dosyası indirilirken bir hata oluştu');
        }
    };

    // Excel dosyasını yükle
    const handleUpload = async () => {
        if (!uploadFile) {
            toast.error('Lütfen bir dosya seçin');
            return;
        }

        try {
            uploadMutation.mutate(uploadFile);
        } catch (error) {
            console.error('Excel yükleme hatası:', error);
            toast.error('Excel dosyası yüklenirken bir hata oluştu');
        }
    };

    const columns = [
        {
            header: 'Seç',
            cell: (row: Product) => (
                <input
                    type="checkbox"
                    checked={selectedProducts.some(p => p.ProductID === row.ProductID)}
                    onChange={(e) => handleProductSelect(row, e.target.checked)}
                    className="rounded border-gray-300"
                />
            ),
        },
        {
            header: 'Marka',
            cell: (row: Product) => row.Brand,
        },
        {
            header: 'Kod',
            cell: (row: Product) => row.Code,
        },
        {
            header: 'Model',
            cell: (row: Product) => row.Model || '-',
        },
        {
            header: 'Açıklama',
            cell: (row: Product) => row.Description,
        },
        {
            header: 'Stok',
            cell: (row: Product) => (
                <div className="flex items-center space-x-2">
                    <span className={row.Stock <= row.MinimumStock ? 'text-red-600 font-medium' : ''}>
                        {row.Stock}
                    </span>
                    <button
                        onClick={() => {
                            setSelectedProduct(row);
                            setShowStockMovementModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                    >
                        <ArrowPathIcon className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
        {
            header: 'Fiyat',
            cell: (row: Product) => (
                <div className="flex items-center space-x-2">
                    <span>{row.Price.toFixed(2)} ₺</span>
                    <button
                        onClick={() => {
                            setSelectedProduct(row);
                            setShowPriceHistoryModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                    >
                        <ClockIcon className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
        {
            header: 'İşlemler',
            cell: (row: Product) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-primary-600 hover:text-primary-900"
                    >
                        Düzenle
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="text-red-600 hover:text-red-900"
                    >
                        Sil
                    </button>
                </div>
            ),
        },
    ];

    const handleSubmit = (data: any) => {
        if (selectedProduct) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setSelectedProduct(products.find((product) => product.ProductID === id));
        setIsDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    // Event handler'lar
    const handleStockMovement = (data: any) => {
        stockMovementMutation.mutate({
            ...data,
            ProductID: selectedProduct?.ProductID,
        });
    };

    const handleMinimumStockUpdate = (data: { minimumStock: number }) => {
        if (selectedProduct) {
            minimumStockMutation.mutate({
                productId: selectedProduct.ProductID,
                minimumStock: data.minimumStock,
            });
        }
    };

    const handleBulkUpdate = (data: any) => {
        const updates = selectedProducts.map(product => ({
            productId: product.ProductID,
            ...(bulkUpdateType === 'stock'
                ? {
                      newStock: data.value,
                      description: 'Toplu stok güncellemesi',
                  }
                : {
                      newPrice: data.value,
                      reason: data.reason,
                  }),
        }));

        if (bulkUpdateType === 'stock') {
            bulkStockMutation.mutate(updates);
        } else {
            bulkPriceMutation.mutate(updates);
        }
    };

    const handleProductSelect = (product: Product, selected: boolean) => {
        if (selected) {
            setSelectedProducts(prev => [...prev, product]);
        } else {
            setSelectedProducts(prev => prev.filter(p => p.ProductID !== product.ProductID));
        }
    };

    return (
        <div className="space-y-4">
            <PageHeader
                title="Ürün Yönetimi"
                actions={
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            onClick={handleDownloadTemplate}
                            icon={<ArrowDownTrayIcon className="h-5 w-5" />}
                        >
                            Excel Şablonu İndir
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleExcelDownload}
                            icon={<ArrowDownTrayIcon className="h-5 w-5" />}
                        >
                            Excel İndir
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setShowUploadModal(true)}
                            icon={<ArrowUpTrayIcon className="h-5 w-5" />}
                        >
                            Excel Yükle
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setSelectedProduct(null);
                                setIsModalOpen(true);
                            }}
                            icon={<PlusIcon className="h-5 w-5" />}
                        >
                            Yeni Ürün
                        </Button>
                    </div>
                }
            />

            {/* Excel Yükleme Modal */}
            <Modal
                title="Excel Dosyası Yükle"
                isOpen={showUploadModal}
                onClose={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                }}
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ArrowUpTrayIcon className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Dosya seçmek için tıklayın</span>
                                </p>
                                <p className="text-xs text-gray-500">Excel dosyası (.xlsx)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept=".xlsx"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setUploadFile(file);
                                    }
                                }}
                            />
                        </label>
                    </div>
                    {uploadFile && (
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">{uploadFile.name}</span>
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setUploadFile(null)}
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowUploadModal(false);
                                setUploadFile(null);
                            }}
                        >
                            İptal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleUpload}
                            disabled={!uploadFile || uploadMutation.isLoading}
                            loading={uploadMutation.isLoading}
                        >
                            {uploadMutation.isLoading ? 'Yükleniyor...' : 'Yükle'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Arama ve Filtre */}
            <div className="flex items-center justify-between">
                <div className="w-72">
                    <Input
                        placeholder="Ürün ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="secondary"
                        onClick={() => setShowUploadModal(true)}
                    >
                        <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                        Excel Yükle
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleDownloadTemplate}
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Excel Şablonu İndir
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleExcelDownload}
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Ürünleri Excel Olarak İndir
                    </Button>
                </div>
            </div>

            {/* Tab İçerikleri */}
            {activeTab === 'products' ? (
                <Card>
                    <Table
                        columns={columns}
                        data={filteredProducts}
                        isLoading={isLoading}
                        emptyMessage="Ürün bulunamadı"
                    />
                </Card>
            ) : activeTab === 'movements' ? (
                <Card>
                    <StockMovementList
                        movements={stockMovements}
                        isLoading={isLoadingMovements}
                    />
                </Card>
            ) : (
                <Card>
                    <StockAlertList
                        alerts={stockAlerts}
                        isLoading={isLoadingAlerts}
                        onUpdateMinimumStock={(productId) => {
                            const product = products.find(p => p.ProductID === productId);
                            if (product) {
                                setSelectedProduct(product);
                                setShowMinimumStockModal(true);
                            }
                        }}
                    />
                </Card>
            )}

            {/* Modallar */}
            <StockMovementModal
                isOpen={showStockMovementModal}
                onClose={() => setShowStockMovementModal(false)}
                onSubmit={handleStockMovement}
                isSubmitting={stockMovementMutation.isLoading}
                productId={selectedProduct?.ProductID}
            />

            <MinimumStockModal
                isOpen={showMinimumStockModal}
                onClose={() => setShowMinimumStockModal(false)}
                onSubmit={handleMinimumStockUpdate}
                isSubmitting={minimumStockMutation.isLoading}
                currentMinimumStock={selectedProduct?.MinimumStock}
            />

            <BulkUpdateModal
                isOpen={showBulkUpdateModal}
                onClose={() => setShowBulkUpdateModal(false)}
                onSubmit={handleBulkUpdate}
                isSubmitting={bulkStockMutation.isLoading || bulkPriceMutation.isLoading}
                type={bulkUpdateType}
                selectedProducts={selectedProducts.map(p => ({
                    id: p.ProductID,
                    name: `${p.Brand} - ${p.Code}`,
                }))}
            />

            <Modal
                isOpen={showPriceHistoryModal}
                onClose={() => setShowPriceHistoryModal(false)}
                title="Fiyat Geçmişi"
            >
                <PriceHistoryList
                    history={priceHistory}
                    isLoading={isLoadingPriceHistory}
                />
            </Modal>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                        >
                            İptal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => document.forms[0].requestSubmit()}
                            isLoading={createMutation.isLoading || updateMutation.isLoading}
                        >
                            {selectedProduct ? 'Güncelle' : 'Oluştur'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Ürün Adı"
                            name="name"
                            defaultValue={selectedProduct?.name}
                        />
                        <Input
                            label="Açıklama"
                            name="description"
                            defaultValue={selectedProduct?.description}
                        />
                        <Input
                            label="Fiyat"
                            name="price"
                            type="number"
                            defaultValue={selectedProduct?.price}
                        />
                        <Input
                            label="Stok"
                            name="stock"
                            type="number"
                            defaultValue={selectedProduct?.stock}
                        />
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Ürünü Sil"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            İptal
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => deleteMutation.mutate(selectedProduct!.ProductID!)}
                            isLoading={deleteMutation.isLoading}
                        >
                            Sil
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-gray-500">
                    Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
            </Modal>
        </div>
    );
};

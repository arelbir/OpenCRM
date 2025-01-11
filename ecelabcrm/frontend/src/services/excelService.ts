import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const downloadExcel = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/excel/customers/template`, {
            responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'musteri_sablonu.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Excel şablonu indirilirken bir hata oluştu');
    }
};

export const importExcel = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_BASE_URL}/excel/customers/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (!response.data.success) {
            let errorMessage = 'Excel yüklenirken hatalar oluştu:\n';
            response.data.errors.forEach((error: any) => {
                errorMessage += `\nSatır ${error.row}: ${error.error}`;
            });
            throw new Error(errorMessage);
        }

        return response.data;
    } catch (error: any) {
        if (error.response?.data?.errors) {
            let errorMessage = 'Excel yüklenirken hatalar oluştu:\n';
            error.response.data.errors.forEach((error: any) => {
                errorMessage += `\nSatır ${error.row}: ${error.error}`;
            });
            throw new Error(errorMessage);
        }
        throw new Error(error.response?.data?.message || 'Excel yüklenirken bir hata oluştu');
    }
};

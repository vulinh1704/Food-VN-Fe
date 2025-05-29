import * as XLSX from 'xlsx';

export const exportToExcel = (data, columns, filename) => {
    // Transform data according to columns configuration
    const excelData = data.map(item => {
        const row = {};
        columns.forEach(col => {
            row[col.header] = col.accessor(item);
        });
        return row;
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save file
    XLSX.writeFile(wb, `${filename}.xlsx`);
}; 
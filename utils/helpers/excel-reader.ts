import * as XLSX from 'xlsx';

export class ExcelReader {
    private workbook: XLSX.WorkBook;
    private currentRows: Record<string, string>[] = [];
    private currentIndex = 0;

    constructor(private filePath: string) {
        this.workbook = XLSX.readFile(filePath);
    }

    /**
     * Select specific sheet from workbook. If sheet not exist, throwing en exception.
     * @param sheetName 
     * @param setValue 
     */
    selectDataSet(sheetName: string, setValue: number): void {
        const sheet = this.workbook.Sheets[sheetName];
        if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

        const data: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet);
        this.currentRows = data.filter(r => Number(r['Set']) === setValue);

        if (this.currentRows.length === 0) {
        throw new Error(`Set=${setValue} not found in sheet "${sheetName}"`);
        }

        this.currentIndex = 0; // Default to the first one
    }

    /**
     * Select current row, if multiple matches exist, index is updated 
     * @param index 
     */
    useRow(index: number): void {
        if (index < 0 || index >= this.currentRows.length) {
        throw new Error(`Index out of range. Found ${this.currentRows.length} row(s).`);
        }
        this.currentIndex = index;
    }

    /**
     * Gets value from cell, if not value, takes default value previously set
     * @param columnName 
     * @param defaultValue 
     * @returns 
     */
    getValue(columnName: string, defaultValue: string = ''): string {
        const row = this.currentRows[this.currentIndex];
        return row?.[columnName] ?? defaultValue;
    }

    /**
     * Get all row to use full data, without default value
     * @returns 
     */
    getAll(): Record<string, string> {
        return this.currentRows[this.currentIndex];
    }

    /* Example on TC
    const rowData = reader.getAll();
    for(const [key, value] of Object.entries(rowData)){
        console.log(`Field: ${key}, value: ${value}`);
    }
    */


    /**
     * Count number of rows filtered
     * @returns 
     */
    count(): number {
        return this.currentRows.length;
    }



}



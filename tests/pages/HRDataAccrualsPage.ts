import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../fixtures/BaseTest';
import { ExcelReader } from '../../utils/helpers/excel-reader';

export class HRDataAccrualsPage extends BasePage {
    private readonly name = "HR Data Accruals Page";
    
    constructor(page: Page) {
        super(page);
    }

    //--------------------------------------------------------------------------------------------
    // Page Header and Navigation Locators
    //--------------------------------------------------------------------------------------------

    private get accrualsHeader(): Locator {
        return this.page.getByRole('heading', { name: 'Accruals' });
    }

    private get accrualsHeaderLine(): Locator {
        return this.page.locator('app-accruals hr');
    }

    //--------------------------------------------------------------------------------------------
    // Date Range Filter Locators
    //--------------------------------------------------------------------------------------------

    private get fromDateField(): Locator {
        //return this.page.locator('//label[contains(text(), "From")]//following-sibling::*//input');
        return this.page.getByRole('combobox', { name: 'From' });
    }

    private get toDateField(): Locator {
        //return this.page.locator('//label[contains(text(), "To")]//following-sibling::*//input');
        return this.page.getByRole('combobox', { name: 'To' });
    }

    private get fromDateCalendar(): Locator {
        return this.page.locator('//p-datepicker//input').nth(0);
    }

    private get toDateCalendarIcon(): Locator {
        return this.page.locator('//p-datepicker//span').nth(1);
    }

    private get fromDateCalendarIcon(): Locator {
        return this.page.locator('//p-datepicker//span').nth(0);
    }

    private get toDateCalendar(): Locator {
        return this.page.locator('//p-datepicker//input').nth(1);
    }

    private get searchButton(): Locator {
        return this.page.getByRole('button', { name: 'Search' });
    }

    private get scrollToTopButton(): Locator {
        return this.page.getByRole('button', { name: 'Scroll to top of page' });
    }

    //--------------------------------------------------------------------------------------------
    // Table and Grid Locators
    //--------------------------------------------------------------------------------------------

    private get accrualsTable(): Locator {
        return this.page.locator('//app-table//table');
    }

    private get tableHeader(): Locator {
        return this.accrualsTable.locator('//thead//tr');
    }

    private get tableRows(): Locator {
        return this.accrualsTable.locator('//tbody//tr');
    }

    private getRowByIndex(index: number): Locator {
        return this.tableRows.nth(index);
    }

    // Column-specific locators
    private getAccrualTypeColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[1]');
    }

    private getEffectiveDateColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[2]');
    }

    private getUnitColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[3]');
    }

    private getValueColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[4]');
    }

    private getFrequencyColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[5]');
    }

    private getAmountColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[6]');
    }

    //--------------------------------------------------------------------------------------------
    // Calendar and Date Picker Locators
    //--------------------------------------------------------------------------------------------

    private get calendarPopup(): Locator {
        return this.page.locator('//p-calendar//div[@class="p-datepicker"]');
    }

    private get calendarHeader(): Locator {
        return this.calendarPopup.locator('//div[@class="p-datepicker-header"]');
    }

    private get previousMonthButton(): Locator {
        return this.calendarHeader.locator('//button[@class="p-datepicker-prev"]');
    }

    private get nextMonthButton(): Locator {
        return this.calendarHeader.locator('//button[@class="p-datepicker-next"]');
    }

    private get monthYearButton(): Locator {
        return this.calendarHeader.locator('//button[@class="p-datepicker-month"]');
    }

    private getCalendarDate(date: string): Locator {
        return this.calendarPopup.locator(`//td[@data-pc-section="day" and contains(@class, "p-datepicker-day") and text()="${date}"]`);
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods
    //--------------------------------------------------------------------------------------------

    @step('Navigate to HR Data > Accruals page')
    async goToHRDataAccrualsTab() {
        await this.selectTabMenu('HR DATA;ACCRUALS', true);
        await this.waitForPageLoad();
    }

    @step('Validate HR Data > Accruals page is visible')
    async validateAccrualsMenuVisibility() {
        await this.claimLevelMenuVisibility('HR DATA;ACCRUALS');
        await this.waitForPageLoad();
    }

    @step('Validate Accruals Page Header')
    async validateAccrualsPageHeader() {
        await expect(this.accrualsHeader, 'Accruals header should be visible').toBeVisible();
        await expect(this.accrualsHeaderLine, 'Header line should be visible').toBeVisible();
    }

    @step('Validate Date Range Filter Elements')
    async validateDateRangeFilterElements() {
        await expect(this.fromDateField, 'From date field should be visible').toBeVisible();
        await expect(this.toDateField, 'To date field should be visible').toBeVisible();
        await expect(this.fromDateCalendar, 'From date calendar button should be visible').toBeVisible();
        await expect(this.toDateCalendar, 'To date calendar button should be visible').toBeVisible();
        await expect(this.searchButton, 'Search button should be visible').toBeVisible();
    }

    @step('Validate Accruals Table Structure')
    async validateAccrualsTableStructure() {
        const expectedColumns = ['ACCRUAL TYPE', 'EFFECTIVE DATE', 'UNIT', 'VALUE', 'FREQUENCY', 'AMOUNT'];
        
        for (const column of expectedColumns) {
            const columnHeader = this.tableHeader.getByRole('columnheader', { name: column });
            await expect(columnHeader, `Column "${column}" should be visible`).toBeVisible();
        }
    }

    @step('Validate Accruals Table Data Format')
    async validateAccrualsTableDataFormat(rowIndex: number = 0) {
        // Validate date format for Effective Date
        const effectiveDate = this.getEffectiveDateColumn(rowIndex);
        const dateText = await effectiveDate.textContent();
        if (dateText && dateText.trim() !== '') {
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            expect(dateText.trim(), 'Effective date should be in MM/DD/YYYY format').toMatch(dateRegex);
        }

        // Validate Unit format (hours:days:months)
        const unitValue = this.getUnitColumn(rowIndex);
        const unitText = await unitValue.textContent();
        if (unitText && unitText.trim() !== '') {
            const unitRegex = /^\d+:\d{2}:\d{2}$/;
            expect(unitText.trim(), 'Unit should be in hours:days:months format').toMatch(unitRegex);
        }

        // Validate Amount format (numeric)
        const amountValue = this.getAmountColumn(rowIndex);
        const amountText = await amountValue.textContent();
        if (amountText && amountText.trim() !== '') {
            const amountRegex = /^\d+(\.\d{2})?$/;
            expect(amountText.trim(), 'Amount should be numeric').toMatch(amountRegex);
        }
    }

    @step('Validate Accrual Type Values')
    async validateAccrualTypeValues() {
        const rowCount = await this.tableRows.count();
        
        for (let i = 0; i < rowCount; i++) {
            const accrualType = this.getAccrualTypeColumn(i);
            const typeText = await accrualType.textContent();
            
            if (typeText && typeText.trim() !== '') {
                const validTypes = ['SICK', 'VAC', 'HOSP', 'PTO', 'CUSTOM'];
                const isValidType = validTypes.some(type => typeText.trim().toUpperCase().includes(type));
                expect(isValidType, `Accrual type "${typeText}" should be valid`).toBe(true);
            }
        }
    }

    @step('Validate Frequency Values')
    async validateFrequencyValues() {
        const rowCount = await this.tableRows.count();
        
        for (let i = 0; i < rowCount; i++) {
            const frequency = this.getFrequencyColumn(i);
            const frequencyText = await frequency.textContent();
            
            if (frequencyText && frequencyText.trim() !== '') {
                const validFrequencies = ['Monthly', 'Weekly', 'Yearly', 'Daily'];
                const isValidFrequency = validFrequencies.some(freq => frequencyText.trim().includes(freq));
                expect(isValidFrequency, `Frequency "${frequencyText}" should be valid`).toBe(true);
            }
        }
    }

    @step('Validate Scroll to Top Button')
    async validateScrollToTopButton() {
        await this.scrollToBottom();
        await expect(this.scrollToTopButton, 'Scroll to top button should be visible').toBeVisible();
    }

    @step('Validate Date Range Filter')
    async validateDateRangeFilter(criteria: string, expectedResult: number) {
        const rowElements = await this.tableRows.filter({ hasText: criteria });
        const rowCount = await rowElements.count();
        expect(rowCount, `Date range should retrun [${expectedResult}] row with criteria [${criteria}]`).toBe(expectedResult);
    }


    //--------------------------------------------------------------------------------------------
    // Action Methods
    //--------------------------------------------------------------------------------------------

    @step('Set From Date')
    async setFromDate(date: string) {
        await this.fromDateCalendar.click();
        await this.fromDateCalendar.clear();
        await this.fromDateCalendar.type(date);
        //await this.waitForCalendarToOpen();
        //await this.selectCalendarDate(date);
    }

    @step('Set To Date')
    async setToDate(date: string) {
        await this.toDateCalendar.click();
        await this.toDateCalendar.clear();
        await this.toDateCalendar.type(date);
        //await this.waitForCalendarToOpen();
        //await this.selectCalendarDate(date);
    }

    @step('Set Date Range')
    async setDateRange(fromDate: string, toDate: string) {
        await this.setFromDate(fromDate);
        await this.setToDate(toDate);
    }

    @step('Click Search Button')
    async clickSearchButton() {
        await expect(this.searchButton, 'Search button should be visible').toBeVisible();
        await this.searchButton.click();
        await this.waitForPageLoad();
    }

    @step('Click Scroll to Top Button')
    async clickScrollToTopButton() {
        await expect(this.scrollToTopButton, 'Scroll to top button should be visible').toBeVisible();
        await this.scrollToTopButton.click();
    }

    @step('Wait for Calendar to Open')
    async waitForCalendarToOpen() {
        await expect(this.calendarPopup, 'Calendar popup should be visible').toBeVisible();
    }

    @step('Select Calendar Date')
    async selectCalendarDate(date: string) {
        const day = date.split('/')[1];
        const calendarDate = this.getCalendarDate(day);
        await expect(calendarDate, `Calendar date ${day} should be visible`).toBeVisible();
        await calendarDate.click();
    }

    @step('Navigate to Previous Month')
    async navigateToPreviousMonth() {
        await this.previousMonthButton.click();
        await this.delay(1000);
    }

    @step('Navigate to Next Month')
    async navigateToNextMonth() {
        await this.nextMonthButton.click();
        await this.delay(1000);
    }

    @step('Click Month/Year Button')
    async clickMonthYearButton() {
        await this.monthYearButton.click();
        await this.delay(1000);
    }

    //--------------------------------------------------------------------------------------------
    // Data-Driven Testing Methods
    //--------------------------------------------------------------------------------------------

    @step('Search Accruals with Data-Driven Criteria')
    async searchAccrualsWithDataDrivenCriteria(dataset: number) {
        const reader = new ExcelReader(`${this.driverPath}${this.driverFile}`);
        reader.selectDataSet('HR_Accruals_TestData', dataset);
        
        for (let row = 0; row < reader.count(); row++) {
            reader.useRow(row);
            
            const fromDate = reader.getValue('FromDate', '');
            const toDate = reader.getValue('ToDate', '');
            
            if (fromDate && toDate) {
                await this.setDateRange(fromDate, toDate);
                await this.clickSearchButton();
                
                // Validate results based on expected result
                const expectedResult = reader.getValue('ExpectedResult', '');
                if (expectedResult === 'Success') {
                    await this.validateAccrualsTableStructure();
                    await this.validateAccrualTypeValues();
                    await this.validateFrequencyValues();
                }
            }
        }
    }

    @step('Validate Accruals Data with Excel Data')
    async validateAccrualsDataWithExcelData(dataset: number) {
        const reader = new ExcelReader(`${this.driverPath}${this.driverFile}`);
        reader.selectDataSet('HR_Accruals_TestData', dataset);
        
        for (let row = 0; row < reader.count(); row++) {
            reader.useRow(row);
            
            const expectedAccrualType = reader.getValue('AccrualType', '');
            const expectedEffectiveDate = reader.getValue('EffectiveDate', '');
            const expectedUnit = reader.getValue('Unit', '');
            const expectedValue = reader.getValue('Value', '');
            const expectedFrequency = reader.getValue('Frequency', '');
            const expectedAmount = reader.getValue('Amount', '');
            
            // Find matching row in table
            const rowCount = await this.tableRows.count();
            let found = false;
            
            for (let i = 0; i < rowCount; i++) {
                const actualAccrualType = await this.getAccrualTypeColumn(i).textContent();
                const actualEffectiveDate = await this.getEffectiveDateColumn(i).textContent();
                
                if (actualAccrualType?.trim() === expectedAccrualType && 
                    actualEffectiveDate?.trim() === expectedEffectiveDate) {
                    
                    // Validate all fields for this row
                    await this.validateRowData(i, expectedAccrualType, expectedEffectiveDate, 
                                            expectedUnit, expectedValue, expectedFrequency, expectedAmount);
                    found = true;
                    break;
                }
            }
            
            if (!found && expectedAccrualType) {
                throw new Error(`Expected accrual data not found: ${expectedAccrualType} - ${expectedEffectiveDate}`);
            }
        }
    }

    @step('Validate Row Data')
    async validateRowData(rowIndex: number, expectedAccrualType: string, expectedEffectiveDate: string,
                         expectedUnit: string, expectedValue: string, expectedFrequency: string, expectedAmount: string) {
        
        if (expectedAccrualType) {
            const actualAccrualType = await this.getAccrualTypeColumn(rowIndex).textContent();
            expect(actualAccrualType?.trim(), 'Accrual type should match expected value').toBe(expectedAccrualType);
        }
        
        if (expectedEffectiveDate) {
            const actualEffectiveDate = await this.getEffectiveDateColumn(rowIndex).textContent();
            expect(actualEffectiveDate?.trim(), 'Effective date should match expected value').toBe(expectedEffectiveDate);
        }
        
        if (expectedUnit) {
            const actualUnit = await this.getUnitColumn(rowIndex).textContent();
            expect(actualUnit?.trim(), 'Unit should match expected value').toBe(expectedUnit);
        }
        
        if (expectedValue) {
            const actualValue = await this.getValueColumn(rowIndex).textContent();
            expect(actualValue?.trim(), 'Value should match expected value').toBe(expectedValue);
        }
        
        if (expectedFrequency) {
            const actualFrequency = await this.getFrequencyColumn(rowIndex).textContent();
            expect(actualFrequency?.trim(), 'Frequency should match expected value').toBe(expectedFrequency);
        }
        
        if (expectedAmount) {
            const actualAmount = await this.getAmountColumn(rowIndex).textContent();
            expect(actualAmount?.trim(), 'Amount should match expected value').toBe(expectedAmount);
        }
    }

    //--------------------------------------------------------------------------------------------
    // Data Retrieval Methods
    //--------------------------------------------------------------------------------------------

    @step('Get Table Row Count')
    async getTableRowCount(): Promise<number> {
        return await this.tableRows.count();
    }

    @step('Get Accrual Type by Row Index')
    async getAccrualTypeByRowIndex(rowIndex: number): Promise<string> {
        const text = await this.getAccrualTypeColumn(rowIndex).textContent();
        return text?.trim() || '';
    }

    @step('Get Effective Date by Row Index')
    async getEffectiveDateByRowIndex(rowIndex: number): Promise<string> {
        const text = await this.getEffectiveDateColumn(rowIndex).textContent();
        return text?.trim() || '';
    }

    @step('Get Unit by Row Index')
    async getUnitByRowIndex(rowIndex: number): Promise<string> {
        const text = await this.getUnitColumn(rowIndex).textContent();
        return text?.trim() || '';
    }

    @step('Get Value by Row Index')
    async getValueByRowIndex(rowIndex: number): Promise<string> {
        const text = await this.getValueColumn(rowIndex).textContent();
        return text?.trim() || '';
    }

    @step('Get Frequency by Row Index')
    async getFrequencyByRowIndex(rowIndex: number): Promise<string> {
        const text = await this.getFrequencyColumn(rowIndex).textContent();
        return text?.trim() || '';
    }

    @step('Get Amount by Row Index')
    async getAmountByRowIndex(rowIndex: number): Promise<string> {
        const text = await this.getAmountColumn(rowIndex).textContent();
        return text?.trim() || '';
    }

    //--------------------------------------------------------------------------------------------
    // Comprehensive Validation Methods
    //--------------------------------------------------------------------------------------------

    @step('Validate Complete Accruals Page')
    async validateCompleteAccrualsPage() {
        await this.validateAccrualsPageHeader();
        await this.validateDateRangeFilterElements();
        await this.validateAccrualsTableStructure();
        await this.validateScrollToTopButton();
    }

    @step('Validate Accruals Data Integrity')
    async validateAccrualsDataIntegrity() {
        const rowCount = await this.getTableRowCount();
        
        for (let i = 0; i < rowCount; i++) {
            await this.validateAccrualsTableDataFormat(i);
        }
        
        await this.validateAccrualTypeValues();
        await this.validateFrequencyValues();
    }

    @step('Test Date Range Filtering')
    async testDateRangeFiltering(fromDate: string, toDate: string) {
        await this.setDateRange(fromDate, toDate);
        await this.clickSearchButton();
        
        // Validate that all displayed rows fall within the date range
        const rowCount = await this.getTableRowCount();
        
        for (let i = 0; i < rowCount; i++) {
            const effectiveDate = await this.getEffectiveDateByRowIndex(i);
            if (effectiveDate) {
                const rowDate = new Date(effectiveDate);
                const from = new Date(fromDate);
                const to = new Date(toDate);
                
                expect(rowDate >= from && rowDate <= to, 
                    `Row ${i + 1} effective date ${effectiveDate} should be within range ${fromDate} - ${toDate}`).toBe(true);
            }
        }
    }

    //--------------------------------------------------------------------------------------------
    // Public Accessor Methods for Test Files
    //--------------------------------------------------------------------------------------------

    async getFromDateFieldValue(): Promise<string> {
        return await this.fromDateField.inputValue();
    }

    async getToDateFieldValue(): Promise<string> {
        return await this.toDateField.inputValue();
    }

    getPage(): Page {
        return this.page;
    }

    getFromDateCalendar(): Locator {
        return this.fromDateCalendarIcon;
    }

    getToDateCalendar(): Locator {
        return this.toDateCalendarIcon;
    }

    getSearchButton(): Locator {
        return this.searchButton;
    }

    getAccrualsTable(): Locator {
        return this.accrualsTable;
    }

    //--------------------------------------------------------------------------------------------
    // Test Helper Methods - Encapsulate page operations
    //--------------------------------------------------------------------------------------------

    async getColumnHeaderByName(columnName: string): Promise<Locator> {
        return this.page.getByRole('columnheader', { name: columnName });
    }

    getTableHeaderLocator(): Locator {
        return this.page.locator('//app-table//thead//tr');
    }

    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    async getScrollPosition(): Promise<number> {
        return await this.page.evaluate(() => window.pageYOffset);
    }

    async pressTabKey(): Promise<void> {
        await this.page.keyboard.press('Tab');
    }

    @step('Validate Column Header Visibility')
    async validateColumnHeaderVisibility(columnName: string): Promise<void> {
        const columnHeader = await this.getColumnHeaderByName(columnName);
        await expect(columnHeader, `Column "${columnName}" should be visible`).toBeVisible();
    }

    @step('Test Scroll to Top Functionality')
    async testScrollToTopFunctionality(): Promise<void> {
        // Scroll down to make button visible
        await this.scrollToBottom();
        await this.delay(1000);
        
        // Click scroll to top button
        await this.clickScrollToTopButton();
        
        // Validate page scrolled to top
        const scrollPosition = await this.getScrollPosition();
        expect(scrollPosition, 'Page should be scrolled to top').toBe(0);
    }

    @step('Test Keyboard Navigation')
    async testKeyboardNavigation(): Promise<void> {
        // Test keyboard navigation through form elements
        await this.getFromDateCalendar().focus();
        await this.pressTabKey();
        
        // Should move to next focusable element
        const toDateCalendar = this.getToDateCalendar();
        await expect(toDateCalendar, 'To date calendar should be focused').toBeFocused();
        
        await this.pressTabKey();
        
        // Should move to search button
        const searchButton = this.getSearchButton();
        await expect(searchButton, 'Search button should be focused').toBeFocused();
    }

    @step('Fill Date Fields with Malicious Input')
    async fillDateFieldsWithMaliciousInput(input: string): Promise<void> {
        // For security testing - try to fill date fields with malicious input
        try {
            await this.fromDateField.fill(input);
            await this.toDateField.fill(input);
        } catch (error) {
            // Expected behavior - should reject malicious input
            throw error;
        }
    }
}

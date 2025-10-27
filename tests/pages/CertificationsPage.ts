import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../fixtures/BaseTest';

export class CertificationsPage extends BasePage {
    private readonly name = "Certifications Page";
    
    constructor(page: Page) {
        super(page);
    }

    //--------------------------------------------------------------------------------------------
    // Page Header and Navigation Locators
    //--------------------------------------------------------------------------------------------

    private get certificationsHeader(): Locator {
        return this.page.getByRole('heading', { name: 'Certifications'});
    }

    private get certificationsHeaderLine(): Locator {
        return this.page.locator('//*[@label="Certifications"]//hr');
    }


    //--------------------------------------------------------------------------------------------
    // Grid and Table Locators
    //--------------------------------------------------------------------------------------------

    private get certificationsGrid(): Locator {
        return this.page.locator('//div[contains(@class, "grid") or contains(@class, "table")]');
    }

    private get gridHeader(): Locator {
        return this.page.locator('//thead//tr');
    }

    private get gridRows(): Locator {
        return this.page.locator('//tbody//tr');
    }

    private getRowByIndex(index: number): Locator {
        return this.gridRows.nth(index);
    }

    private getExpandButton(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td//button[contains(@aria-label, "Expand")]');
    }

    private getCollapseButton(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td//button[contains(@aria-label, "Collapse")]');
    }

    private getRelationshipColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[2]'); // Relationship column
    }

    private getCertificationDatesColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[3]'); // Certification Dates column
    }

    private getStatusColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[4]'); // Status column
    }

    private getReasonColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[5]'); // Reason column
    }

    private getIntermittentColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[6]'); // Intermittent column
    }

    private getCreatedColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[7]'); // Created column
    }

    //--------------------------------------------------------------------------------------------
    // Filter and Count Locators
    //--------------------------------------------------------------------------------------------

    private getfilterButton(): Locator {
        return this.page.getByRole('button', { name: 'Filter' });
    }

    private getFilterInput(): Locator {
        return this.page.getByRole('textbox', { name: 'Search input' });
    }

    private getFilterCleaner(): Locator {
        return this.page.locator('//app-table//p-inputicon');
    }

    private get certificationCount(): Locator {
        return this.page.locator('//app-table//div[contains(@class, " tw-font-bold tw-text")]');
    }
    

    //--------------------------------------------------------------------------------------------
    // Pagination Locators
    //--------------------------------------------------------------------------------------------

    private get paginationSection(): Locator {
        return this.page.locator('p-paginator');
    }

    private get firstPageButton(): Locator {
        return this.paginationSection.getByRole('button', { name: 'First Page' });
    }

    private get nextPageButton(): Locator {
        return this.paginationSection.getByRole('button', { name: 'Next Page' });
    }

    private get previousPageButton(): Locator {
        return this.paginationSection.getByRole('button', { name: 'Previous Page' });
    }

    private get lastPageButton(): Locator {
        return this.paginationSection.getByRole('button', { name: 'Last Page' });
    }

    private get pageNumbers(): Locator {
        return this.paginationSection.locator('//button[contains(@class, "page")]');
    }

    private get currentPageSelected(): Locator {
        return this.paginationSection.locator('span button[aria-current = "page"]');
    }

    public getPaginationSection(): Locator {
        return this.paginationSection;
    }

    public getpageNumbers(pageNumber:string): Locator {
        return this.paginationSection.getByRole('button', { name: pageNumber });
    }


    //--------------------------------------------------------------------------------------------
    // Expanded Row Section Locators
    //--------------------------------------------------------------------------------------------


    // Certification Section
    private getCertificationSection(rowIndex: number): Locator {
        return this.page.locator('//div[*[contains(@label, "Certification")]]').nth(rowIndex);
    }


    private getCertificationField(rowIndex: number, fieldName: string): Locator {
        return this.getCertificationSection(rowIndex).locator(`//div[contains(text(), "${fieldName}")]//following-sibling::div`);
    }


    

    // Clarification Section
    private getClarificationSection(rowIndex: number): Locator {
        return this.page.locator('//div[*[contains(@label, "Clarification")]]').nth(rowIndex);
    }


    private getClarificationField(rowIndex: number, fieldName: string): Locator {
        return this.getClarificationSection(rowIndex).locator(`//div[contains(text(), "${fieldName}")]//following-sibling::div`);
    }

    // Intermittent Absence Frequency Section
    private getIntermittentSection(rowIndex: number): Locator {
        return this.page.locator('//div[*[contains(@label, "Intermittent")]]').nth(rowIndex);
    }


    private getIntermittentField(rowIndex: number, fieldName: string): Locator {
        return this.getIntermittentSection(rowIndex).locator(`//div[contains(text(), "${fieldName}")]//following-sibling::div`);
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods
    //--------------------------------------------------------------------------------------------

    @step('Validate Certifications Page Header')
    async validateCertificationsPageHeader() {
        await expect(this.certificationsHeader, 'Certifications header should be visible').toBeVisible();
        await expect(this.certificationsHeaderLine, 'Header line should be visible').toBeVisible();
    }

    @step('Validate Grid Structure and Columns')
    async validateGridStructure() {
        const expectedColumns = ['RELATIONSHIP', 'CERTIFICATION DATES', 'STATUS', 'REASON', 'INTERMITTENT', 'CREATED'];
        
        for (const column of expectedColumns) {
            //const columnHeader = this.gridHeader.locator(`//th[contains(text(), "${column}")]`);
            const columnHeader = this.gridHeader.getByRole('columnheader', { name: column });
            await expect(columnHeader, `Column "${column}" should be visible`).toBeVisible();
        }
    }

    @step('Validate Grid Row Data Format')
    async validateGridRowDataFormat(rowIndex: number = 0) {
        // Validate date format for Certification Dates
        const certificationDates = this.getCertificationDatesColumn(rowIndex);
        const datesText = await certificationDates.textContent();
        if (datesText && datesText.trim() !== '') {
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{1,2}\/\d{4}$/;
            expect(datesText.trim(), 'Certification dates should be in MM/DD/YYYY - MM/DD/YYYY format').toMatch(dateRegex);
        }

        // Validate date format for Created column
        const createdDate = this.getCreatedColumn(rowIndex);
        const createdText = await createdDate.textContent();
        if (createdText && createdText.trim() !== '') {
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            expect(createdText.trim(), 'Created date should be in MM/DD/YYYY format').toMatch(dateRegex);
        }

        // Validate Intermittent column contains Yes/No
        const intermittentValue = this.getIntermittentColumn(rowIndex);
        const intermittentText = await intermittentValue.textContent();
        if (intermittentText && intermittentText.trim() !== '') {
            expect(intermittentText.trim(), 'Intermittent should be Yes or No').toMatch(/^(Yes|No)$/);
        }
    }

    @step('Validate Certification Count Display')
    async validateCertificationCountDisplay() {
        await expect(this.certificationCount, 'Certification count should be visible').toBeVisible();
        
        const countText = await this.certificationCount.textContent();
        const trimmedText = countText?.trim();
        const countRegex = /^\d+\s+certification(s)?$/;
        expect(trimmedText, 'Certification count should be in format "X certification(s)"').toMatch(countRegex);
    }


    @step('Validate Certification Section Fields')
    async validateCertificationSectionFields(rowIndex: number = 0) {
        const certificationFields = [
            'Status', 'Substatus', 'Begin date', 'End date', 'Date sent', 'Date received', 'Date reviewed', 'Date due'
        ];

        for (const field of certificationFields) {
            const fieldElement = this.getCertificationField(rowIndex, field);
            await expect(fieldElement, `Certification field "${field}" should be visible`).toBeVisible();
        }
    }

    @step('Validate Clarification Section Visibility')
    async validateClarificationSectionVisibility(rowIndex: number = 0) {
        const clarificationSection = this.getClarificationSection(rowIndex);
        const isVisible = await clarificationSection.isVisible();
        
        if (isVisible) {
            await expect(this.getClarificationSection(rowIndex), 'Clarification section should be visible').toBeVisible();
            
            const clarificationFields = [
                'Type', 'Reason', 'Date sent', 'Date received', 
                'Date reviewed', 'Date due'
            ];

            for (const field of clarificationFields) {
                const fieldElement = this.getClarificationField(rowIndex, field);
                await expect.soft(fieldElement, `Clarification field "${field}" should be visible`).toBeVisible();
            }
        }
    }

    @step('Validate Intermittent Absence Frequency Section')
    async validateIntermittentAbsenceFrequencySection(rowIndex: number = 0) {
        await expect(this.getIntermittentSection(rowIndex), 'Intermittent section should be visible').toBeVisible();
        
        const intermittentFields = ['Incapacity/Care', 'Treatment/Appointments'];
        
        for (const field of intermittentFields) {
            const fieldElement = this.getIntermittentField(rowIndex, field);
            await expect(fieldElement, `Intermittent field "${field}" should be visible`).toBeVisible();
        }
    }

    @step('Validate Date Format in Expanded Sections')
    async validateDateFormatInExpandedSections(rowIndex: number = 0, sectionName: string) {
        const dateFields = [
            { section: 'certification', fields: ['Begin date', 'End date', 'Date sent', 'Date received', 'Date reviewed', 'Date due'] },
            { section: 'clarification', fields: ['Date sent', 'Date received', 'Date reviewed', 'Date due'] }
        ];
        
        // Find the section to validate based on the sectionName parameter
        const targetSection = dateFields.find(section => section.section === sectionName.toLowerCase());
        
        if (!targetSection) {
            throw new Error(`Invalid section name: ${sectionName}. Valid options are 'certification' or 'clarification'`);
        }

        // Validate only the specified section
        for (const field of targetSection.fields) {
            const fieldElement = targetSection.section === 'certification' 
                ? this.getCertificationField(rowIndex, field)
                : this.getClarificationField(rowIndex, field);
            
            const fieldText = await fieldElement.textContent();
            if (fieldText && fieldText.trim() !== '') {
                const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                expect.soft(fieldText.trim(), `${targetSection.section} ${field} should be in MM/DD/YYYY format`).toMatch(dateRegex);
            } else {
                console.log(`Warning: ${targetSection.section} ${field} is empty`);
            }
        }
    }

    @step('Validate Filter Functionality')
    async validateFilterFunctionality(filterType: string, filterValue: string, cleanFilter = true) {
        const filterButton = this.getfilterButton();
        const filterInput = this.getFilterInput();
        await expect(filterButton, `Filter button should be visible`).toBeVisible();
        

        await filterButton.click();
        await filterInput.fill(filterValue);
        await this.page.keyboard.press('Enter');
        
        // Validate filtered results
        const filteredRows = this.gridRows;
        const rowCount = await filteredRows.count();
        expect(rowCount, `Should have filtered results for ${filterType}`).toBeGreaterThan(0);

        if(cleanFilter){
            const filterCleaner = this.getFilterCleaner();
            await filterCleaner.click();
        }
        await this.delay(2000);        
    }

    @step('Validate Pagination Controls')
    async validatePaginationControls() {
        await expect(this.paginationSection, 'Pagination section should be visible').toBeVisible();
        
        // Check if pagination is needed (more than one page)
        const pageNumbers = this.pageNumbers;
        const pageCount = await pageNumbers.count();
        
        if (pageCount > 1) {
            await expect(this.firstPageButton, 'First page button should be visible').toBeVisible();
            await expect(this.nextPageButton, 'Next page button should be visible').toBeVisible();
            await expect(this.previousPageButton, 'Previous page button should be visible').toBeVisible();
            await expect(this.lastPageButton, 'Last page button should be visible').toBeVisible();
        }
    }


    //--------------------------------------------------------------------------------------------
    // Action Methods
    //--------------------------------------------------------------------------------------------

    @step('Navigate to Certifications Tab')
    async navigateToCertificationsTab() {
        await this.selectTabMenu('DETAILS;CERTIFICATIONS', true);
        await this.waitForPageLoad();
        await this.validateCertificationsPageHeader();
    }

    @step('Expand Certification Row')
    async expandCertificationRow(rowIndex: number = 0) {
        // Click expand button
        await this.getExpandButton(rowIndex).click();
        
        // Validate sections are visible
        await expect(this.getCertificationSection(rowIndex), 'Certification section should be visible').toBeVisible();
    }

    @step('Collapse Certification Row')
    async collapseCertificationRow(rowIndex: number = 0) {
        await this.getCollapseButton(rowIndex).click();
        // Validate sections are hidden
        await expect(this.getCertificationSection(rowIndex), 'Certification section should be hidden').toBeHidden();
    }

    @step('Filter Certifications')
    async filterCertifications(filterType: string, filterValue: string, cleanFilter = true) {
        await this.validateFilterFunctionality(filterType, filterValue, cleanFilter);
    }

    @step('Navigate to Next Page')
    async navigateToNextPage() {
        await expect(this.nextPageButton, 'Next page button should be visible').toBeVisible();
        await this.nextPageButton.click();
        await this.delay(2000);
    }

    @step('Navigate to Previous Page')
    async navigateToPreviousPage() {
        await expect(this.previousPageButton, 'Previous page button should be visible').toBeVisible();
        await this.previousPageButton.click();
        await this.delay(2000);
    }

    @step('Navigate to Specific Page')
    async navigateToSpecificPage(pageNumber: number) {
        const pageButton = this.pageNumbers.nth(pageNumber - 1);
        await expect(pageButton, `Page ${pageNumber} button should be visible`).toBeVisible();
        await pageButton.click();
        await this.delay(2000);
    }


    //--------------------------------------------------------------------------------------------
    // Data Retrieval Methods
    //--------------------------------------------------------------------------------------------

    @step('Get Certification Count')
    async getCertificationCount(): Promise<number> {
        const countText = await this.certificationCount.textContent();
        const match = countText?.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    @step('Get Grid Row Count')
    async getGridRowCount(): Promise<number> {
        return await this.gridRows.count();
    }





    @step('Get Cuurent Page Number Selected')
    async getCurrentPageNumber(): Promise<string> {
        await expect(this.currentPageSelected, 'Certification count should be visible').toBeVisible();
        const countText = await this.currentPageSelected.textContent();
        return countText?.trim() || '';
    }

    //--------------------------------------------------------------------------------------------
    // Comprehensive Validation Methods
    //--------------------------------------------------------------------------------------------


    @step('Validate Expanded Row Complete Data')
    async validateExpandedRowCompleteData(rowIndex: number = 0) {
        // Expand the row first
        await this.expandCertificationRow(rowIndex);
        
        // Validate all three sections
        await this.validateCertificationSectionFields(rowIndex);
        await this.validateClarificationSectionVisibility(rowIndex);
        await this.validateIntermittentAbsenceFrequencySection(rowIndex);
        
        // Validate date formats for both sections
        await this.validateDateFormatInExpandedSections(rowIndex, 'certification');
        await this.validateDateFormatInExpandedSections(rowIndex, 'clarification');
    }
}

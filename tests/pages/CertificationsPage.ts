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

    private get scrollToTopLink(): Locator {
        return this.page.getByRole('button', { name: 'Scroll to top of page' });
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
        return this.getRowByIndex(rowIndex).locator('//td[1]//button[contains(@class, "expand") or contains(text(), ">")]');
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

    private get filterSection(): Locator {
        return this.page.locator('//div[contains(@class, "filter") or contains(@class, "search")]');
    }

    private get certificationCount(): Locator {
        return this.page.locator('//p[contains(text(), "certification")]');
    }

    private getFilterInput(filterType: string): Locator {
        return this.page.locator(`//input[@placeholder*="${filterType}" or @name*="${filterType}"]`);
    }

    //--------------------------------------------------------------------------------------------
    // Pagination Locators
    //--------------------------------------------------------------------------------------------

    private get paginationSection(): Locator {
        return this.page.locator('//div[contains(@class, "pagination")]');
    }

    private get nextPageButton(): Locator {
        return this.paginationSection.locator('//button[contains(text(), "Next") or contains(@class, "next")]');
    }

    private get previousPageButton(): Locator {
        return this.paginationSection.locator('//button[contains(text(), "Previous") or contains(@class, "prev")]');
    }

    private get pageNumbers(): Locator {
        return this.paginationSection.locator('//button[contains(@class, "page")]');
    }

    //--------------------------------------------------------------------------------------------
    // Expanded Row Section Locators
    //--------------------------------------------------------------------------------------------

    private getExpandedRowSections(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//div[contains(@class, "expanded-content")]');
    }

    // Certification Section
    private getCertificationSection(rowIndex: number): Locator {
        return this.getExpandedRowSections(rowIndex).locator('//div[contains(@class, "certification-section")]');
    }

    private get certificationSectionHeader(): Locator {
        return this.page.locator('//div[contains(@class, "section-header") and contains(text(), "CERTIFICATION")]');
    }

    private getCertificationField(rowIndex: number, fieldName: string): Locator {
        return this.getCertificationSection(rowIndex).locator(`//div[contains(text(), "${fieldName}")]//following-sibling::div`);
    }

    // Clarification Section
    private getClarificationSection(rowIndex: number): Locator {
        return this.getExpandedRowSections(rowIndex).locator('//div[contains(@class, "clarification-section")]');
    }

    private get clarificationSectionHeader(): Locator {
        return this.page.locator('//div[contains(@class, "section-header") and contains(text(), "CLARIFICATION")]');
    }

    private getClarificationField(rowIndex: number, fieldName: string): Locator {
        return this.getClarificationSection(rowIndex).locator(`//div[contains(text(), "${fieldName}")]//following-sibling::div`);
    }

    // Intermittent Absence Frequency Section
    private getIntermittentSection(rowIndex: number): Locator {
        return this.getExpandedRowSections(rowIndex).locator('//div[contains(@class, "intermittent-section")]');
    }

    private get intermittentSectionHeader(): Locator {
        return this.page.locator('//div[contains(@class, "section-header") and contains(text(), "INTERMITTENT ABSENCE FREQUENCY")]');
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

    @step('Validate Row Expansion Functionality')
    async validateRowExpansionFunctionality(rowIndex: number = 0) {
        // Click expand button
        await this.getExpandButton(rowIndex).click();
        
        // Validate sections are visible
        await expect(this.getCertificationSection(rowIndex), 'Certification section should be visible').toBeVisible();
        await expect(this.certificationSectionHeader, 'Certification section header should be visible').toBeVisible();
    }

    @step('Validate Certification Section Fields')
    async validateCertificationSectionFields(rowIndex: number = 0) {
        const certificationFields = [
            'Status', 'Substatus', 'Begin date', 'End date', 
            'Date sent', 'Date received', 'Date reviewed', 'Date due'
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
            await expect(this.clarificationSectionHeader, 'Clarification section header should be visible').toBeVisible();
            
            const clarificationFields = [
                'Type', 'Reason', 'Date sent', 'Date received', 
                'Date reviewed', 'Date due'
            ];

            for (const field of clarificationFields) {
                const fieldElement = this.getClarificationField(rowIndex, field);
                await expect(fieldElement, `Clarification field "${field}" should be visible`).toBeVisible();
            }
        }
    }

    @step('Validate Intermittent Absence Frequency Section')
    async validateIntermittentAbsenceFrequencySection(rowIndex: number = 0) {
        await expect(this.getIntermittentSection(rowIndex), 'Intermittent section should be visible').toBeVisible();
        await expect(this.intermittentSectionHeader, 'Intermittent section header should be visible').toBeVisible();
        
        const intermittentFields = ['Incapacity/Care', 'Treatment/Appointments'];
        
        for (const field of intermittentFields) {
            const fieldElement = this.getIntermittentField(rowIndex, field);
            await expect(fieldElement, `Intermittent field "${field}" should be visible`).toBeVisible();
        }
    }

    @step('Validate Date Format in Expanded Sections')
    async validateDateFormatInExpandedSections(rowIndex: number = 0) {
        const dateFields = [
            { section: 'certification', fields: ['Begin date', 'End date', 'Date sent', 'Date received', 'Date reviewed', 'Date due'] },
            { section: 'clarification', fields: ['Date sent', 'Date received', 'Date reviewed', 'Date due'] }
        ];

        for (const section of dateFields) {
            for (const field of section.fields) {
                const fieldElement = section.section === 'certification' 
                    ? this.getCertificationField(rowIndex, field)
                    : this.getClarificationField(rowIndex, field);
                
                const fieldText = await fieldElement.textContent();
                if (fieldText && fieldText.trim() !== '') {
                    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                    expect(fieldText.trim(), `${section.section} ${field} should be in MM/DD/YYYY format`).toMatch(dateRegex);
                }
            }
        }
    }

    @step('Validate Filter Functionality')
    async validateFilterFunctionality(filterType: string, filterValue: string) {
        const filterInput = this.getFilterInput(filterType);
        await expect(filterInput, `Filter input for ${filterType} should be visible`).toBeVisible();
        
        await filterInput.fill(filterValue);
        await this.page.keyboard.press('Enter');
        
        // Validate filtered results
        const filteredRows = this.gridRows;
        const rowCount = await filteredRows.count();
        expect(rowCount, `Should have filtered results for ${filterType}`).toBeGreaterThan(0);
    }

    @step('Validate Pagination Controls')
    async validatePaginationControls() {
        await expect(this.paginationSection, 'Pagination section should be visible').toBeVisible();
        
        // Check if pagination is needed (more than one page)
        const pageNumbers = this.pageNumbers;
        const pageCount = await pageNumbers.count();
        
        if (pageCount > 1) {
            await expect(this.nextPageButton, 'Next page button should be visible').toBeVisible();
            await expect(this.previousPageButton, 'Previous page button should be visible').toBeVisible();
        }
    }

    @step('Validate Scroll to Top Functionality')
    async validateScrollToTopFunctionality() {
        // Scroll down first
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        // Click scroll to top link
        await expect(this.scrollToTopLink, 'Scroll to top link should be visible').toBeVisible();
        await this.scrollToTopLink.click();
        
        // Validate we're at the top
        const scrollPosition = await this.page.evaluate(() => window.scrollY);
        expect(scrollPosition, 'Should be at the top of the page').toBe(0);
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
        await this.getExpandButton(rowIndex).click();
        await this.validateRowExpansionFunctionality(rowIndex);
    }

    @step('Collapse Certification Row')
    async collapseCertificationRow(rowIndex: number = 0) {
        await this.getExpandButton(rowIndex).click();
        // Validate sections are hidden
        await expect(this.getCertificationSection(rowIndex), 'Certification section should be hidden').toBeHidden();
    }

    @step('Filter Certifications')
    async filterCertifications(filterType: string, filterValue: string) {
        await this.validateFilterFunctionality(filterType, filterValue);
    }

    @step('Navigate to Next Page')
    async navigateToNextPage() {
        await expect(this.nextPageButton, 'Next page button should be visible').toBeVisible();
        await this.nextPageButton.click();
        await this.waitForPageLoad();
    }

    @step('Navigate to Previous Page')
    async navigateToPreviousPage() {
        await expect(this.previousPageButton, 'Previous page button should be visible').toBeVisible();
        await this.previousPageButton.click();
        await this.waitForPageLoad();
    }

    @step('Navigate to Specific Page')
    async navigateToSpecificPage(pageNumber: number) {
        const pageButton = this.pageNumbers.nth(pageNumber - 1);
        await expect(pageButton, `Page ${pageNumber} button should be visible`).toBeVisible();
        await pageButton.click();
        await this.waitForPageLoad();
    }

    @step('Scroll to Top of Page')
    async scrollToTopOfPage() {
        await this.validateScrollToTopFunctionality();
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

    @step('Get Row Data')
    async getRowData(rowIndex: number): Promise<Record<string, string>> {
        return {
            relationship: await this.getRelationshipColumn(rowIndex).textContent() || '',
            certificationDates: await this.getCertificationDatesColumn(rowIndex).textContent() || '',
            status: await this.getStatusColumn(rowIndex).textContent() || '',
            reason: await this.getReasonColumn(rowIndex).textContent() || '',
            intermittent: await this.getIntermittentColumn(rowIndex).textContent() || '',
            created: await this.getCreatedColumn(rowIndex).textContent() || ''
        };
    }

    @step('Get Certification Section Data')
    async getCertificationSectionData(rowIndex: number): Promise<Record<string, string>> {
        const fields = ['Status', 'Substatus', 'Begin date', 'End date', 'Date sent', 'Date received', 'Date reviewed', 'Date due'];
        const data: Record<string, string> = {};
        
        for (const field of fields) {
            data[field] = await this.getCertificationField(rowIndex, field).textContent() || '';
        }
        
        return data;
    }

    @step('Get Clarification Section Data')
    async getClarificationSectionData(rowIndex: number): Promise<Record<string, string>> {
        const fields = ['Type', 'Reason', 'Date sent', 'Date received', 'Date reviewed', 'Date due'];
        const data: Record<string, string> = {};
        
        for (const field of fields) {
            data[field] = await this.getClarificationField(rowIndex, field).textContent() || '';
        }
        
        return data;
    }

    @step('Get Intermittent Section Data')
    async getIntermittentSectionData(rowIndex: number): Promise<Record<string, string>> {
        const fields = ['Incapacity/Care', 'Treatment/Appointments'];
        const data: Record<string, string> = {};
        
        for (const field of fields) {
            data[field] = await this.getIntermittentField(rowIndex, field).textContent() || '';
        }
        
        return data;
    }

    //--------------------------------------------------------------------------------------------
    // Comprehensive Validation Methods
    //--------------------------------------------------------------------------------------------

    @step('Validate Complete Certifications Page')
    async validateCompleteCertificationsPage() {
        // Validate page header
        await this.validateCertificationsPageHeader();
        
        // Validate grid structure
        await this.validateGridStructure();
        
        // Validate certification count
        await this.validateCertificationCountDisplay();
        
        // Validate pagination if needed
        await this.validatePaginationControls();
        
        // Validate scroll to top functionality
        await this.validateScrollToTopFunctionality();
    }

    @step('Validate Expanded Row Complete Data')
    async validateExpandedRowCompleteData(rowIndex: number = 0) {
        // Expand the row first
        await this.expandCertificationRow(rowIndex);
        
        // Validate all three sections
        await this.validateCertificationSectionFields(rowIndex);
        await this.validateClarificationSectionVisibility(rowIndex);
        await this.validateIntermittentAbsenceFrequencySection(rowIndex);
        
        // Validate date formats
        await this.validateDateFormatInExpandedSections(rowIndex);
    }
}

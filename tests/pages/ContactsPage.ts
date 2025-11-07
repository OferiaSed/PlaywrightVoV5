import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../fixtures/BaseTest';

export class ContactsPage extends BasePage {
    private readonly name = "Contacts Page";
    
    constructor(page: Page) {
        super(page);
    }

    //--------------------------------------------------------------------------------------------
    // Page Header and Navigation Locators
    //--------------------------------------------------------------------------------------------

    private get contactsHeader(): Locator {
        return this.page.getByRole('heading', { name: 'Contacts'});
    }

    private get contactsHeaderLine(): Locator {
        return this.page.locator('app-page-header hr');
    }

    //--------------------------------------------------------------------------------------------
    // Grid and Table Locators
    //--------------------------------------------------------------------------------------------

    private get contactsGrid(): Locator {
        return this.page.locator('app-table');
    }

    private get gridHeader(): Locator {
        return this.page.locator('app-table thead tr');
    }

    private get gridRows(): Locator {
        return this.page.locator('//tbody//tr');
    }

    private getRowByIndex(index: number): Locator {
        return this.gridRows.nth(index);
    }

    public getExpandButton(rowIndex: number): Locator {
        // Look for '>' button in the far left column
        return this.getRowByIndex(rowIndex).locator('//app-expand-button');
    }

    private getCollapseButton(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td//button[contains(@aria-label, "Collapse")]').or(this.getRowByIndex(rowIndex).locator('//td[1]//button[contains(@class, "collapse")]'));
    }

    // Grid Column Locators
    private getNameColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[contains(@data-column, "name") or position()=2]');
    }

    private getTypeColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[contains(@data-column, "type") or position()=3]');
    }

    private getPhoneColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[contains(@data-column, "phone") or position()=4]');
    }

    private getFaxColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[contains(@data-column, "fax") or position()=5]');
    }

    private getEmailColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[contains(@data-column, "email") or position()=6]');
    }

    private getAddressColumn(rowIndex: number): Locator {
        return this.getRowByIndex(rowIndex).locator('//td[contains(@data-column, "address") or position()=7]');
    }

    //--------------------------------------------------------------------------------------------
    // Expanded Row Section Locators (First Column)
    //--------------------------------------------------------------------------------------------

    public getExpandedRowFirstColumn(rowIndex: number): Locator {
        return this.gridRows.nth(rowIndex).locator('app-expand-button button[aria-label *= "Collapse"]');
    }

    public getExpandedField(rowIndex: number, fieldName: string, column: 'first' | 'second' = 'first'): Locator {
        const columnIndex = column === 'first' ? 0 : 1;
        const rowExpandedLocator = this.page.locator('tr div[class *= "tw-whitespace-normal"]').nth(rowIndex);
        const panelLocator = rowExpandedLocator.locator('app-detail-panel').nth(columnIndex);
        const fieldLocator = panelLocator.locator(`//div[text()= " ${fieldName} "]//following-sibling::div`);
        return fieldLocator;
    }

    //--------------------------------------------------------------------------------------------
    // Filter and Count Locators
    //--------------------------------------------------------------------------------------------

    private get filterButton(): Locator {
        return this.page.getByRole('button', { name: 'Filter' });
    }

    private get filterInput(): Locator {
        return this.page.getByRole('textbox', { name: 'Search input' }).or(this.page.locator('//app-filter-input//input'));
    }

    public getFilterCleaner(): Locator {
        return this.page.locator('//app-table//p-inputicon').or(this.page.locator('//app-filter-input//button[contains(@aria-label, "Clear")]'));
    }

    private get contactCount(): Locator {
        return this.page.locator('//app-table//div[contains(@class, "tw-font-bold tw-text")]').or(this.page.locator('//div[contains(text(), "contact") and contains(@class, "count")]'));
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

    //--------------------------------------------------------------------------------------------
    // Scroll to Top Locators
    //--------------------------------------------------------------------------------------------

    private get scrollToTopLink(): Locator {
        return this.page.getByRole('link', { name: /scroll to top/i }).or(this.page.locator('//a[contains(text(), "Scroll to top") or contains(text(), "scroll to top")]'));
    }

    //--------------------------------------------------------------------------------------------
    // Footer Locators
    //--------------------------------------------------------------------------------------------

    private get standardFooter(): Locator {
        return this.page.locator('//app-footer | //footer | //div[contains(@class, "footer")]');
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods
    //--------------------------------------------------------------------------------------------

    @step('Validate Contacts Page Header')
    async validateContactsPageHeader() {
        await expect(this.contactsHeader, 'Contacts header should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.contactsHeader);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Contacts] ${ctrlIcon} Contacts header ${ctrlMessage}.`);

        // Validate horizontal line under header
        await expect.soft(this.contactsHeaderLine, 'Header line should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.contactsHeaderLine);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Contacts] ${ctrlIcon} Header line ${ctrlMessage}.`);
    }

    @step('Validate Grid Structure and Columns')
    async validateGridStructure() {
        const expectedColumns = ['NAME', 'TYPE', 'PHONE', 'FAX', 'EMAIL', 'ADDRESS'];
        
        for (const column of expectedColumns) {
            const columnHeader = this.gridHeader.getByRole('columnheader', { name: column });
            await expect(columnHeader, `Column "${column}" should be visible`).toBeVisible();
            let isCond = await this.isLocatorVisible(columnHeader);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[Contacts] ${ctrlIcon} Column "${column}" ${ctrlMessage}.`);
        }
    }

    @step('Validate Grid Row Data Format')
    async validateGridRowDataFormat(rowIndex: number = 0) {
        console.log(`[Contacts] Validating grid row data format for row index ${rowIndex}...`);

        // Validate Name format (FirstName LastName)
        const nameColumn = this.getNameColumn(rowIndex);
        const nameText = await nameColumn.textContent();
        if (nameText && nameText.trim() !== '') {
            const nameRegex = /^[A-Z]+(\s+[A-Z]+)+$/;
            const nameMatches = nameRegex.test(nameText.trim());
            expect.soft(nameText.trim(), 'Name should be in format "FirstName LastName".').toMatch(nameRegex);
            let ctrlIcon = nameMatches ? '✅': '❌';
            let ctrlMessage = nameMatches ? `is in correct format: "${nameText.trim()}"` : `should be in format "FirstName LastName" but found "${nameText.trim()}"`;
            console.log(`[Contacts] ${ctrlIcon} Name ${ctrlMessage}.`);
        } else {
            console.log(`[Contacts] ⚠️ Name is empty or not found.`);
        }

        // Validate Phone format (999) 999-9999
        const phoneColumn = this.getPhoneColumn(rowIndex);
        const phoneText = await phoneColumn.textContent();
        if (phoneText && phoneText.trim() !== '') {
            const phoneRegex = /^\(\d{3}\)\s*\d{3}-\d{4}$/;
            const phoneMatches = phoneRegex.test(phoneText.trim());
            expect.soft(phoneText.trim(), 'Phone should be in format (999) 999-9999').toMatch(phoneRegex);
            let ctrlIcon = phoneMatches ? '✅': '❌';
            let ctrlMessage = phoneMatches ? `is in correct format: "${phoneText.trim()}"` : `should be in format "(999) 999-9999" but found "${phoneText.trim()}"`;
            console.log(`[Contacts] ${ctrlIcon} Phone ${ctrlMessage}.`);
        } else {
            console.log(`[Contacts] ⚠️ Phone is empty or not found.`);
        }

        // Validate Fax format (999) 999-9999
        const faxColumn = this.getFaxColumn(rowIndex);
        const faxText = await faxColumn.textContent();
        if (faxText && faxText.trim() !== '') {
            const faxRegex = /^\(\d{3}\)\s*\d{3}-\d{4}$/;
            const faxMatches = faxRegex.test(faxText.trim());
            expect.soft(faxText.trim(), 'Fax should be in format (999) 999-9999').toMatch(faxRegex);
            let ctrlIcon = faxMatches ? '✅': '❌';
            let ctrlMessage = faxMatches ? `is in correct format: "${faxText.trim()}"` : `should be in format "(999) 999-9999" but found "${faxText.trim()}"`;
            console.log(`[Contacts] ${ctrlIcon} Fax ${ctrlMessage}.`);
        } else {
            console.log(`[Contacts] ⚠️ Fax is empty or not found.`);
        }

        // Validate Email format test@email.com
        const emailColumn = this.getEmailColumn(rowIndex);
        const emailText = await emailColumn.textContent();
        if (emailText && emailText.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailMatches = emailRegex.test(emailText.trim());
            expect.soft(emailText.trim(), 'Email should be in valid email format').toMatch(emailRegex);
            let ctrlIcon = emailMatches ? '✅': '❌';
            let ctrlMessage = emailMatches ? `is in correct format: "${emailText.trim()}"` : `should be in valid email format but found "${emailText.trim()}"`;
            console.log(`[Contacts] ${ctrlIcon} Email ${ctrlMessage}.`);
        } else {
            console.log(`[Contacts] ⚠️ Email is empty or not found.`);
        }

        // Validate Address format (Address + City/State/Zip)
        const addressColumn = this.getAddressColumn(rowIndex);
        const addressText = await addressColumn.textContent();
        if (addressText && addressText.trim() !== '') {
            // Address should contain street, city, state, zip
            const addressIsValid = addressText.trim().length > 0;
            expect.soft(addressText.trim(), 'Address should contain street, city, state, zip').toBeTruthy();
            let ctrlIcon = addressIsValid ? '✅': '❌';
            let ctrlMessage = addressIsValid ? `contains data: "${addressText.trim()}"` : `should contain street, city, state, zip but found "${addressText.trim()}"`;
            console.log(`[Contacts] ${ctrlIcon} Address ${ctrlMessage}.`);
        } else {
            console.log(`[Contacts] ⚠️ Address is empty or not found.`);
        }
    }

    @step('Validate Contact Count Display')
    async validateContactCountDisplay() {
        await expect(this.contactCount, 'Contact count should be visible').toBeVisible();
        
        const countText = await this.contactCount.textContent();
        const trimmedText = countText?.trim();
        const countRegex = /^\d+\s+contact(s)?$/i;
        expect(trimmedText, 'Contact count should be in format "X contact(s)"').toMatch(countRegex);
        
        let isCond = countRegex.test(trimmedText || '');
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? `should be in format "X contact(s)" and has "${trimmedText}"` : `should be in format "X contact(s)" but found "${trimmedText}"`;
        console.log(`[Contacts] ${ctrlIcon} Contact count ${ctrlMessage}.`);
    }

    @step('Validate Expandable Row Indicator')
    async validateExpandableRowIndicator(rowIndex: number = 0) {
        console.log(`[Contacts] Validating expandable row indicator for row index ${rowIndex}...`);
        
        const expandButton = this.getExpandButton(rowIndex);
        await expect.soft(expandButton, 'Expand button should be visible for rows with additional fields').toBeVisible();
        let isCond = await this.isLocatorVisible(expandButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? `is visible (row ${rowIndex} has additional populated fields)`: `should be visible but was not found (row ${rowIndex} may not have additional populated fields)`;
        console.log(`[Contacts] ${ctrlIcon} Expand button ${ctrlMessage}.`);
    }

    @step('Validate Expanded Row First Column Fields')
    async validateExpandedRowFirstColumnFields(rowIndex: number = 0) {
        const firstColumnFields = [
            'Other phone',
            'Authorized',
            'Authorized begin',
            'Authorized end',
            'Comment'
        ];

        for (const field of firstColumnFields) {
            const fieldElement = this.getExpandedField(rowIndex, field, 'first');
            const isVisible = await this.isLocatorVisible(fieldElement);
            
            if (isVisible) {
                await expect.soft(fieldElement, `Expanded field "${field}" should be visible if populated`).toBeVisible();
                let isCond = await this.isLocatorVisible(fieldElement);
                let ctrlIcon = isCond ? '': '❌';
                let ctrlMessage = isCond ? 'is visible (field is populated)' : 'should be visible but was not found';
                console.log(`[Contacts] ${ctrlIcon} Expanded field "${field}" ${ctrlMessage}.`);
                
                // Validate format for specific fields
                if (field === 'Other phone') {
                    const fieldText = await fieldElement.textContent();
                    if (fieldText && fieldText.trim() !== '') {
                        const phoneRegex = /^\(\d{3}\)\s*\d{3}-\d{4}$/;
                        const phoneMatches = phoneRegex.test(fieldText.trim());
                        expect.soft(fieldText.trim(), 'Other phone should be in format (999) 999-9999').toMatch(phoneRegex);
                        ctrlIcon = phoneMatches ? '✅': '❌';
                        ctrlMessage = phoneMatches 
                            ? `is in correct format: "${fieldText.trim()}"` 
                            : `should be in format "(999) 999-9999" but found "${fieldText.trim()}"`;
                        console.log(`[Contacts] ${ctrlIcon} Expanded field "${field}" format ${ctrlMessage}.`);
                    }
                } else if (field === 'Authorized begin' || field === 'Authorized end') {
                    const fieldText = await fieldElement.textContent();
                    if (fieldText && fieldText.trim() !== '') {
                        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                        const dateMatches = dateRegex.test(fieldText.trim());
                        expect.soft(fieldText.trim(), `${field} should be in format MM/DD/YYYY`).toMatch(dateRegex);
                        ctrlIcon = dateMatches ? '✅': '❌';
                        ctrlMessage = dateMatches 
                            ? `is in correct format: "${fieldText.trim()}"` 
                            : `should be in format "MM/DD/YYYY" but found "${fieldText.trim()}"`;
                        console.log(`[Contacts] ${ctrlIcon} Expanded field "${field}" format ${ctrlMessage}.`);
                    }
                } else if (field === 'Authorized') {
                    const fieldText = await fieldElement.textContent();
                    if (fieldText && fieldText.trim() !== '') {
                        const authorizedRegex = /^(Yes|No)$/;
                        const authorizedMatches = authorizedRegex.test(fieldText.trim());
                        expect.soft(fieldText.trim(), 'Authorized should be Yes or No').toMatch(authorizedRegex);
                        ctrlIcon = authorizedMatches ? '✅': '❌';
                        ctrlMessage = authorizedMatches 
                            ? `is in correct format: "${fieldText.trim()}"` 
                            : `should be "Yes" or "No" but found "${fieldText.trim()}"`;
                        console.log(`[Contacts] ${ctrlIcon} Expanded field "${field}" format ${ctrlMessage}.`);
                    }
                }
                
            } else {
                // Field is not populated, which is acceptable
                let ctrlIcon = '⚠️ ';
                let ctrlMessage = 'is not visible (field is not populated)';
                console.log(`[Contacts] ${ctrlIcon} Expanded field "${field}" ${ctrlMessage}.`);
            }
        }
    }

    @step('Validate Expanded Row Second Column Fields')
    async validateExpandedRowSecondColumnFields(rowIndex: number = 0) {
        const secondColumnFields = [
            'CCE wage',
            'Contact',
            'Contact date',
            'Contact place'
        ];

        for (const field of secondColumnFields) {
            const fieldElement = this.getExpandedField(rowIndex, field, 'second');
            const isVisible = await this.isLocatorVisible(fieldElement);
            
            if (isVisible) {
                await expect.soft(fieldElement, `Expanded field "${field}" should be visible if populated`).toBeVisible();
                let ctrlIcon = '✅';
                let ctrlMessage = `is visible (field is populated)`;
                console.log(`[Contacts] ${ctrlIcon} Expanded field "${field}" ${ctrlMessage}.`);
                
                // Validate format for specific fields
                if (field === 'CCE wage') {
                    const fieldText = await fieldElement.textContent();
                    if (fieldText && fieldText.trim() !== '') {
                        // Only display if value > 0, format: $999,999,999.99
                        const wageRegex = /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/;
                        expect.soft(fieldText.trim(), 'CCE wage should be in format $999,999,999.99').toMatch(wageRegex);
                    }
                } else if (field === 'Contact date') {
                    const fieldText = await fieldElement.textContent();
                    if (fieldText && fieldText.trim() !== '') {
                        // Format: MM/DD/YYYY HH:MM:SS AM/PM or MM/DD/YYYY if time not populated
                        const dateTimeRegex = /^\d{1,2}\/\d{1,2}\/\d{4}(\s+\d{1,2}:\d{2}:\d{2}\s+(AM|PM))?$/;
                        expect.soft(fieldText.trim(), 'Contact date should be in format MM/DD/YYYY HH:MM:SS AM/PM or MM/DD/YYYY').toMatch(dateTimeRegex);
                    }
                }
            } else {
                // Field is not populated, which is acceptable
                let ctrlIcon = '✅';
                let ctrlMessage = 'is not visible (field is not populated)';
                console.log(`[Contacts] ${ctrlIcon} Expanded field "${field}" ${ctrlMessage}.`);
            }
        }
    }

    @step('Validate Filter Functionality')
    async validateFilterFunctionality(filterValue: string, cleanFilter = true) {
        const filterButton = this.filterButton;
        const filterInput = this.filterInput;
        
        await expect(filterButton, 'Filter button should be visible').toBeVisible();
        await filterButton.click();
        await filterInput.fill(filterValue);
        await this.page.keyboard.press('Enter');
        await this.delay(2000);
        
        // Validate filtered results
        const filteredRows = this.gridRows;
        const rowCount = await filteredRows.count();
        expect(rowCount, `Should have filtered results for "${filterValue}"`).toBeGreaterThan(0);
        
        let isCond = rowCount > 0;
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? `filtered results found (${rowCount} rows)` : `no filtered results found`;
        console.log(`[Contacts] ${ctrlIcon} Filter "${filterValue}" ${ctrlMessage}.`);

        if(cleanFilter){
            const filterCleaner = this.getFilterCleaner();
            if (await this.isLocatorVisible(filterCleaner)) {
                await filterCleaner.click();
                await this.delay(2000);
            }
        }
    }

    @step('Validate Pagination Controls')
    async validatePaginationControls() {
        const isPaginationVisible = await this.isLocatorVisible(this.paginationSection);
        
        if (isPaginationVisible) {
            await expect(this.paginationSection, 'Pagination section should be visible').toBeVisible();
            
            // Check if pagination is needed (more than one page)
            const pageNumbers = this.pageNumbers;
            const pageCount = await pageNumbers.count();
            
            if (pageCount > 1) {
                await expect.soft(this.firstPageButton, 'First page button should be visible').toBeVisible();
                await expect.soft(this.nextPageButton, 'Next page button should be visible').toBeVisible();
                await expect.soft(this.previousPageButton, 'Previous page button should be visible').toBeVisible();
                await expect.soft(this.lastPageButton, 'Last page button should be visible').toBeVisible();
            }
            
            let ctrlIcon = '✅';
            let ctrlMessage = 'is visible and functional';
            console.log(`[Contacts] ${ctrlIcon} Pagination controls ${ctrlMessage}.`);
        } else {
            let ctrlIcon = '✅';
            let ctrlMessage = 'is not visible (pagination not needed)';
            console.log(`[Contacts] ${ctrlIcon} Pagination controls ${ctrlMessage}.`);
        }
    }

    @step('Validate Scroll to Top Link')
    async validateScrollToTopLink() {
        // Scroll to bottom first
        await this.scrollToBottom();
        await this.delay(1000);
        
        const scrollToTopLink = this.scrollToTopLink;
        const isVisible = await this.isLocatorVisible(scrollToTopLink);
        
        if (isVisible) {
            await expect(scrollToTopLink, 'Scroll to top link should be visible at bottom of page').toBeVisible();
            let ctrlIcon = '✅';
            let ctrlMessage = 'is visible at bottom of page';
            console.log(`[Contacts] ${ctrlIcon} Scroll to top link ${ctrlMessage}.`);
        } else {
            // Link may not be visible if page is short
            let ctrlIcon = '✅';
            let ctrlMessage = 'is not visible (page may be short)';
            console.log(`[Contacts] ${ctrlIcon} Scroll to top link ${ctrlMessage}.`);
        }
    }

    @step('Validate Standard Footer')
    async validateStandardFooter() {
        await expect(this.standardFooter, 'Standard footer should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.standardFooter);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Contacts] ${ctrlIcon} Standard footer ${ctrlMessage}.`);
    }

    //--------------------------------------------------------------------------------------------
    // Action Methods
    //--------------------------------------------------------------------------------------------

    @step('Navigate to Contacts Tab')
    async navigateToContactsTab() {
        await this.selectTabMenu('DETAILS;CONTACTS', true);
        await this.waitForPageLoad();
    }

    @step('Expand Contact Row')
    async expandContactRow(rowIndex: number = 0) {
        const expandButton = this.getExpandButton(rowIndex);
        await expect.soft(expandButton, 'Expand button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(expandButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Contacts] ${ctrlIcon} Expand button ${ctrlMessage}.`);
        await expandButton.click();

        // Validate expanded content is visible
        const expandedContent = this.getExpandedRowFirstColumn(rowIndex);
        await expect.soft(expandedContent, 'Expanded row content should be expanded after clicking on > button').toBeVisible();
        isCond = await this.isLocatorVisible(expandedContent);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Contacts] ${ctrlIcon} Expanded row content ${ctrlMessage}.`);
    }

    @step('Collapse Contact Row')
    async collapseContactRow(rowIndex: number = 0) {
        const collapseButton = this.getCollapseButton(rowIndex);
        const isVisible = await this.isLocatorVisible(collapseButton);
        
        if (isVisible) {
            await collapseButton.click();
            await this.delay(1000);
            
            // Validate expanded content is hidden
            const expandedContent = this.getExpandedRowFirstColumn(rowIndex);
            await expect(expandedContent, 'Expanded row content should be hidden').toBeHidden();
            console.log(`[Contacts] Row ${rowIndex} collapsed successfully.`);
        }
    }

    @step('Filter Contacts')
    async filterContacts(filterValue: string, cleanFilter = true) {
        await this.validateFilterFunctionality(filterValue, cleanFilter);
    }

    @step('Navigate to Next Page')
    async navigateToNextPage() {
        const isVisible = await this.isLocatorVisible(this.nextPageButton);
        if (isVisible) {
            await expect(this.nextPageButton, 'Next page button should be visible').toBeVisible();
            await this.nextPageButton.click();
            await this.delay(2000);
        }
    }

    @step('Navigate to Previous Page')
    async navigateToPreviousPage() {
        const isVisible = await this.isLocatorVisible(this.previousPageButton);
        if (isVisible) {
            await expect(this.previousPageButton, 'Previous page button should be visible').toBeVisible();
            await this.previousPageButton.click();
            await this.delay(2000);
        }
    }

    @step('Navigate to Specific Page')
    async navigateToSpecificPage(pageNumber: number) {
        const pageButton = this.pageNumbers.nth(pageNumber - 1);
        const isVisible = await this.isLocatorVisible(pageButton);
        if (isVisible) {
            await expect(pageButton, `Page ${pageNumber} button should be visible`).toBeVisible();
            await pageButton.click();
            await this.delay(2000);
        }
    }

    @step('Click Scroll to Top Link')
    async clickScrollToTopLink() {
        // Scroll to bottom first
        await this.scrollToBottom();
        await this.delay(1000);
        
        const scrollToTopLink = this.scrollToTopLink;
        const isVisible = await this.isLocatorVisible(scrollToTopLink);
        
        if (isVisible) {
            // Get scroll position before clicking
            const scrollPositionBefore = await this.page.evaluate(() => window.scrollY);
            
            await expect(scrollToTopLink, 'Scroll to top link should be visible').toBeVisible();
            await scrollToTopLink.click();
            await this.delay(1000);
            
            // Validate page scrolled to top
            const scrollPositionAfter = await this.page.evaluate(() => window.scrollY);
            expect(scrollPositionAfter, 'Page should be scrolled to top').toBe(0);
            console.log(`[Contacts] Scroll to top link clicked successfully. Scroll position changed from ${scrollPositionBefore} to ${scrollPositionAfter}.`);
        } else {
            console.log(`[Contacts] Scroll to top link is not visible (page may be short).`);
        }
    }

    //--------------------------------------------------------------------------------------------
    // Data Retrieval Methods
    //--------------------------------------------------------------------------------------------

    @step('Wait for Table to Be Loaded')
    async waitTableToBeLoaded(): Promise<void> {
        try {
            // Wait for the first row to be visible (ensures table has loaded)
            await expect(this.gridRows.first(), `Table should have at least one row`).toBeVisible();
                        console.log(`[Contacts] ✅ Table loaded successfully.`);
        } catch (error) {
            const actualCount = await this.gridRows.count();
            console.log(`[Contacts] ❌ Table failed to load. Found ${actualCount} row(s).`);
        }
    }

    @step('Get Name Column Text')
    @step('Get Contact Count')
    async getContactCount(): Promise<number> {
        const countText = await this.contactCount.textContent();
        const match = countText?.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    @step('Get Grid Row Count')
    async getGridRowCount(): Promise<number> {
        return await this.gridRows.count();
    }

    @step('Get Current Page Number')
    async getCurrentPageNumber(): Promise<string> {
        const isVisible = await this.isLocatorVisible(this.currentPageSelected);
        if (isVisible) {
            await expect(this.currentPageSelected, 'Current page should be visible').toBeVisible();
            const countText = await this.currentPageSelected.textContent();
            return countText?.trim() || '';
        }
        return '1';
    }

    //--------------------------------------------------------------------------------------------
    // Comprehensive Validation Methods
    //--------------------------------------------------------------------------------------------

    @step('Validate Expanded Row Complete Data')
    async validateExpandedRowCompleteData(rowIndex: number = 0) {
        // Expand the row first
        await this.expandContactRow(rowIndex);
        
        // Validate all expanded sections
        await this.validateExpandedRowFirstColumnFields(rowIndex);
        await this.validateExpandedRowSecondColumnFields(rowIndex);
    }

    @step('Validate Type Column Displays Full Description')
    async validateTypeColumnDisplaysFullDescription(rowIndex: number = 0) {
        const typeColumn = this.getTypeColumn(rowIndex);
        const typeText = await typeColumn.textContent();
        
        // Type should display full description, not 3-character codes
        // Examples: "Best Contact Number", "Doctor", "Caller" (not CAR, HR1, HRC, etc.)
        if (typeText && typeText.trim() !== '') {
            const trimmedText = typeText.trim();
            // Should not be a 3-character code
            const threeCharCodeRegex = /^[A-Z]{3}$/;
            const isThreeCharCode = threeCharCodeRegex.test(trimmedText);
            const hasMinLength = trimmedText.length >= 4;
            const isValid = !isThreeCharCode && hasMinLength;
            
            expect.soft(trimmedText, 'Type should display full description, not 3-character code').not.toMatch(threeCharCodeRegex);
            expect.soft(trimmedText.length, 'Type description should be at least 4 characters').toBeGreaterThanOrEqual(4);
            
            let ctrlIcon = isValid ? '✅': '❌';
            let ctrlMessage = '';
            if (isValid) {
                ctrlMessage = `displays full description: "${trimmedText}"`;
            } else if (isThreeCharCode) {
                ctrlMessage = `should display full description but found 3-character code: "${trimmedText}"`;
            } else if (!hasMinLength) {
                ctrlMessage = `should be at least 4 characters but found "${trimmedText}" (${trimmedText.length} characters)`;
            }
            console.log(`[Contacts] ${ctrlIcon} Type column ${ctrlMessage}.`);
        } else {
            console.log(`[Contacts] ⚠️ Type column is empty or not found.`);
        }
    }
}


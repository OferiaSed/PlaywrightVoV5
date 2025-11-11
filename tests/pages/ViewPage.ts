import { expect,  type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { step, test } from '../fixtures/BaseTest';
import { ExcelReader } from '../../utils/helpers/excel-reader';



export class ViewPage extends BasePage {

    //--------------------------------------------------------------------------------------------
    // Getter properties 
    //--------------------------------------------------------------------------------------------
    private readonly name = "View Page";

    private get viewHeader(): Locator {
        return this.page.getByRole('heading', { name: 'View' });
    }


    //#region Action Elements

    private get advancedToggle(): Locator {
        return this.page.locator('//*[contains(text(), "Show advanced")]//following-sibling::*[contains(@class, "toggle")]');
    }

    private get searchButton(): Locator {
        return this.page.getByRole('button', { name: 'Search' });
    }

    private get clearButton(): Locator {
        return this.page.getByRole('button', { name: 'Clear' });
    }

    //#endregion


    constructor(page: Page) {
        super(page);
    }
    
    
      
    //--------------------------------------------------------------------------------------------
    // Actions for Page Object Model
    //--------------------------------------------------------------------------------------------
    @step('Go to Dashboard Page')
    async goToDashboardPage() {
        await this.goToPage();
        await this.waitForPageLoad();
        await this.selectTabMenu('HOME');
        await this.waitForPageLoad();
    }

    @step('Navigate to VIEW page')
    async goToViewPage() {
        await this.selectTabMenu('VIEW');
        await this.waitForPageLoad();
    }

    @step('Navigate to VIEW > CLAIM SEARCH page')
    async goToClaimSearchTab() {
        await this.goToViewPage();
        await this.selectTabMenu('CLAIM SEARCH');
        await this.waitForPageLoad();
    }

    @step('Navigate to VIEW > HISTORY page')
    async goToClaimHistoryTab() {
        await this.goToViewPage();
        await this.selectTabMenu('HISTORY');
        await this.waitForPageLoad();
    }

    @step('Navigate to VIEW > WATCHLIST page')
    async goToClaimWatchlistTab() {
        await this.goToViewPage();
        await this.selectTabMenu('WATCHLIST');
        await this.waitForPageLoad();
    }

    @step('Fill Search Criteria')
    async SearchClaimByCriteria(dataset: number) {
        const reader = new ExcelReader(`${this.driverPath}${this.driverFile}`);
        reader.selectDataSet('ClaimSearch', dataset);
        for(let row = 0; row < reader.count(); row++){
            reader.useRow(row);
            const claimNumber = reader.getValue('ClaimNumber', '');
                        
            // Claimant Information Fields
            await this.inputTextField("Claim number", claimNumber, reader.getValue('ClaimNumberOption', ''));
            await this.inputTextField("First name", reader.getValue('FirstName', ''));
            await this.inputTextField("Last name", reader.getValue('LastName', ''));
            await this.inputTextField("Employee ID", reader.getValue('EmployeeId', ''));
            await this.inputTextField("SSN", reader.getValue('SSN', ''), reader.getValue('SSNOption', ''));
            await this.inputTextField("Birth date", reader.getValue('BirthDate', ''));
            await this.inputTextField("Phone number", reader.getValue('PhoneNumber', ''));
            await this.dropdownMultiSelect("Search options", reader.getValue('SearchOptions', ''));

            // Claim Information Fields
            await this.dropdownMultiSelect("Line of business", reader.getValue('LineOfBusiness', ''));
            await this.dropdownMultiSelect("Status", reader.getValue('Status', ''));
            await this.dropdownMultiSelect("Substatus", reader.getValue('Substatus', ''));
            await this.dropdownMultiSelect("Claim type", reader.getValue('ClaimType', ''));
            await this.dropdownMultiSelect("Case type", reader.getValue('CaseType', ''));
            await this.dropdownMultiSelect("Claim flags", reader.getValue('ClaimFlags', ''));
            await this.inputTextField("Policy number", reader.getValue('PolicyNumber', ''));
            await this.inputTextField("Examiner name", reader.getValue('ExaminerName', ''));
            await this.inputTextField("Driver name", reader.getValue('DriverName', ''));

            // Location Information Fields
            await this.dropdownMultiSelect("Client", reader.getValue('Client', ''));
            await this.dropdownMultiSelect("Account", reader.getValue('Account', ''));
            await this.dropdownMultiSelect("Unit", reader.getValue('Unit', ''));

            // Advanced Search Toggle
            if (reader.getValue('EnableAdvanced', '').toLowerCase() === 'true') {
                await this.toggleAdvancedSearch(true);
            }

            // Perform Search
            console.log(`[Search] Executing search for claim: ${claimNumber || 'N/A'}`);
            await this.clickSearchButton();
            await this.waitForSearchResults();
            console.log(`[Search] Search completed. Results loaded.`);
            
            // Validate Search Results
            console.log(`[Search] Selecting claim: ${claimNumber || 'N/A'}`);
            await this.selectClaimByNumber(claimNumber);
        }
    }


    //--------------------------------------------------------------------------------------------
    // Advanced Search Methods
    //--------------------------------------------------------------------------------------------

    @step('Toggle Advanced Search')
    async toggleAdvancedSearch(enable: boolean = true) {
        const toggle = this.advancedToggle;
        const isEnabled = await toggle.getAttribute('aria-checked') === 'true';
        
        if (enable && !isEnabled) {
            await toggle.click();
        } else if (!enable && isEnabled) {
            await toggle.click();
        }
        await this.waitForPageLoad();
    }

    @step('Check if Advanced Search is Enabled')
    async isAdvancedSearchEnabled(): Promise<boolean> {
        const toggle = this.advancedToggle;
        return await toggle.getAttribute('aria-checked') === 'true';
    }

    //--------------------------------------------------------------------------------------------
    // Action Methods
    //--------------------------------------------------------------------------------------------

    @step('Click Search Button')
    async clickSearchButton() {
        await expect(this.searchButton, 'Search button should be visible').toBeVisible();
        await this.searchButton.click();
        await this.waitForPageLoad();
    }

    @step('Wait for Search Results to Load')
    async waitForSearchResults() {
        await this.waitForPageLoad();
    }

    @step('Clear All Search Fields')
    async clearAllSearchFields() {
        await this.clearButton.click();
        await this.waitForPageLoad();
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods
    //--------------------------------------------------------------------------------------------

    @step('Select Claim By Number')
    async selectClaimByNumber(claimNumber: string) {
        // Wait for results to load
        await this.waitForSearchResults();
        
        const claimRow = await this.page.locator('tr').
        filter({ has: this.page.locator('td', {hasText: claimNumber}), }).nth(0);
        
        // Validate claim row is visible
        await expect(claimRow, `Claim row with number ${claimNumber} should be visible`).toBeVisible();
        let  isCond = await claimRow.isVisible();
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible in results' : 'should be visible but was not found';
        console.log(`[Search] ${ctrlIcon} Claim row for "${claimNumber}" ${ctrlMessage}.`);
        
        
        // Check if the specific claim row exists
        this.delay(2000);
        const claimLink = claimRow.locator('a').nth(0);
        await claimLink.highlight();
        
        await claimLink.click();
        await this.delay(3000);
        await this.waitForPageLoad();
        console.log(`[Search] Claim "${claimNumber}" selected successfully.`);
    }


}
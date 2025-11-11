import { Page, Locator, Expect, expect } from '@playwright/test';
import { step, test } from '../fixtures/BaseTest';
import { envHelper } from '../../utils/environment';


export class BasePage{
    protected page: Page;
    protected baseUrl: string;
    protected driverFile: string;
    protected driverPath: string;

    constructor(page: Page) {
        this.page = page;
        this.baseUrl = envHelper.getBaseUrl();
        this.driverFile = envHelper.getDataDriver();
        this.driverPath = "C:\\Data_Playwrigth\\";
    }

    //--------------------------------------------------------------------------------------------
    // Pagination Locators
    //--------------------------------------------------------------------------------------------

    protected get paginationSection(): Locator {
        return this.page.locator('p-paginator');
    }

    protected get firstPageButton(): Locator {
        return this.paginationSection.getByRole('button', { name: 'First Page' });
    }

    protected get nextPageButton(): Locator {
        return this.paginationSection.getByRole('button', { name: 'Next Page' });
    }

    protected get previousPageButton(): Locator {
        return this.paginationSection.getByRole('button', { name: 'Previous Page' });
    }

    protected get lastPageButton(): Locator {
        return this.paginationSection.getByRole('button', { name: 'Last Page' });
    }

    protected get pageNumbers(): Locator {
        return this.paginationSection.locator('//button[contains(@class, "page")]');
    }

    protected get currentPageSelected(): Locator {
        return this.paginationSection.locator('button[aria-current="page"], span button[aria-current="page"]').first();
    }

    //--------------------------------------------------------------------------------------------
    // Scroll to Top Locators
    //--------------------------------------------------------------------------------------------

    protected get scrollToTopButton(): Locator {
        return this.page.getByRole('button', { name: 'Scroll to top of page' });
    }

    //--------------------------------------------------------------------------------------------
    // Base Page Common Methods
    //--------------------------------------------------------------------------------------------

    @step('Delay to wait couple seconds.')
    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    @step('Navigate to url')
    async goToPage(path: string = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
    }

    @step('Wait for page load')
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    @step('Get Page Title')
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    @step('Get Current Url')
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    @step('Verify Claim Level Menu Visibility')
    async claimLevelMenuVisibility(tabName: string): Promise<void> {
        //Select Menu Tab
        let counter = 0;
        const options = tabName.split(';');
        for (const option of options) {
            const tabMenu = await this.page.getByRole('tab', { name: option});
            await expect(tabMenu, `Tab "${option}"should exist and be visible.`).toBeVisible();
            await tabMenu.hover();            
            if(counter == 0){
                await tabMenu.highlight();
                await tabMenu.hover();
            }
            else{
                await tabMenu.highlight();
            }
            await this.waitForPageLoad();
            counter++;
        }
    }
    
    @step('Select Tab Menu')
    async selectTabMenu(tabName: string, useHover = false): Promise<void> {
        //Select Menu Tab
        let counter = 0;
        const options = tabName.split(';');
        for (const option of options) {
            const tabMenu = await this.page.getByRole('tab', { name: option});
            await expect(tabMenu, `Tab "${option}"should exist and be visible.`).toBeVisible();
            if(useHover && counter == 0){
                await tabMenu.hover();
            }
            else{
                await tabMenu.click();
            }
            await this.waitForPageLoad();
            counter++;
            console.log(`[Navigation] Go to Menu Tab: ${option}`);
        }
    }

    @step('Dropdown - Multi Select')
    async dropdownMultiSelect(dropdownName: string, optionToSelect: string): Promise<void> {
        if(optionToSelect != ""){
            //Expand Dropdown
            const multiDropdown = await this.page.locator(`//*[label[contains(text(), "${dropdownName}")]]//div[contains(@class, "label-container")]`);
            const collapseButton = await this.page.locator(`//*[label[contains(text(), "${dropdownName}")]]//div[@class="p-multiselect-dropdown"]`);
            const counter = await multiDropdown.count();
            await expect(multiDropdown, `Tab "${dropdownName}"should exist and be visible.`).toBeVisible();
            await multiDropdown.click();
            //Select Options
            const options = optionToSelect.split(';');
            for (const option of options) {
                const element = await this.page.getByRole('option', { name: option, exact: true });
                await expect(element, `Option "${element}"should exist and be visible.`).toBeVisible();
                await element.click();
            }
            await collapseButton.click();
        }
    }

    @step('Input Text Field')
    async inputTextField(element: string, textValue: string, optionToSelect = ""){
        if(textValue != ""){
            //Fill Text Field
            const baseDiv = await this.page.locator('div[class*="tw-items-center tw-px-0.5 tw-w-full"]').filter({ has: this.page.locator(`xpath=//label[contains(text(), '${element}')]`) });
            const inputfield = await baseDiv.locator('input');
            await inputfield.click();
            await inputfield.clear();
            await inputfield.fill(textValue);
            
            //Select option if required
            if(optionToSelect != ""){
                const inputButton = await baseDiv.locator('button');
                await inputButton.click();
                const option = await this.page.getByText(optionToSelect);
                await option.click();
            }
        }
    }

    @step('Is Locator Visible')
    async isLocatorVisible(locator: Locator): Promise<boolean> {
        try {
            const count = await locator.count();
            if (count === 0) {
                return false;
            }
            return await locator.isVisible();
        } catch {
            return false;
        }
    }

    //--------------------------------------------------------------------------------------------
    // Scroll to Top Methods
    //--------------------------------------------------------------------------------------------

    @step('Scroll to Bottom of Page')
    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    @step('Get Scroll Position')
    async getScrollPosition(): Promise<number> {
        return await this.page.evaluate(() => window.scrollY);
    }

    @step('Validate Scroll to Top Button')
    async validateScrollToTopButton() {
        // Scroll to bottom first to make button visible
        await this.scrollToBottom();
        await this.delay(1000);
        
        const scrollToTopButton = this.scrollToTopButton;
        await expect(scrollToTopButton, 'Scroll to top button should be visible at bottom of page').toBeVisible();
        
        let isCond = await this.isLocatorVisible(scrollToTopButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible at bottom of page' : 'should be visible but was not found';
        console.log(`[Scroll to Top] ${ctrlIcon} Scroll to top button ${ctrlMessage}.`);
    }

    @step('Click Scroll to Top Button')
    async clickScrollToTopButton() {
        // Get scroll position before clicking
        const scrollToTopButton = this.scrollToTopButton;
        const scrollPositionBefore = await this.getScrollPosition();
        console.log(`[Scroll to Top] Scroll position before clicking: ${scrollPositionBefore}px.`);
        
        // Validate button visibility
        await expect.soft(scrollToTopButton, 'Scroll to top button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(scrollToTopButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Scroll to Top] ${ctrlIcon} Scroll to top button ${ctrlMessage}.`);
        
        // Click the button
        await scrollToTopButton.click();
        await this.delay(2000);
        console.log(`[Scroll to Top] ✅ Scroll to top button clicked successfully.`);
        
        // Validate page scrolled to top
        const scrollPositionAfter = await this.getScrollPosition();
        const scrolledToTop = scrollPositionAfter === 0;
        expect.soft(scrollPositionAfter, 'Page should be scrolled to top').toBe(0);
        
        ctrlIcon = scrolledToTop ? '✅': '❌';
        ctrlMessage = scrolledToTop 
            ? `scrolled to top successfully (from ${scrollPositionBefore}px to ${scrollPositionAfter}px)` 
            : `did not scroll to top, scroll position is ${scrollPositionAfter}px (expected 0px)`;
        console.log(`[Scroll to Top] ${ctrlIcon} Page scroll ${ctrlMessage}.`);
    }

    //--------------------------------------------------------------------------------------------
    // Pagination Methods
    //--------------------------------------------------------------------------------------------

    @step('Dropdown - Pagination Panel')
    async dropdownNavigationPanel(optionToSelect: string): Promise<void> {
        if(optionToSelect != ""){
            //Expand Dropdown
            const dropdownButton = await this.page.locator('p-paginator p-select');
            const expandedList = await this.page.locator('ul[role="listbox"]');
            const counter = await dropdownButton.count();
            await expect(dropdownButton, `Navigation Dropdown Button should exist and be visible.`).toBeVisible();
            await dropdownButton.click();
            await expect(expandedList, `Dropdown options should exist and be visible.`).toBeVisible();

            //Select Options
            const options = optionToSelect.split(';');
            for (const option of options) {
                const element = await this.page.getByRole('option', { name: option, exact: true });
                await expect(element, `Option "${element}"should exist and be visible.`).toBeVisible();
                await element.click();
                await this.delay(2000);
            }
        }
    }

    public getPaginationSection(): Locator {
        return this.paginationSection;
    }

    @step('Validate Pagination Controls')
    async validatePaginationControls() {
        const isPaginationVisible = await this.isLocatorVisible(this.paginationSection);
        
        if (isPaginationVisible) {
            await expect(this.paginationSection, 'Pagination section should be visible').toBeVisible();
            let isCond = await this.isLocatorVisible(this.paginationSection);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[Pagination] ${ctrlIcon} Pagination section ${ctrlMessage}.`);
            
            // Check if pagination is needed (more than one page)
            const pageNumbers = this.pageNumbers;
            const pageCount = await pageNumbers.count();
            
            if (pageCount > 1) {
                // Validate First page button
                await expect.soft(this.firstPageButton, 'First page button should be visible').toBeVisible();
                isCond = await this.isLocatorVisible(this.firstPageButton);
                ctrlIcon = isCond ? '✅': '❌';
                ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
                console.log(`[Pagination] ${ctrlIcon} First page button ${ctrlMessage}.`);
                
                // Validate Next page button
                await expect.soft(this.nextPageButton, 'Next page button should be visible').toBeVisible();
                isCond = await this.isLocatorVisible(this.nextPageButton);
                ctrlIcon = isCond ? '✅': '❌';
                ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
                console.log(`[Pagination] ${ctrlIcon} Next page button ${ctrlMessage}.`);
                
                // Validate Previous page button
                await expect.soft(this.previousPageButton, 'Previous page button should be visible').toBeVisible();
                isCond = await this.isLocatorVisible(this.previousPageButton);
                ctrlIcon = isCond ? '✅': '❌';
                ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
                console.log(`[Pagination] ${ctrlIcon} Previous page button ${ctrlMessage}.`);
                
                // Validate Last page button
                await expect.soft(this.lastPageButton, 'Last page button should be visible').toBeVisible();
                isCond = await this.isLocatorVisible(this.lastPageButton);
                ctrlIcon = isCond ? '✅': '❌';
                ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
                console.log(`[Pagination] ${ctrlIcon} Last page button ${ctrlMessage}.`);
                
                ctrlIcon = '✅';
                ctrlMessage = `is visible and functional (${pageCount} pages)`;
                console.log(`[Pagination] ${ctrlIcon} Pagination controls ${ctrlMessage}.`);
            } else {
                ctrlIcon = '✅';
                ctrlMessage = 'is visible (single page, navigation buttons not needed)';
                console.log(`[Pagination] ${ctrlIcon} Pagination controls ${ctrlMessage}.`);
            }
        } else {
            let ctrlIcon = '⚠️ ';
            let ctrlMessage = 'is not visible (pagination not needed)';
            console.log(`[Pagination] ${ctrlIcon} Pagination controls ${ctrlMessage}.`);
        }
    }

    @step('Navigate to Next Page')
    async navigateToNextPage() {
        await expect.soft(this.nextPageButton, 'Next page button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.nextPageButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Pagination] ${ctrlIcon} Next page button ${ctrlMessage}.`);
        
        await this.nextPageButton.click();
        await this.delay(2000);
        console.log(`[Pagination] ✅ Navigated to next page successfully.`);
    }

    @step('Navigate to Previous Page')
    async navigateToPreviousPage() {
        await expect.soft(this.previousPageButton, 'Previous page button should be visible').toBeVisible();
        
        let isCond = await this.isLocatorVisible(this.previousPageButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Pagination] ${ctrlIcon} Previous page button ${ctrlMessage}.`);
        
        await this.previousPageButton.click();
        await this.delay(2000);
        console.log(`[Pagination] ✅ Navigated to previous page successfully.`);
    }

    @step('Navigate to Specific Page')
    async navigateToSpecificPage(pageNumber: number) {
        const pageButton = this.pageNumbers.nth(pageNumber - 1);
        await expect.soft(pageButton, `Page ${pageNumber} button should be visible`).toBeVisible();
        
        let isCond = await this.isLocatorVisible(pageButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Pagination] ${ctrlIcon} Page ${pageNumber} button ${ctrlMessage}.`);
        
        await pageButton.click();
        await this.delay(2000);
        console.log(`[Pagination] ✅ Navigated to page ${pageNumber} successfully.`);
    }

    @step('Get Current Page Number')
    async getCurrentPageNumber(): Promise<string> {
        await expect.soft(this.currentPageSelected, 'Current page should be visible').toBeVisible();
        
        let isCond = await this.isLocatorVisible(this.currentPageSelected);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Pagination] ${ctrlIcon} Current page indicator ${ctrlMessage}.`);
        
        const countText = await this.currentPageSelected.textContent();
        const pageNumber = countText?.trim() || '';
        
        return pageNumber;
    }

}
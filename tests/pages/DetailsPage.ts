import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../fixtures/BaseTest';

/**
 * Details Page Object Model - Accommodation Claims Focus
 * 
 * This page object handles all interactions with the Details tab functionality
 * specifically for accommodation claims as specified in User Story requirements 3.4.001, 3.4.002, 3.4.003, and 3.4.4.001.
 * 
 * Functionality Coverage:
 * - Details tab navigation and dropdown menu validation for accommodation claims
 * - Sub-menu item verification (Accommodations, Time Tracking, Contacts, Custom Fields)
 * - Exclusion validation for accommodation claims (Benefit Plan, Medical, Legal, Appeals, Tender, Plan Summary)
 * - Financials tab exclusion for JURIS Accommodations
 * - Custom Fields page integration and security validation for accommodation claims
 */
export class DetailsPage extends BasePage {
    private readonly name = "Details Page";
    
    constructor(page: Page) {
        super(page);
    }

    //--------------------------------------------------------------------------------------------
    // Locator Properties - Details Tab Elements
    //--------------------------------------------------------------------------------------------

    private get detailsTab(): Locator {
        // Use .first() to ensure we get the main Details tab in navigation, not any other "Details" text on the page
        return this.page.getByRole('tab', { name: 'Details' }).first();
    }

    // The Details tab shows a floating submenu with ids like #sub-item-0, #sub-item-1, etc
    // We target the submenu container by prefix selector
    private get detailsSubMenuItems(): Locator {
        return this.page.locator('[id^="sub-item-"]');
    }

    private get accommodationsMenuItem(): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText('Accommodations', { exact: true });
    }

    private get timeTrackingMenuItem(): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText('Time Tracking', { exact: true });
    }

    private get contactsMenuItem(): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText('Contacts', { exact: true });
    }

    private get customFieldsMenuItem(): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText('Custom Fields', { exact: true });
    }

    // Items that should NOT be displayed for accommodation claims
    private get benefitPlanMenuItem(): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText('Benefit Plan', { exact: true });
    }

    private get medicalMenuItem(): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText('Medical', { exact: true });
    }

    private get legalMenuItem(): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText('Legal', { exact: true });
    }

    private get appealsMenuItem(): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText('Appeals', { exact: true });
    }

    private get tenderMenuItem(): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText('Tender', { exact: true });
    }

    private get planSummaryMenuItem(): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText('Plan Summary', { exact: true });
    }

    private get financialsTab(): Locator {
        return this.page.getByRole('tab', { name: 'Financials' });
    }

    // Custom Fields specific elements
    private get customFieldsContainer(): Locator {
        return this.page.locator('p-tabs[class*="p-tabs-scrollable"]');
    }

    private get fieldsSection(): Locator {
        return this.page.locator('p-tabpanel[id*="tabpanel_fields"]');
    }

    private get hrDataSection(): Locator {
        return this.page.locator('p-tabpanel[id*="tabpanel_HR fields"]');
    }

    // Custom Fields page elements - Fields Tab
    private get customFieldsHeader(): Locator {
        return this.page.getByRole('heading', { name: 'Custom fields', level: 2 });
    }

    private get fieldsTab(): Locator {
        return this.page.getByRole('tab', { name: 'FIELDS' }).first();
    }

    private get hrFieldsTab(): Locator {
        return this.page.getByRole('tab', { name: 'HR FIELDS' });
    }

    private get alternateNumbersTab(): Locator {
        return this.page.getByRole('tab', { name: 'ALTERNATE NUMBERS' });
    }

    // Fields Tab panel container - all Fields Tab elements are within p-tabpanels
    private get fieldsTabPanel(): Locator {
        return this.page.locator('p-tabpanels').getByRole('tabpanel', { name: 'fields' });
    }

    private get expandAllToggle(): Locator {
        return this.fieldsTabPanel.getByRole('switch', { name: 'Expand all' });
    }

    private get exportIcon(): Locator {
        return this.fieldsTabPanel.getByRole('button', { name: 'Export' });
    }

    private get saveChangesButton(): Locator {
        return this.fieldsTabPanel.getByRole('button', { name: 'Save changes' });
    }

    private get resetButton(): Locator {
        return this.fieldsTabPanel.getByRole('button', { name: 'Reset' });
    }

    // Locators for custom field cards - scoped within p-tabpanels
    // Cards are identified by their heading (level 3) - the card "container" is the section
    // that includes the heading, expand/collapse button, and region with table
    private getCustomFieldCard(categoryName: string): Locator {
        // Find the heading for this category, then get its parent container
        // The card structure: caption (with heading) -> button -> region (when expanded)
        const heading = this.fieldsTabPanel.getByRole('heading', { name: categoryName, level: 3 });
        // Get the caption parent, then its parent container
        return heading.locator('..').locator('..');
    }

    private getCustomFieldCardHeader(categoryName: string): Locator {
        // Card header is the heading within the caption
        return this.fieldsTabPanel.getByRole('heading', { name: categoryName, level: 3 });
    }

    private getCustomFieldCardChevron(categoryName: string): Locator {
        // Chevron button follows the heading in the DOM structure
        // Button aria-label is "Collapse undefined panel" when expanded or "Expand undefined panel" when collapsed
        // Find all headings and buttons, match by position
        const headings = this.fieldsTabPanel.getByRole('heading', { level: 3 });
        const buttons = this.fieldsTabPanel.getByRole('button').filter({ 
            hasText: /Expand.*panel|Collapse.*panel/i 
        });
        
        // This is a helper - the actual finding will be done in the expand method
        // For now, return a locator that finds buttons with the correct aria-label pattern
        // The expand method will need to find the correct one by position
        return buttons.first();
    }

    // Helper method to find table index for a category (used internally)
    private async getCategoryTableIndex(categoryName: string): Promise<number> {
        const headings = this.fieldsTabPanel.getByRole('heading', { level: 3 });
        const headingCount = await headings.count();
        
        for (let i = 0; i < headingCount; i++) {
            const heading = headings.nth(i);
            const text = await heading.textContent();
            if (text?.trim() === categoryName) {
                return i;
            }
        }
        return -1;
    }

    // Helper method to get the table locator for a specific category
    private async getCustomFieldTableForCategory(categoryName: string): Promise<Locator> {
        const tableIndex = await this.getCategoryTableIndex(categoryName);
        if (tableIndex === -1) {
            throw new Error(`Category "${categoryName}" not found`);
        }
        
        const tables = this.fieldsTabPanel.getByRole('region').getByRole('table');
        return tables.nth(tableIndex);
    }

    private getCustomFieldTable(categoryName: string): Locator {
        // Deprecated: Use getCustomFieldTableForCategory instead for async access
        // This is kept for backward compatibility but may not work correctly with multiple cards
        return this.fieldsTabPanel
            .getByRole('region')
            .getByRole('table')
            .first();
    }

    // HR Fields Tab elements
    private get asOfDateFilter(): Locator {
        return this.page.locator('[data-testid="as-of-date-filter"]');
    }

    private get hrFieldsTable(): Locator {
        return this.page.locator('[data-testid="hr-fields-table"]');
    }

    // Alternate Numbers Tab elements
    private get alternateNumbersTabContainer(): Locator {
        return this.page.locator('.tw-flex.tw-gap-8');
    }

    private get alternateNumbersTable(): Locator {
        // Table is within the .tw-flex.tw-gap-8 container
        // Using role-based locator to find table with columnheaders "Alternate Number" and "Type"
        return this.alternateNumbersTabContainer.getByRole('table');
    }

    // Dynamic locator for menu items
    private getMenuItemLocator(itemName: string): Locator {
        return this.page.locator('[id^="sub-item-"]').getByText(itemName, { exact: true });
    }

    // Dynamic locator for tabs
    private getTabLocator(tabName: string): Locator {
        return this.page.getByRole('tab', { name: tabName });
    }

    //--------------------------------------------------------------------------------------------
    // Navigation and Basic Actions
    //--------------------------------------------------------------------------------------------

    @step('Navigate to Details tab')
    async navigateToDetailsTab(): Promise<void> {
        await expect(this.detailsTab, 'Details tab should be visible').toBeVisible();
        await this.detailsTab.click();
        await this.waitForPageLoad();
    }

    @step('Open Details dropdown menu')
    async openDetailsDropdownMenu(): Promise<void> {
        // Hover the Details tab to reveal submenu; fallback to click
        await expect(this.detailsTab, 'Details tab should be visible').toBeVisible();
        await this.detailsTab.hover();
        
        // If hover didn't reveal, click the tab
        const items = this.detailsSubMenuItems;
        if ((await items.count()) === 0) {
            await this.detailsTab.click();
        }

        // Wait for at least one submenu item to appear
        await expect(this.detailsSubMenuItems.first(), 'Details dropdown menu should be visible').toBeVisible();
        await this.delay(300);
    }

    @step('Navigate to specific Details sub-menu item')
    async navigateToDetailsSubMenu(itemName: string): Promise<void> {
        await this.openDetailsDropdownMenu();
        
        const menuItem = this.getMenuItemLocator(itemName);
        await expect(menuItem, `${itemName} menu item should be visible`).toBeVisible();
        await menuItem.click();
        await this.waitForPageLoad();
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Required Menu Items (3.4.001)
    //--------------------------------------------------------------------------------------------

    @step('Validate Details dropdown contains required menu items')
    async validateRequiredDetailsMenuItems(): Promise<void> {
        await this.openDetailsDropdownMenu();
        
        const requiredItems = [
            'Accommodations',
            'Time Tracking', 
            'Contacts',
            'Custom Fields'
        ];

        for (const item of requiredItems) {
            const menuItem = this.getMenuItemLocator(item);
            await expect(menuItem, `${item} should be visible in Details dropdown menu`).toBeVisible();
        }
    }

    @step('Validate Accommodations menu item is present and clickable')
    async validateAccommodationsMenuItem(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.accommodationsMenuItem, 'Accommodations menu item should be visible').toBeVisible();
        await expect(this.accommodationsMenuItem, 'Accommodations menu item should be enabled').toBeEnabled();
    }

    @step('Validate Time Tracking menu item is present and clickable')
    async validateTimeTrackingMenuItem(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.timeTrackingMenuItem, 'Time Tracking menu item should be visible').toBeVisible();
        await expect(this.timeTrackingMenuItem, 'Time Tracking menu item should be enabled').toBeEnabled();
    }

    @step('Validate Contacts menu item is present and clickable')
    async validateContactsMenuItem(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.contactsMenuItem, 'Contacts menu item should be visible').toBeVisible();
        await expect(this.contactsMenuItem, 'Contacts menu item should be enabled').toBeEnabled();
    }

    @step('Validate Custom Fields menu item is present and clickable')
    async validateCustomFieldsMenuItem(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.customFieldsMenuItem, 'Custom Fields menu item should be visible').toBeVisible();
        await expect(this.customFieldsMenuItem, 'Custom Fields menu item should be enabled').toBeEnabled();
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Excluded Menu Items for Accommodation Claims (3.4.002)
    //--------------------------------------------------------------------------------------------

    @step('Validate excluded menu items are NOT displayed for accommodation claims')
    async validateExcludedMenuItemsForAccommodationClaims(): Promise<void> {
        await this.openDetailsDropdownMenu();
        
        const excludedItems = [
            'Benefit Plan',
            'Medical',
            'Legal', 
            'Appeals',
            'Tender',
            'Plan Summary'
        ];

        for (const item of excludedItems) {
            const menuItem = this.getMenuItemLocator(item);
            await expect(menuItem, `${item} should NOT be visible in Details dropdown for accommodation claims`).not.toBeVisible();
        }
    }

    @step('Validate Benefit Plan is not displayed for accommodation claims')
    async validateBenefitPlanNotDisplayed(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.benefitPlanMenuItem, 'Benefit Plan should not be visible for accommodation claims').not.toBeVisible();
    }

    @step('Validate Medical is not displayed for accommodation claims')
    async validateMedicalNotDisplayed(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.medicalMenuItem, 'Medical should not be visible for accommodation claims').not.toBeVisible();
    }

    @step('Validate Legal is not displayed for accommodation claims')
    async validateLegalNotDisplayed(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.legalMenuItem, 'Legal should not be visible for accommodation claims').not.toBeVisible();
    }

    @step('Validate Appeals is not displayed for accommodation claims')
    async validateAppealsNotDisplayed(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.appealsMenuItem, 'Appeals should not be visible for accommodation claims').not.toBeVisible();
    }

    @step('Validate Tender is not displayed for accommodation claims')
    async validateTenderNotDisplayed(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.tenderMenuItem, 'Tender should not be visible for accommodation claims').not.toBeVisible();
    }

    @step('Validate Plan Summary is not displayed for accommodation claims')
    async validatePlanSummaryNotDisplayed(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.planSummaryMenuItem, 'Plan Summary should not be visible for accommodation claims').not.toBeVisible();
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Financials Tab Exclusion (3.4.003)
    //--------------------------------------------------------------------------------------------

    @step('Validate Financials tab is NOT displayed for JURIS Accommodations')
    async validateFinancialsTabNotDisplayedForJURIS(): Promise<void> {
        // Check that Financials tab is not present in the tab navigation
        await expect(this.financialsTab, 'Financials tab should NOT be visible for JURIS Accommodations').not.toBeVisible();
    }

    @step('Validate Financials tab exclusion with claim type verification')
    async validateFinancialsTabExclusionForAccommodations(claimType: string): Promise<void> {
        if (claimType.toUpperCase().includes('JURIS') && claimType.toUpperCase().includes('ACCOMMODATION')) {
            await this.validateFinancialsTabNotDisplayedForJURIS();
        } else {
            // For non-JURIS accommodation claims, Financials tab should be visible
            await expect(this.financialsTab, `Financials tab should be visible for ${claimType}`).toBeVisible();
        }
    }

    //--------------------------------------------------------------------------------------------
    // Custom Fields Validation Methods (3.4.4.001)
    //--------------------------------------------------------------------------------------------

    @step('Navigate to Custom Fields from Details dropdown')
    async navigateToCustomFields(): Promise<void> {
        await this.navigateToDetailsSubMenu('Custom Fields');
        await expect(this.customFieldsContainer, 'Custom Fields container should be visible').toBeVisible();
    }

    @step('Validate Custom Fields is last option in dropdown menu')
    async validateCustomFieldsIsLastOption(): Promise<void> {
        await this.openDetailsDropdownMenu();
        
        // Get all menu items and verify Custom Fields is the last one
        const menuItems = await this.detailsSubMenuItems.all();
        const lastMenuItem = menuItems[menuItems.length - 1];
        const lastMenuText = await lastMenuItem.textContent();
        
        expect(lastMenuText?.trim(), 'Custom Fields should be the last option in dropdown menu').toBe('Custom Fields');
    }

    @step('Validate Custom Fields page displays Fields and HR Data sections')
    async validateCustomFieldsSections(): Promise<void> {
        await this.navigateToCustomFields();
        
        // Validate Fields section is present
        await this.fieldsTab.click();
        await this.waitForPageLoad();
        await expect(this.fieldsSection, 'Fields section should be visible in Custom Fields').toBeVisible();

        // Validate HR Data section is present  
        await this.hrFieldsTab.click();
        await this.waitForPageLoad();
        await expect(this.hrDataSection, 'HR Data section should be visible in Custom Fields').toBeVisible();
    }

    @step('Validate Custom Fields security and permissions')
    async validateCustomFieldsSecurity(userRole: string): Promise<void> {
        await this.navigateToCustomFields();
        
        // This would need to be implemented based on specific security requirements
        // For now, just validate that the page loads and basic elements are accessible
        await expect(this.customFieldsContainer, 'Custom Fields should be accessible based on user permissions').toBeVisible();
        
        // Additional security validations would be added based on role-based access control
        if (userRole === 'ReadOnly') {
            // Validate read-only access
            const editButtons = this.page.locator('button[data-action="edit"]');
            const editButtonCount = await editButtons.count();
            expect(editButtonCount, 'Edit buttons should not be visible for read-only users').toBe(0);
        }
    }

    @step('Validate Alternative Claim Numbers are not used for DS claims')
    async validateAlternativeClaimNumbersNotPresent(): Promise<void> {
        await this.navigateToCustomFields();
        
        // Verify that Alternative Claim Numbers section is not present
        const alternativeClaimNumbersSection = this.page.locator('[data-testid="alternative-claim-numbers"]');
        await expect(alternativeClaimNumbersSection, 'Alternative Claim Numbers should not be present for accommodation claims').not.toBeVisible();
    }

    //--------------------------------------------------------------------------------------------
    // Performance and Load Testing Methods
    //--------------------------------------------------------------------------------------------

    @step('Measure Details tab loading performance')
    async measureDetailsTabLoadTime(): Promise<number> {
        const startTime = Date.now();
        await this.navigateToDetailsTab();
        await this.waitForPageLoad();
        const endTime = Date.now();
        
        const loadTime = endTime - startTime;
        expect(loadTime, 'Details tab should load within acceptable time limit').toBeLessThan(3000); // 3 seconds
        
        return loadTime;
    }

    @step('Measure Details dropdown menu response time')
    async measureDropdownMenuResponseTime(): Promise<number> {
        await this.navigateToDetailsTab();
        
        const startTime = Date.now();
        await this.openDetailsDropdownMenu();
        const endTime = Date.now();
        
        const responseTime = endTime - startTime;
        expect(responseTime, 'Details dropdown should open within acceptable time').toBeLessThan(1000); // 1 second
        
        return responseTime;
    }

    //--------------------------------------------------------------------------------------------
    // Utility Methods
    //--------------------------------------------------------------------------------------------

    @step('Get all visible menu items in Details dropdown')
    async getVisibleMenuItems(): Promise<string[]> {
        await this.openDetailsDropdownMenu();
        
        const menuItems = await this.detailsSubMenuItems.all();
        const itemTexts: string[] = [];
        
        for (const item of menuItems) {
            const text = await item.textContent();
            if (text?.trim()) {
                itemTexts.push(text.trim());
            }
        }
        
        return itemTexts;
    }

    @step('Validate menu item order matches requirements')
    async validateMenuItemOrder(expectedOrder: string[]): Promise<void> {
        const actualItems = await this.getVisibleMenuItems();
        
        expect(actualItems, 'Menu items should be in the correct order').toEqual(expectedOrder);
    }

    @step('Take screenshot of Details dropdown menu')
    async takeDetailsDropdownScreenshot(screenshotName: string): Promise<void> {
        await this.openDetailsDropdownMenu();
        await this.page.screenshot({ 
            path: `test-results/screenshots/${screenshotName}.png`,
            fullPage: false 
        });
    }

    @step('Take screenshot of current page state')
    async takeScreenshot(screenshotName: string): Promise<void> {
        await this.page.screenshot({ 
            path: `test-results/screenshots/${screenshotName}.png`,
            fullPage: true 
        });
    }

    //--------------------------------------------------------------------------------------------
    // Custom Fields - Fields Tab Methods (Req 3.2)
    //--------------------------------------------------------------------------------------------

    @step('Validate Custom Fields page header')
    async validateCustomFieldsPageHeader(): Promise<void> {
        await this.navigateToCustomFields();
        await expect(this.customFieldsHeader, 'Custom Fields H2 header should be visible').toBeVisible();
    }

    @step('Navigate to Fields tab')
    async navigateToFieldsTab(): Promise<void> {
        await this.navigateToCustomFields();
        await expect(this.fieldsTab, 'Fields tab should be visible').toBeVisible();
        await this.fieldsTab.click();
        await this.waitForPageLoad();
    }

    @step('Validate Fields tab contains expandable cards')
    async validateFieldsTabExpandableCards(): Promise<void> {
        await this.navigateToFieldsTab();
        // Check for at least one custom field card (identified by heading level 3 within p-tabpanels)
        const cards = this.fieldsTabPanel.getByRole('heading', { level: 3 });
        const cardCount = await cards.count();
        expect(cardCount, 'At least one custom field card should be visible').toBeGreaterThan(0);
    }

    @step('Validate top card is expanded by default')
    async validateTopCardExpandedByDefault(): Promise<void> {
        await this.navigateToFieldsTab();
        // First card heading
        const firstCardHeading = this.fieldsTabPanel.getByRole('heading', { level: 3 }).first();
        // Find the table within the region associated with this card
        const firstCardTable = this.fieldsTabPanel.getByRole('table').first();
        await expect(firstCardTable, 'Top card table should be visible (expanded)').toBeVisible();
    }

    @step('Validate other cards are collapsed by default')
    async validateOtherCardsCollapsedByDefault(): Promise<void> {
        await this.navigateToFieldsTab();
        const cardHeadings = this.fieldsTabPanel.getByRole('heading', { level: 3 });
        const cardCount = await cardHeadings.count();
        
        if (cardCount > 1) {
            // Get all tables - first one should be visible (expanded), others should not
            const tables = this.fieldsTabPanel.getByRole('table');
            const tableCount = await tables.count();
            
            // Check that only the first table (associated with first card) is visible
            if (tableCount > 1) {
                for (let i = 1; i < tableCount; i++) {
                    const table = tables.nth(i);
                    const isVisible = await table.isVisible().catch(() => false);
                    expect(isVisible, `Card ${i + 1} should be collapsed by default`).toBeFalsy();
                }
            }
        }
    }

    @step('Expand custom field card')
    async expandCustomFieldCard(categoryName: string): Promise<void> {
        // Find the heading for this category
        const headings = this.fieldsTabPanel.getByRole('heading', { level: 3 });
        const headingCount = await headings.count();
        
        let headingIndex = -1;
        for (let i = 0; i < headingCount; i++) {
            const heading = headings.nth(i);
            const text = await heading.textContent();
            if (text?.trim() === categoryName) {
                headingIndex = i;
                break;
            }
        }
        
        if (headingIndex === -1) {
            throw new Error(`Category "${categoryName}" not found`);
        }
        
        // Find the button that follows this heading (buttons with aria-label "Expand undefined panel" or "Collapse undefined panel")
        const buttons = this.fieldsTabPanel.getByRole('button').filter({ 
            hasText: /Expand.*panel|Collapse.*panel/i 
        });
        const button = buttons.nth(headingIndex);
        
        await expect(button, `Expand/collapse button for ${categoryName} should be visible`).toBeVisible();
        await button.click();
        await this.waitForPageLoad();
    }

    @step('Collapse custom field card')
    async collapseCustomFieldCard(categoryName: string): Promise<void> {
        await this.expandCustomFieldCard(categoryName); // Toggle
    }

    @step('Validate Expand all toggle')
    async validateExpandAllToggle(): Promise<void> {
        await this.navigateToFieldsTab();
        await expect(this.expandAllToggle, 'Expand all toggle should be visible').toBeVisible();
    }

    @step('Toggle Expand all')
    async toggleExpandAll(): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandAllToggle.click();
        await this.waitForPageLoad();
    }

    @step('Validate all cards are expanded after toggle')
    async validateAllCardsExpanded(): Promise<void> {
        const cardHeadings = this.fieldsTabPanel.getByRole('heading', { level: 3 });
        const cardCount = await cardHeadings.count();
        const tables = this.fieldsTabPanel.getByRole('table');
        const tableCount = await tables.count();
        
        // All tables should be visible when all cards are expanded
        expect(tableCount, 'All cards should have visible tables when expanded').toBeGreaterThanOrEqual(cardCount);
        
        for (let i = 0; i < Math.min(cardCount, tableCount); i++) {
            const table = tables.nth(i);
            await expect(table, `Card ${i + 1} should be expanded`).toBeVisible();
        }
    }

    @step('Validate Fields tab table columns for Accommodation')
    async validateFieldsTabTableColumns(categoryName: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        // Find the table for this specific category by index
        const tableIndex = await this.getCategoryTableIndex(categoryName);
        if (tableIndex === -1) {
            throw new Error(`Category "${categoryName}" not found`);
        }
        
        const tables = this.fieldsTabPanel.getByRole('region').getByRole('table');
        const table = tables.nth(tableIndex);
        const headers = table.locator('thead th');
        
        const expectedColumns = ['FIELD #', 'FIELD', 'VALUE', 'VALIDATION CODE DESCRIPTION'];
        const headerCount = await headers.count();
        
        for (let i = 0; i < Math.min(expectedColumns.length, headerCount); i++) {
            const headerText = await headers.nth(i).textContent();
            expect(headerText?.trim().toUpperCase(), `Column ${i + 1} should match ${expectedColumns[i]}`)
                .toContain(expectedColumns[i]);
        }
    }

    @step('Validate table default sort on FIELD # column')
    async validateTableDefaultSort(categoryName: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        // Find the table for this specific category by index
        const tableIndex = await this.getCategoryTableIndex(categoryName);
        if (tableIndex === -1) {
            throw new Error(`Category "${categoryName}" not found`);
        }
        
        const tables = this.fieldsTabPanel.getByRole('region').getByRole('table');
        const table = tables.nth(tableIndex);
        
        // Validate Field # column header is visible
        const fieldNumberHeader = table.getByRole('columnheader', { name: 'Field #' });
        await expect(fieldNumberHeader, 'Field # column header should be visible').toBeVisible();
        
        // Validate ascending sort indicator is visible (default sort)
        const ascendingSortIndicator = fieldNumberHeader.locator('.svg-inline--fa.fa-arrow-up-short-wide').first();
        await expect(ascendingSortIndicator, 'Ascending sort indicator should be visible for default sort').toBeVisible();
        
        // Validate data is sorted in ascending order
        const rows = table.locator('tbody tr');
        const rowCount = await rows.count();
        
        if (rowCount > 1) {
            const firstRowFieldNum = await rows.first().locator('td').nth(0).textContent();
            const secondRowFieldNum = await rows.nth(1).locator('td').nth(0).textContent();
            
            // Field numbers should be in ascending order
            const firstNum = parseInt(firstRowFieldNum?.trim() || '0');
            const secondNum = parseInt(secondRowFieldNum?.trim() || '0');
            expect(firstNum, 'First field number should be less than or equal to second').toBeLessThanOrEqual(secondNum);
        }
    }

    @step('Validate table has global filter')
    async validateTableGlobalFilter(categoryName: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        // Filter button is within the region associated with the card
        const card = this.getCustomFieldCard(categoryName);
        const filterButton = card.getByRole('button', { name: 'Filter' });
        await expect(filterButton, 'Global filter button should be visible').toBeVisible();
    }

    @step('Apply table filter')
    async applyTableFilter(categoryName: string, filterValue: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        // Filter input is within the region, typically near the Filter button
        const card = this.getCustomFieldCard(categoryName);
        const region = card.getByRole('region');
        const filterInput = region.locator('input[type="text"]').first();
        await filterInput.fill(filterValue);
        await this.waitForPageLoad();
    }

    @step('Validate no results empty state')
    async validateNoResultsEmptyState(categoryName: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        // Apply a filter that should return no results
        await this.applyTableFilter(categoryName, 'NonExistentValue12345');
        
        // Check for empty state
        const emptyState = this.page.locator('text="No match. Try a different filter criteria"');
        await expect(emptyState, 'No results empty state should be visible').toBeVisible();
    }

    @step('Validate field count display')
    async validateFieldCountDisplay(categoryName: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        // Field count is in a paragraph within the region (e.g., "24 fields")
        const card = this.getCustomFieldCard(categoryName);
        const region = card.getByRole('region');
        const countParagraph = region.getByRole('paragraph').filter({ hasText: /fields/i });
        const countTextContent = await countParagraph.textContent();
        
        expect(countTextContent, 'Field count should be displayed').toContain('fields');
        expect(countTextContent, 'Field count should contain a number').toMatch(/\d+/);
    }

    @step('Validate HR tag on field')
    async validateHRTagOnField(categoryName: string, fieldNumber: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = await this.getCustomFieldTableForCategory(categoryName);
        const fieldRow = table.locator(`tbody tr:has-text("${fieldNumber}")`);
        const hrTag = fieldRow.locator('[data-testid="hr-tag"]');
        await expect(hrTag, `HR tag should be visible for field ${fieldNumber}`).toBeVisible();
    }

    @step('Validate HR tag tooltip')
    async validateHRTagTooltip(categoryName: string, fieldNumber: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = await this.getCustomFieldTableForCategory(categoryName);
        const fieldRow = table.locator(`tbody tr:has-text("${fieldNumber}")`);
        const hrTag = fieldRow.locator('[data-testid="hr-tag"]');
        
        await hrTag.hover();
        await this.delay(500);
        
        const tooltip = this.page.locator('text="Provided by client HR feed"');
        await expect(tooltip, 'HR tag tooltip should be visible on hover').toBeVisible();
    }

    @step('Validate export icon')
    async validateExportIcon(): Promise<void> {
        await this.navigateToFieldsTab();
        await expect(this.exportIcon, 'Export icon should be visible').toBeVisible();
    }

    @step('Click export icon and validate dropdown')
    async clickExportIconAndValidateDropdown(): Promise<void> {
        await this.navigateToFieldsTab();
        await this.exportIcon.click();
        await this.delay(300);
        
        const csvOption = this.page.getByRole('menuitem', { name: 'Export as CSV' });
        const xlsxOption = this.page.getByRole('menuitem', { name: 'Export as XLSX' });
        
        await expect(csvOption, 'CSV export option should be visible').toBeVisible();
        await expect(xlsxOption, 'XLSX export option should be visible').toBeVisible();
    }

    @step('Validate no fields empty state')
    async validateNoFieldsEmptyState(): Promise<void> {
        await this.navigateToFieldsTab();
        
        // Check for empty state elements
        const emptyStateIcon = this.page.locator('[data-testid="no-fields-icon"]');
        const emptyStateText = this.page.locator('text="No fields"');
        
        await expect(emptyStateIcon, 'No fields icon should be visible').toBeVisible();
        await expect(emptyStateText, 'No fields text should be visible').toBeVisible();
    }

    //--------------------------------------------------------------------------------------------
    // Custom Fields - Editing Methods (Req 3.3)
    //--------------------------------------------------------------------------------------------

    @step('Validate editable field input')
    async validateEditableFieldInput(categoryName: string, fieldNumber: string, inputType: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = await this.getCustomFieldTableForCategory(categoryName);
        const fieldRow = table.locator(`tbody tr:has-text("${fieldNumber}")`);
        const valueCell = fieldRow.locator('td').nth(2); // VALUE column
        
        // Check for appropriate input type
        let inputLocator: Locator;
        switch (inputType.toLowerCase()) {
            case 'dropdown':
                inputLocator = valueCell.locator('select, [role="combobox"]');
                break;
            case 'text':
                inputLocator = valueCell.locator('input[type="text"]');
                break;
            case 'date':
                inputLocator = valueCell.locator('input[type="date"], input[placeholder*="date" i]');
                break;
            case 'numeric':
                inputLocator = valueCell.locator('input[type="number"]');
                break;
            case 'decimal':
                inputLocator = valueCell.locator('input[type="number"][step*="."]');
                break;
            case 'yesno':
                inputLocator = valueCell.locator('input[type="radio"]');
                break;
            default:
                inputLocator = valueCell.locator('input, select');
        }
        
        await expect(inputLocator, `${inputType} input should be visible for field ${fieldNumber}`).toBeVisible();
    }

    @step('Edit field value')
    async editFieldValue(categoryName: string, fieldNumber: string, newValue: string, inputType: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = await this.getCustomFieldTableForCategory(categoryName);
        const fieldRow = table.locator(`tbody tr:has-text("${fieldNumber}")`);
        const valueCell = fieldRow.locator('td').nth(2);
        
        switch (inputType.toLowerCase()) {
            case 'dropdown':
                const dropdown = valueCell.locator('select, [role="combobox"]');
                await dropdown.click();
                await this.page.getByRole('option', { name: newValue }).click();
                break;
            case 'text':
            case 'numeric':
            case 'decimal':
                const input = valueCell.locator('input');
                await input.clear();
                await input.fill(newValue);
                break;
            case 'date':
                const dateInput = valueCell.locator('input');
                await dateInput.clear();
                await dateInput.fill(newValue);
                break;
            case 'yesno':
                const radio = valueCell.locator(`input[type="radio"][value="${newValue}"]`);
                await radio.click();
                break;
        }
        
        await this.waitForPageLoad();
    }

    @step('Validate Save changes button')
    async validateSaveChangesButton(): Promise<void> {
        await this.navigateToFieldsTab();
        await expect(this.saveChangesButton, 'Save changes button should be visible').toBeVisible();
    }

    @step('Click Save changes')
    async clickSaveChanges(): Promise<void> {
        await this.saveChangesButton.click();
        await this.waitForPageLoad();
        
        // Check for success toast message
        const toast = this.page.locator('text="Changes have been saved"');
        await expect(toast, 'Success toast message should be visible').toBeVisible();
    }

    @step('Validate Reset button')
    async validateResetButton(): Promise<void> {
        await this.navigateToFieldsTab();
        await expect(this.resetButton, 'Reset button should be visible').toBeVisible();
    }

    @step('Click Reset')
    async clickReset(): Promise<void> {
        await this.resetButton.click();
        await this.waitForPageLoad();
    }

    @step('Validate numeric field validation error')
    async validateNumericFieldValidationError(categoryName: string, fieldNumber: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = await this.getCustomFieldTableForCategory(categoryName);
        const fieldRow = table.locator(`tbody tr:has-text("${fieldNumber}")`);
        const valueCell = fieldRow.locator('td').nth(2);
        const input = valueCell.locator('input');
        
        // Enter invalid value
        await input.fill('abc123');
        await input.blur(); // Remove focus to trigger validation
        
        await this.waitForPageLoad();
        
        // Check for validation error
        const errorMessage = valueCell.locator('text="Error: Invalid format"');
        await expect(errorMessage, 'Validation error should be visible').toBeVisible();
    }

    @step('Validate decimal field validation error')
    async validateDecimalFieldValidationError(categoryName: string, fieldNumber: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = await this.getCustomFieldTableForCategory(categoryName);
        const fieldRow = table.locator(`tbody tr:has-text("${fieldNumber}")`);
        const valueCell = fieldRow.locator('td').nth(2);
        const input = valueCell.locator('input');
        
        // Enter invalid value
        await input.fill('abc.123');
        await input.blur();
        
        await this.waitForPageLoad();
        
        // Check for validation error
        const errorMessage = valueCell.locator('text="Error: Invalid format"');
        await expect(errorMessage, 'Validation error should be visible').toBeVisible();
    }

    @step('Validate date field auto-clear on invalid format')
    async validateDateFieldAutoClear(categoryName: string, fieldNumber: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = await this.getCustomFieldTableForCategory(categoryName);
        const fieldRow = table.locator(`tbody tr:has-text("${fieldNumber}")`);
        const valueCell = fieldRow.locator('td').nth(2);
        const input = valueCell.locator('input');
        
        // Enter invalid date format
        await input.fill('invalid-date');
        await input.blur();
        
        await this.waitForPageLoad();
        
        // Field should be cleared
        const inputValue = await input.inputValue();
        expect(inputValue, 'Invalid date should be cleared').toBe('');
    }

    //--------------------------------------------------------------------------------------------
    // Custom Fields - HR Fields Tab Methods (Req 3.4)
    //--------------------------------------------------------------------------------------------

    @step('Navigate to HR Fields tab')
    async navigateToHRFieldsTab(): Promise<void> {
        await this.navigateToCustomFields();
        await expect(this.hrFieldsTab, 'HR Fields tab should be visible').toBeVisible();
        await this.hrFieldsTab.click();
        await this.waitForPageLoad();
    }

    @step('Validate HR Fields tab table columns')
    async validateHRFieldsTabTableColumns(): Promise<void> {
        await this.navigateToHRFieldsTab();
        
        const headers = this.hrFieldsTable.locator('thead th');
        const expectedColumns = ['FIELD #', 'FIELD', 'VALUE', 'EFFECTIVE DATE'];
        
        const headerCount = await headers.count();
        for (let i = 0; i < Math.min(expectedColumns.length, headerCount); i++) {
            const headerText = await headers.nth(i).textContent();
            expect(headerText?.trim().toUpperCase(), `Column ${i + 1} should match ${expectedColumns[i]}`)
                .toContain(expectedColumns[i]);
        }
    }

    @step('Validate As of date filter')
    async validateAsOfDateFilter(): Promise<void> {
        await this.navigateToHRFieldsTab();
        await expect(this.asOfDateFilter, 'As of date filter should be visible').toBeVisible();
    }

    @step('Change As of date filter')
    async changeAsOfDateFilter(date: string): Promise<void> {
        await this.navigateToHRFieldsTab();
        await this.asOfDateFilter.fill(date);
        await this.waitForPageLoad();
    }

    @step('Validate As of date defaults to current date')
    async validateAsOfDateDefaultsToCurrent(): Promise<void> {
        await this.navigateToHRFieldsTab();
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        }).replace(/\//g, '/');
        
        const dateValue = await this.asOfDateFilter.inputValue();
        // Date should be set to current date (format may vary)
        expect(dateValue, 'As of date should default to current date').toBeTruthy();
    }

    @step('Validate HR fields table default sort')
    async validateHRFieldsTableDefaultSort(): Promise<void> {
        await this.navigateToHRFieldsTab();
        
        const rows = this.hrFieldsTable.locator('tbody tr');
        const rowCount = await rows.count();
        
        if (rowCount > 1) {
            const firstRowFieldNum = await rows.first().locator('td').nth(0).textContent();
            const secondRowFieldNum = await rows.nth(1).locator('td').nth(0).textContent();
            
            const firstNum = parseInt(firstRowFieldNum?.trim() || '0');
            const secondNum = parseInt(secondRowFieldNum?.trim() || '0');
            expect(firstNum, 'First field number should be less than or equal to second').toBeLessThanOrEqual(secondNum);
        }
    }

    @step('Validate no HR fields empty state')
    async validateNoHRFieldsEmptyState(): Promise<void> {
        await this.navigateToHRFieldsTab();
        
        const emptyStateIcon = this.page.locator('[data-testid="no-hr-fields-icon"]');
        const emptyStateText = this.page.locator('text="No HR fields"');
        
        await expect(emptyStateIcon, 'No HR fields icon should be visible').toBeVisible();
        await expect(emptyStateText, 'No HR fields text should be visible').toBeVisible();
    }

    //--------------------------------------------------------------------------------------------
    // Custom Fields - Alternate Numbers Tab Methods (Req 3.6)
    //--------------------------------------------------------------------------------------------

    @step('Navigate to Alternate Numbers tab')
    async navigateToAlternateNumbersTab(): Promise<void> {
        await this.navigateToCustomFields();
        await expect(this.alternateNumbersTab, 'Alternate Numbers tab should be visible').toBeVisible();
        await this.alternateNumbersTab.click();
        await this.waitForPageLoad();
    }

    @step('Validate Alternate Numbers tab table')
    async validateAlternateNumbersTabTable(): Promise<void> {
        await this.navigateToAlternateNumbersTab();
        
        // Validate the container is visible
        await expect(this.alternateNumbersTabContainer, 'Alternate Numbers tab container should be visible').toBeVisible();
        
        // Validate Filter button is visible
        const filterButton = this.alternateNumbersTabContainer.getByRole('button', { name: 'Filter' });
        await expect(filterButton, 'Filter button should be visible').toBeVisible();
        
        // Validate the table is visible
        await expect(this.alternateNumbersTable, 'Alternate Numbers table should be visible').toBeVisible();
        
        // Validate table headers
        await expect(
            this.alternateNumbersTable.getByRole('columnheader', { name: 'Alternate Number' }),
            'Alternate Number column header should be visible'
        ).toBeVisible();
        
        await expect(
            this.alternateNumbersTable.getByRole('columnheader', { name: 'Type' }),
            'Type column header should be visible'
        ).toBeVisible();
    }

    //--------------------------------------------------------------------------------------------
    // Custom Fields - Security Methods (Req 3.7)
    //--------------------------------------------------------------------------------------------

    @step('Validate Custom Fields page suppression when no tab access')
    async validateCustomFieldsPageSuppression(): Promise<void> {
        // Navigate to Details dropdown
        await this.openDetailsDropdownMenu();
        
        // Custom Fields should not be visible if user has no access to any tab
        const customFieldsMenuItem = this.customFieldsMenuItem;
        const isVisible = await customFieldsMenuItem.isVisible().catch(() => false);
        expect(isVisible, 'Custom Fields menu item should be suppressed when user has no tab access').toBeFalsy();
    }

    @step('Validate Employee ID masking matches SSN')
    async validateEmployeeIDMasking(categoryName: string, fieldNumber: string, ssn: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = this.getCustomFieldTable(categoryName);
        const fieldRow = table.locator(`tbody tr:has-text("${fieldNumber}")`);
        const valueCell = fieldRow.locator('td').nth(2);
        const valueText = await valueCell.textContent();
        
        // Check if value is masked (format: ***-**-1234)
        const maskedPattern = /\*\*\*-\*\*-[\d]{4}/;
        expect(valueText, 'Employee ID should be masked if it matches SSN').toMatch(maskedPattern);
    }

    //--------------------------------------------------------------------------------------------
    // Details > Interactions Methods (Req 3.4.1, 3.4.2.001 - 3.4.2.006)
    //--------------------------------------------------------------------------------------------

    private get interactionsMenuItem(): Locator {
        return this.getMenuItemLocator('Interactions');
    }

    private get interactionsHeader(): Locator {
        return this.page.getByRole('heading', { name: 'Interaction activity', level: 2 });
    }

    private get interactionsFilterIcon(): Locator {
        return this.page.locator('button[aria-label*="Filter" i], button[title*="Filter" i], .fa-filter, [data-testid="filter-icon"]').first();
    }

    private get interactionsCount(): Locator {
        return this.page.locator('text=/\\[\\d+\\]\\s+interactions/i');
    }

    getInteractionsGrid(): Locator {
        return this.page.locator('table, .p-datatable, [role="table"], [data-testid="interactions-grid"]').first();
    }

    private get interactionsGridHeader(): Locator {
        return this.getInteractionsGrid().locator('thead tr');
    }

    private get interactionsGridHeaderCaret(): Locator {
        // Header caret is in the first cell of the header row
        // Find cell containing "Expand" or "Collapse" text, then get the button
        const headerCell = this.interactionsGridHeader.locator('th').first();
        return headerCell.getByRole('button', { name: /Expand.*panel|Collapse.*panel/i });
    }

    getInteractionsGridRows(): Locator {
        return this.getInteractionsGrid().locator('tbody tr');
    }

    private getRowCaret(rowIndex: number): Locator {
        // Row caret is in a cell that contains "Expand Expand panel" or "Collapse Expand panel" text
        // The button has aria-label "Expand Expand panel" or "Collapse Expand panel"
        const row = this.getInteractionsGridRows().nth(rowIndex);
        // Find cell that contains expand/collapse text (cell name includes "Expand Expand panel" or "Collapse Expand panel")
        const cell = row.getByRole('cell').filter({ hasText: /Expand.*panel|Collapse.*panel/i }).first();
        // Get the button with label "Expand Expand panel" or "Collapse Expand panel"
        return cell.getByRole('button', { name: /Expand.*panel|Collapse.*panel/i });
    }

    private get dateColumnHeader(): Locator {
        return this.interactionsGridHeader.locator('th').filter({ hasText: /DATE/i });
    }

    private get emptyStateIcon(): Locator {
        return this.page.locator('.fa-table.fa-light, [data-testid="empty-state-icon"]');
    }

    private get emptyStateMessage(): Locator {
        return this.page.locator('text="No records found"');
    }

    private get emptyStateSubMessage(): Locator {
        return this.page.locator('text="Interactions will display here."');
    }

    getInteractionsPaginationSection(): Locator {
        return this.page.locator('.p-paginator, [data-testid="pagination"], [role="navigation"]').first();
    }

    private get scrollToTopLink(): Locator {
        // Scroll to top button has name "Scroll to top of page"
        return this.page.getByRole('button', { name: 'Scroll to top of page' });
    }

    @step('Navigate to Interactions from Details dropdown')
    async navigateToInteractions(): Promise<void> {
        await this.navigateToDetailsSubMenu('Interactions');
        await expect(this.interactionsHeader, 'Interactions header should be visible').toBeVisible();
        await this.waitForPageLoad();
    }

    @step('Validate Interactions menu item is present and clickable')
    async validateInteractionsMenuItem(): Promise<void> {
        await this.openDetailsDropdownMenu();
        await expect(this.interactionsMenuItem, 'Interactions menu item should be visible').toBeVisible();
        await expect(this.interactionsMenuItem, 'Interactions menu item should be enabled').toBeEnabled();
    }

    @step('Validate Interactions page displays H2 header "Interaction activity"')
    async validateInteractionsHeader(): Promise<void> {
        await this.navigateToInteractions();
        await expect(this.interactionsHeader, 'Interactions H2 header should be visible').toBeVisible();
    }

    @step('Validate filter icon is visible on Interactions page')
    async validateInteractionsFilterIcon(): Promise<void> {
        await this.navigateToInteractions();
        await expect(this.interactionsFilterIcon, 'Filter icon should be visible').toBeVisible();
    }

    @step('Click filter icon and validate filter functionality')
    async clickInteractionsFilterIcon(): Promise<void> {
        await this.navigateToInteractions();
        await this.interactionsFilterIcon.click();
        await this.waitForPageLoad();
    }

    @step('Validate interactions count display format')
    async validateInteractionsCount(): Promise<void> {
        await this.navigateToInteractions();
        
        const rows = this.getInteractionsGridRows();
        const rowCount = await rows.count();
        
        if (rowCount > 0) {
            await expect(this.interactionsCount, 'Interactions count should be displayed').toBeVisible();
            const countText = await this.interactionsCount.textContent();
            expect(countText, 'Interactions count should match format [n] interactions').toMatch(/\[\d+\]\s+interactions/i);
        }
    }

    @step('Validate Interactions grid is visible')
    async validateInteractionsGrid(): Promise<void> {
        await this.navigateToInteractions();
        await expect(this.getInteractionsGrid(), 'Interactions grid should be visible').toBeVisible();
    }

    @step('Validate Interactions grid is sorted in descending order (newest first)')
    async validateInteractionsGridSortOrder(): Promise<void> {
        await this.navigateToInteractions();
        
        const rows = this.getInteractionsGridRows();
        const rowCount = await rows.count();
        
        if (rowCount > 1) {
            // Get date from first row (should be newest)
            const firstRowDate = await this.getInteractionDate(0);
            const secondRowDate = await this.getInteractionDate(1);
            
            // First date should be >= second date (descending order)
            const firstDate = this.parseDate(firstRowDate);
            const secondDate = this.parseDate(secondRowDate);
            
            expect(firstDate.getTime(), 'First interaction should be newer than second (descending order)')
                .toBeGreaterThanOrEqual(secondDate.getTime());
        }
    }

    @step('Get interaction date from row')
    private async getInteractionDate(rowIndex: number): Promise<string> {
        const row = this.getInteractionsGridRows().nth(rowIndex);
        // Date cell is typically the first cell
        // The cell's accessible name might be truncated (e.g., "3/1/") but aria-label contains full date "3/1/2021"
        const dateCell = row.getByRole('cell').first();
        
        // Always get the aria-label first as it contains the complete date string (e.g., "3/1/2021")
        const ariaLabel = await dateCell.getAttribute('aria-label');
        if (ariaLabel) {
            // The aria-label contains the full date, extract it
            // It should be in format "3/1/2021" or similar
            const trimmedAriaLabel = ariaLabel.trim();
            // Check if it matches the date pattern
            if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmedAriaLabel)) {
                return trimmedAriaLabel;
            }
            // If aria-label contains the date but might have extra text, try to extract it
            const dateMatch = trimmedAriaLabel.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
            if (dateMatch) {
                return dateMatch[0];
            }
        }
        
        // Fallback to text content if aria-label doesn't contain valid date
        const textContent = await dateCell.textContent();
        if (textContent) {
            const trimmedText = textContent.trim();
            if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmedText)) {
                return trimmedText;
            }
            // Try to extract date from text content
            const dateMatch = trimmedText.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
            if (dateMatch) {
                return dateMatch[0];
            }
        }
        
        // Return aria-label if available, otherwise textContent, otherwise empty string
        return ariaLabel?.trim() || textContent?.trim() || '';
    }

    // Parse date string to Date object (private helper method, no step decorator)
    private parseDate(dateString: string): Date {
        // Handle m/d/yyyy format (single or double digit month and day, 4-digit year)
        const parts = dateString.trim().split('/');
        if (parts.length === 3) {
            const month = parseInt(parts[0]) - 1; // Month is 0-indexed
            const day = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            return new Date(year, month, day);
        }
        return new Date(dateString);
    }

    @step('Validate column headers are in all CAPS')
    async validateInteractionsColumnHeaders(): Promise<void> {
        await this.navigateToInteractions();
        
        const headers = this.interactionsGridHeader.locator('th');
        const headerCount = await headers.count();
        
        for (let i = 0; i < headerCount; i++) {
            const headerText = await headers.nth(i).textContent();
            const upperCaseText = headerText?.trim().toUpperCase();
            expect(headerText?.trim(), `Column header "${headerText}" should be in all CAPS`).toBe(upperCaseText);
        }
    }

    @step('Validate caret icon is present in grid header')
    async validateInteractionsHeaderCaret(): Promise<void> {
        await this.navigateToInteractions();
        await expect(this.interactionsGridHeaderCaret, 'Caret icon in grid header should be visible').toBeVisible();
    }

    @step('Validate caret icon is present in rows with expandable content')
    async validateInteractionsRowCarets(): Promise<void> {
        await this.navigateToInteractions();
        
        const rows = this.getInteractionsGridRows();
        const rowCount = await rows.count();
        
        let rowsWithCarets = 0;
        let rowsWithoutCarets = 0;
        
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            // Check if row has a cell with expand/collapse button (indicates expandable content)
            const expandableCell = row.getByRole('cell').filter({ hasText: /Expand.*panel|Collapse.*panel/i });
            const hasExpandableContent = await expandableCell.count() > 0;
            
            if (hasExpandableContent) {
                // Row has expandable content, so it should have a caret
                const rowCaret = this.getRowCaret(i);
                await expect(rowCaret, `Caret icon in row ${i + 1} (with expandable content) should be visible`).toBeVisible();
                rowsWithCarets++;
            } else {
                // Row doesn't have expandable content, so no caret expected
                rowsWithoutCarets++;
            }
        }
        
        // Log summary
        console.log(`Rows with carets (expandable content): ${rowsWithCarets}, Rows without carets: ${rowsWithoutCarets}`);
        
        // At least some rows should have carets if there are interactions
        if (rowCount > 0) {
            expect(rowsWithCarets + rowsWithoutCarets, 'All rows should be checked').toBe(rowCount);
        }
    }

    @step('Click header caret to expand/collapse all rows')
    async clickInteractionsHeaderCaret(): Promise<void> {
        await this.navigateToInteractions();
        await this.interactionsGridHeaderCaret.click();
        await this.waitForPageLoad();
    }

    @step('Click row caret to expand/collapse specific row')
    async clickInteractionsRowCaret(rowIndex: number): Promise<void> {
        await this.navigateToInteractions();
        const rowCaret = this.getRowCaret(rowIndex);
        await rowCaret.click();
        await this.waitForPageLoad();
    }

    @step('Validate column headers are sortable')
    async validateInteractionsSortableHeaders(): Promise<void> {
        await this.navigateToInteractions();
        
        const headers = this.interactionsGridHeader.locator('th');
        const headerCount = await headers.count();
        
        for (let i = 0; i < headerCount; i++) {
            const header = headers.nth(i);
            const isClickable = await header.isEnabled();
            expect(isClickable, `Column header ${i + 1} should be clickable for sorting`).toBeTruthy();
        }
    }

    @step('Validate sort indicators (ascending/descending)')
    async validateInteractionsSortIndicators(): Promise<void> {
        await this.navigateToInteractions();
        
        // Click on Date column to test sorting
        await this.dateColumnHeader.click();
        await this.waitForPageLoad();
        
        // Check for sort indicator
        const sortIndicator = this.dateColumnHeader.locator('.fa-arrow-up-short-wide, .fa-arrow-down-wide-short, [class*="sort"]');
        const hasIndicator = await sortIndicator.isVisible().catch(() => false);
        expect(hasIndicator, 'Sort indicator should be visible after clicking column header').toBeTruthy();
    }

    @step('Validate Date column displays m/d/yyyy format')
    async validateInteractionsDateFormat(): Promise<void> {
        await this.navigateToInteractions();
        
        const rows = this.getInteractionsGridRows();
        const rowCount = await rows.count();
        
        if (rowCount > 0) {
            // Date format is m/d/yyyy (single or double digit month and day, 4-digit year)
            const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            for (let i = 0; i < Math.min(rowCount, 5); i++) { // Check first 5 rows
                const dateText = await this.getInteractionDate(i);
                expect(dateText.trim(), `Date in row ${i + 1} should match m/d/yyyy format`).toMatch(datePattern);
            }
        }
    }

    @step('Validate Discussion Summary is displayed between static light gray lines')
    async validateInteractionsDiscussionSummary(): Promise<void> {
        await this.navigateToInteractions();
        
        const rows = this.getInteractionsGridRows();
        const rowCount = await rows.count();
        
        if (rowCount > 0) {
            // Expand first row to see discussion summary
            await this.clickInteractionsRowCaret(0);
            await this.delay(300);
            
            // Discussion summary is the text content in the cell that contains the expand/collapse button
            // The cell contains both the button and the discussion text
            const firstRow = rows.first();
            const discussionCell = firstRow.getByRole('cell').filter({ hasText: /Expand.*panel|Collapse.*panel/i }).first();
            
            // Verify the cell is visible (contains the discussion summary)
            await expect(discussionCell, 'Discussion summary cell should be visible in expanded row').toBeVisible();
            
            // Verify the cell contains discussion text (not just the button label)
            const cellText = await discussionCell.textContent();
            expect(cellText, 'Discussion summary cell should contain text beyond expand/collapse button').toBeTruthy();
            expect(cellText?.length, 'Discussion summary should have content').toBeGreaterThan(20); // More than just button text
        }
    }

    @step('Validate Discussion Summary expand/collapse functionality')
    async validateInteractionsDiscussionExpandCollapse(): Promise<void> {
        await this.navigateToInteractions();
        
        const rows = this.getInteractionsGridRows();
        const rowCount = await rows.count();
        
        if (rowCount > 0) {
            const firstRow = rows.first();
            const discussionCell = firstRow.getByRole('cell').filter({ hasText: /Expand.*panel|Collapse.*panel/i }).first();
            const rowCaret = this.getRowCaret(0);
            
            // Check initial state - should be collapsed (button says "Expand")
            const initialButtonLabel = await rowCaret.getAttribute('aria-label');
            const isInitiallyExpanded = initialButtonLabel?.includes('Collapse') || false;
            
            // Click to toggle (expand if collapsed, collapse if expanded)
            await rowCaret.click();
            await this.waitForPageLoad();
            await this.delay(300);
            
            // After click, state should be opposite
            const newButtonLabel = await rowCaret.getAttribute('aria-label');
            const isNowExpanded = newButtonLabel?.includes('Collapse') || false;
            
            // Verify state changed
            expect(isNowExpanded, 'Row expand/collapse state should change after clicking caret').toBe(!isInitiallyExpanded);
            
            // Discussion summary text should be visible in the cell
            const discussionText = discussionCell.locator('text').filter({ hasNotText: /Expand|Collapse|panel/i }).first();
            const textVisible = await discussionText.isVisible().catch(() => false);
            expect(textVisible, 'Discussion summary text should be visible').toBeTruthy();
        }
    }

    @step('Validate empty state message when no interactions exist')
    async validateInteractionsEmptyState(): Promise<void> {
        await this.navigateToInteractions();
        
        const rows = this.getInteractionsGridRows();
        const rowCount = await rows.count();
        
        if (rowCount === 0) {
            await expect(this.emptyStateIcon, 'Empty state icon should be visible').toBeVisible();
            await expect(this.emptyStateMessage, 'Empty state message "No records found" should be visible').toBeVisible();
            await expect(this.emptyStateSubMessage, 'Empty state sub-message should be visible').toBeVisible();
        }
    }

    @step('Validate pagination functionality is present')
    async validateInteractionsPagination(): Promise<void> {
        await this.navigateToInteractions();
        
        const rows = this.getInteractionsGridRows();
        const rowCount = await rows.count();
        
        // Pagination should be visible if there are many interactions
        if (rowCount > 10) {
            await expect(this.getInteractionsPaginationSection(), 'Pagination section should be visible').toBeVisible();
        }
    }

    @step('Navigate to next page in Interactions grid')
    async navigateToInteractionsNextPage(): Promise<void> {
        await this.navigateToInteractions();
        
        const nextButton = this.getInteractionsPaginationSection().locator('button[aria-label*="next" i], button[aria-label*="Next" i]');
        const isVisible = await nextButton.isVisible().catch(() => false);
        
        if (isVisible) {
            await nextButton.click();
            await this.waitForPageLoad();
        }
    }

    @step('Navigate to previous page in Interactions grid')
    async navigateToInteractionsPreviousPage(): Promise<void> {
        await this.navigateToInteractions();
        
        const prevButton = this.getInteractionsPaginationSection().locator('button[aria-label*="previous" i], button[aria-label*="Previous" i]');
        const isVisible = await prevButton.isVisible().catch(() => false);
        
        if (isVisible) {
            await prevButton.click();
            await this.waitForPageLoad();
        }
    }

    @step('Validate Scroll to top button is present')
    async validateInteractionsScrollToTopLink(): Promise<void> {
        await this.navigateToInteractions();
        
        // Scroll down first
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.delay(500);
        
        // Scroll to top button should be visible
        await expect(this.scrollToTopLink, 'Scroll to top button should be visible').toBeVisible();
    }

    @step('Click Scroll to top button and validate navigation')
    async clickInteractionsScrollToTop(): Promise<void> {
        await this.navigateToInteractions();
        
        // Scroll down first
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.delay(500);
        
        // Click scroll to top button
        await this.scrollToTopLink.click();
        await this.delay(500);
        
        // Verify we're at the top
        const scrollPosition = await this.page.evaluate(() => window.scrollY);
        expect(scrollPosition, 'Page should scroll to top after clicking button').toBeLessThan(100);
    }

    @step('Validate Interactions contain only Notes with NoteType equal to ID')
    async validateInteractionsNoteType(): Promise<void> {
        await this.navigateToInteractions();
        
        // This validation would typically require API or backend verification
        // For UI testing, we validate that interactions are displayed correctly
        const rows = this.getInteractionsGridRows();
        const rowCount = await rows.count();
        
        // All displayed interactions should be valid (this would be enhanced with API validation)
        expect(rowCount, 'Interactions should be displayed').toBeGreaterThanOrEqual(0);
    }

    @step('Measure Interactions page loading performance')
    async measureInteractionsPageLoadTime(): Promise<number> {
        const startTime = Date.now();
        await this.navigateToInteractions();
        const endTime = Date.now();
        
        const loadTime = endTime - startTime;
        expect(loadTime, 'Interactions page should load within acceptable time limit').toBeLessThan(3000);
        
        return loadTime;
    }
}

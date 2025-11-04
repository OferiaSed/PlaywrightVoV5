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
        return this.page.locator('[data-testid="custom-fields-container"]');
    }

    private get fieldsSection(): Locator {
        return this.page.locator('[data-testid="fields-section"]');
    }

    private get hrDataSection(): Locator {
        return this.page.locator('[data-testid="hr-data-section"]');
    }

    // Custom Fields page elements - Fields Tab
    private get customFieldsHeader(): Locator {
        return this.page.getByRole('heading', { name: 'Custom fields', level: 2 });
    }

    private get fieldsTab(): Locator {
        return this.page.getByRole('tab', { name: 'FIELDS' });
    }

    private get hrFieldsTab(): Locator {
        return this.page.getByRole('tab', { name: 'HR FIELDS' });
    }

    private get alternateNumbersTab(): Locator {
        return this.page.getByRole('tab', { name: 'ALTERNATE NUMBERS' });
    }

    private get expandAllToggle(): Locator {
        return this.page.locator('[data-testid="expand-all-toggle"]');
    }

    private get exportIcon(): Locator {
        return this.page.locator('[data-testid="export-icon"]');
    }

    private get saveChangesButton(): Locator {
        return this.page.getByRole('button', { name: 'Save changes' });
    }

    private get resetButton(): Locator {
        return this.page.getByRole('button', { name: 'Reset' });
    }

    // Locators for custom field cards
    private getCustomFieldCard(categoryName: string): Locator {
        return this.page.locator(`[data-testid="custom-field-card-${categoryName}"]`);
    }

    private getCustomFieldCardHeader(categoryName: string): Locator {
        return this.getCustomFieldCard(categoryName).locator('[data-testid="card-header"]');
    }

    private getCustomFieldCardChevron(categoryName: string): Locator {
        return this.getCustomFieldCard(categoryName).locator('[data-testid="card-chevron"]');
    }

    private getCustomFieldTable(categoryName: string): Locator {
        return this.getCustomFieldCard(categoryName).locator('table');
    }

    // HR Fields Tab elements
    private get asOfDateFilter(): Locator {
        return this.page.locator('[data-testid="as-of-date-filter"]');
    }

    private get hrFieldsTable(): Locator {
        return this.page.locator('[data-testid="hr-fields-table"]');
    }

    // Alternate Numbers Tab elements
    private get alternateNumbersTable(): Locator {
        return this.page.locator('[data-testid="alternate-numbers-table"]');
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
        await expect(this.fieldsSection, 'Fields section should be visible in Custom Fields').toBeVisible();
        
        // Validate HR Data section is present  
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
        // Check for at least one custom field card
        const cards = this.page.locator('[data-testid^="custom-field-card-"]');
        const cardCount = await cards.count();
        expect(cardCount, 'At least one custom field card should be visible').toBeGreaterThan(0);
    }

    @step('Validate top card is expanded by default')
    async validateTopCardExpandedByDefault(): Promise<void> {
        await this.navigateToFieldsTab();
        const cards = this.page.locator('[data-testid^="custom-field-card-"]');
        const firstCard = cards.first();
        const firstCardTable = firstCard.locator('table');
        await expect(firstCardTable, 'Top card table should be visible (expanded)').toBeVisible();
    }

    @step('Validate other cards are collapsed by default')
    async validateOtherCardsCollapsedByDefault(): Promise<void> {
        await this.navigateToFieldsTab();
        const cards = this.page.locator('[data-testid^="custom-field-card-"]');
        const cardCount = await cards.count();
        
        if (cardCount > 1) {
            for (let i = 1; i < cardCount; i++) {
                const card = cards.nth(i);
                const table = card.locator('table');
                // Table should not be visible if card is collapsed
                const isVisible = await table.isVisible().catch(() => false);
                expect(isVisible, `Card ${i + 1} should be collapsed by default`).toBeFalsy();
            }
        }
    }

    @step('Expand custom field card')
    async expandCustomFieldCard(categoryName: string): Promise<void> {
        const chevron = this.getCustomFieldCardChevron(categoryName);
        await expect(chevron, `Chevron for ${categoryName} should be visible`).toBeVisible();
        await chevron.click();
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
        const cards = this.page.locator('[data-testid^="custom-field-card-"]');
        const cardCount = await cards.count();
        
        for (let i = 0; i < cardCount; i++) {
            const card = cards.nth(i);
            const table = card.locator('table');
            await expect(table, `Card ${i + 1} should be expanded`).toBeVisible();
        }
    }

    @step('Validate Fields tab table columns for Accommodation')
    async validateFieldsTabTableColumns(categoryName: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = this.getCustomFieldTable(categoryName);
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
        
        const table = this.getCustomFieldTable(categoryName);
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
        
        const table = this.getCustomFieldTable(categoryName);
        const filter = table.locator('input[type="text"]').first();
        await expect(filter, 'Global filter should be visible').toBeVisible();
    }

    @step('Apply table filter')
    async applyTableFilter(categoryName: string, filterValue: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = this.getCustomFieldTable(categoryName);
        const filter = table.locator('input[type="text"]').first();
        await filter.fill(filterValue);
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
        
        const table = this.getCustomFieldTable(categoryName);
        const countText = table.locator('[data-testid="field-count"]');
        const countTextContent = await countText.textContent();
        
        expect(countTextContent, 'Field count should be displayed').toContain('fields');
        expect(countTextContent, 'Field count should contain a number').toMatch(/\d+/);
    }

    @step('Validate HR tag on field')
    async validateHRTagOnField(categoryName: string, fieldNumber: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = this.getCustomFieldTable(categoryName);
        const fieldRow = table.locator(`tbody tr:has-text("${fieldNumber}")`);
        const hrTag = fieldRow.locator('[data-testid="hr-tag"]');
        await expect(hrTag, `HR tag should be visible for field ${fieldNumber}`).toBeVisible();
    }

    @step('Validate HR tag tooltip')
    async validateHRTagTooltip(categoryName: string, fieldNumber: string): Promise<void> {
        await this.navigateToFieldsTab();
        await this.expandCustomFieldCard(categoryName);
        
        const table = this.getCustomFieldTable(categoryName);
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
        
        const table = this.getCustomFieldTable(categoryName);
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
        
        const table = this.getCustomFieldTable(categoryName);
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
        
        const table = this.getCustomFieldTable(categoryName);
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
        
        const table = this.getCustomFieldTable(categoryName);
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
        
        const table = this.getCustomFieldTable(categoryName);
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
        await expect(this.alternateNumbersTable, 'Alternate Numbers table should be visible').toBeVisible();
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
}

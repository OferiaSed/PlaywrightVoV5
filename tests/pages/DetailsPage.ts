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
        return this.page.getByRole('tab', { name: 'Details' });
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
}

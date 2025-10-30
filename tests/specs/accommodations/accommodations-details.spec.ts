import { test, expect } from '../../fixtures/BaseTest';
import { ExcelReader } from '../../../utils/helpers/excel-reader';

/**
 * Accommodations Details Test Suite
 * 
 * This test suite validates the Details General Information functionality for Accommodation claims
 * based on requirements 3.4.001, 3.4.002, 3.4.003, and 3.4.4.001 from the JURIS Accommodations BRD.
 * 
 * Requirements Coverage:
 * - 3.4.001: Details tab dropdown sub-menu items (Accommodations, Time Tracking, Contacts, Custom Fields)
 * - 3.4.002: Items NOT displayed for accommodation claims (Benefit Plan, Medical, Legal, Appeals, Tender, Plan Summary)
 * - 3.4.003: Financials tab exclusion for JURIS Accommodations
 * - 3.4.4.001: Custom Fields functionality, security, positioning, and data sections
 * 
 * Test Data Source: C:\DataVoV\DataDriverVovQA.xlsx
 * Test Data Sheets: AccommodationDetails, AccommodationClaims, JURISAccommodations, CustomFieldsData
 */

test.describe('Accommodations Details - Requirement 3.4.001: Details Tab Dropdown Menu Items', () => {
    
    test.beforeEach(async ({ login, view }) => {
        // Navigate to an accommodation claim for testing
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Req 3.4.001 - Validate Details tab contains Accommodations menu item', async ({ details, page }) => {
        await page.getByText('Details').click();
        await page.getByText('Details').click();
        await page.getByText('Accommodations', { exact: true }).click();
        await page.getByRole('tab', { name: 'Details' }).click();// Verify Accommodations is present in Details dropdown
        await details.validateAccommodationsMenuItem();
    });

    test('Req 3.4.001 - Validate Details tab contains Time Tracking menu item', async ({ details }) => {
        // Verify Time Tracking is present in Details dropdown
        await details.validateTimeTrackingMenuItem();
    });

    test('Req 3.4.001 - Validate Details tab contains Contacts menu item', async ({ details }) => {
        // Verify Contacts is present in Details dropdown
        await details.validateContactsMenuItem();
    });

    test('Req 3.4.001 - Validate Details tab contains Custom Fields menu item', async ({ details }) => {
        // Verify Custom Fields is present in Details dropdown
        await details.validateCustomFieldsMenuItem();
    });

    test('Req 3.4.001 - Validate all required dropdown menu items are present', async ({ details }) => {
        // Comprehensive validation of all required menu items
        await details.validateRequiredDetailsMenuItems();
        
        // Verify menu order is correct
        const expectedOrder = ['Accommodations', 'Time Tracking', 'Contacts', 'Custom Fields'];
        await details.validateMenuItemOrder(expectedOrder);
        
        // Take screenshot for visual validation
        await details.takeDetailsDropdownScreenshot('accommodations-details-menu-items');
    });

    test('Req 3.4.001 - Navigate to each Details sub-menu item successfully', async ({ details }) => {
        // Test navigation to each required menu item
        await details.navigateToDetailsSubMenu('Accommodations');
        await details.navigateToDetailsSubMenu('Time Tracking');
        await details.navigateToDetailsSubMenu('Contacts');
        await details.navigateToDetailsSubMenu('Custom Fields');
    });
});

test.describe('Accommodations Details - Requirement 3.4.002: Excluded Menu Items', () => {
    
    test.beforeEach(async ({ login, view }) => {
        // Navigate to an accommodation claim for testing
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Req 3.4.002 - Validate Benefit Plan is NOT displayed for accommodation claims', async ({ details }) => {
        // Verify Benefit Plan menu item is excluded
        await details.validateBenefitPlanNotDisplayed();
    });

    test('Req 3.4.002 - Validate Medical is NOT displayed for accommodation claims', async ({ details }) => {
        // Verify Medical menu item is excluded
        await details.validateMedicalNotDisplayed();
    });

    test('Req 3.4.002 - Validate Legal is NOT displayed for accommodation claims', async ({ details }) => {
        // Verify Legal menu item is excluded
        await details.validateLegalNotDisplayed();
    });

    test('Req 3.4.002 - Validate Appeals is NOT displayed for accommodation claims', async ({ details }) => {
        // Verify Appeals menu item is excluded
        await details.validateAppealsNotDisplayed();
    });

    test('Req 3.4.002 - Validate Tender is NOT displayed for accommodation claims', async ({ details }) => {
        // Verify Tender menu item is excluded
        await details.validateTenderNotDisplayed();
    });

    test('Req 3.4.002 - Validate Plan Summary is NOT displayed for accommodation claims', async ({ details }) => {
        // Verify Plan Summary menu item is excluded
        await details.validatePlanSummaryNotDisplayed();
    });

    test('Req 3.4.002 - Validate all excluded menu items are NOT displayed', async ({ details }) => {
        // Comprehensive validation of all excluded items
        await details.validateExcludedMenuItemsForAccommodationClaims();
        
        // Take screenshot to document excluded items
        await details.takeDetailsDropdownScreenshot('accommodations-excluded-menu-items');
    });
});

test.describe('Accommodations Details - Requirement 3.4.003: Financials Tab Exclusion', () => {
    
    test.beforeEach(async ({ login, view }) => {
        // Navigate to an accommodation claim for testing
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Req 3.4.003 - Validate Financials tab is NOT displayed for JURIS Accommodations', async ({ details }) => {
        // Verify Financials tab is excluded for JURIS Accommodation claims
        await details.validateFinancialsTabNotDisplayedForJURIS();
    });

    test('Req 3.4.003 - Validate Financials tab exclusion with claim type verification', async ({ details }) => {
        // Test Financials tab exclusion for JURIS Accommodation claim type
        await details.validateFinancialsTabExclusionForAccommodations('JURIS Accommodation');
    });

    test('Req 3.4.003 - Data-driven test for Financials tab exclusion across JURIS Accommodation claims', async ({ login, view, details }) => {
        const excelReader = new ExcelReader('C:\\DataVoV\\DataDriverVovQA.xlsx');
        excelReader.selectDataSet('JURISAccommodations', 1);
        
        const testCaseCount = excelReader.count();
        
        for (let i = 0; i < testCaseCount; i++) {
            excelReader.useRow(i);
            const claimNumber = excelReader.getValue('ClaimNumber');
            const accommodationType = excelReader.getValue('AccommodationType');
            
            // Navigate to specific JURIS Accommodation claim
            await login.performLoginDataDriven(1);
            await view.goToClaimSearchTab();
            await view.searchSpecificClaim(claimNumber);
            
            // Validate Financials tab is not displayed
            await details.validateFinancialsTabNotDisplayedForJURIS();
            
            // Validate Financials tab exclusion with claim type
            if (accommodationType.includes('JURIS')) {
                await details.validateFinancialsTabExclusionForAccommodations(accommodationType);
            }
        }
    });
});

test.describe('Accommodations Details - Requirement 3.4.4.001: Custom Fields', () => {
    
    test.beforeEach(async ({ login, view }) => {
        // Navigate to an accommodation claim for testing
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Req 3.4.4.001 - Validate Custom Fields is the last option in dropdown menu', async ({ details }) => {
        // Verify Custom Fields appears as the last option in the Details dropdown menu
        await details.validateCustomFieldsIsLastOption();
    });

    test('Req 3.4.4.001 - Validate Custom Fields page displays Fields section', async ({ details, page }) => {
        // Navigate to Custom Fields
        await details.navigateToCustomFields();
        
        // Verify Fields section is visible
        const fieldsSection = page.locator('[data-testid="fields-section"]');
        await expect(fieldsSection, 'Fields section should be visible in Custom Fields').toBeVisible();
    });

    test('Req 3.4.4.001 - Validate Custom Fields page displays HR Data section', async ({ details, page }) => {
        // Navigate to Custom Fields
        await details.navigateToCustomFields();
        
        // Verify HR Data section is visible
        const hrDataSection = page.locator('[data-testid="hr-data-section"]');
        await expect(hrDataSection, 'HR Data section should be visible in Custom Fields').toBeVisible();
    });

    test('Req 3.4.4.001 - Validate Custom Fields page displays both Fields and HR Data sections', async ({ details }) => {
        // Navigate to Custom Fields and validate all required sections
        await details.navigateToCustomFields();
        await details.validateCustomFieldsSections();
    });

    test('Req 3.4.4.001 - Validate Alternative Claim Numbers are NOT used for accommodation claims', async ({ details }) => {
        // Navigate to Custom Fields
        await details.navigateToCustomFields();
        
        // Verify Alternative Claim Numbers section is not present
        await details.validateAlternativeClaimNumbersNotPresent();
    });

    test('Req 3.4.4.001 - Validate Custom Fields security matches other DS claims', async ({ details }) => {
        // Test that Custom Fields uses the same security as other DS claims
        // Navigate to Custom Fields
        await details.navigateToCustomFields();
        
        // Validate security based on standard user role
        await details.validateCustomFieldsSecurity('StandardUser');
    });

    test('Req 3.4.4.001 - Validate Custom Fields security with different user roles', async ({ login, view, details }) => {
        const excelReader = new ExcelReader('C:\\DataVoV\\DataDriverVovQA.xlsx');
        excelReader.selectDataSet('CustomFieldsData', 1);
        
        const testCaseCount = excelReader.count();
        
        for (let i = 0; i < testCaseCount; i++) {
            excelReader.useRow(i);
            const userRole = excelReader.getValue('UserRole');
            const testClaimNumber = excelReader.getValue('TestClaimNumber');
            const expectedAccess = excelReader.getValue('ExpectedAccess');
            
            // Login with specific user role
            await login.performLoginWithRole(userRole);
            await view.goToClaimSearchTab();
            await view.searchSpecificClaim(testClaimNumber);
            
            // Navigate to Custom Fields
            await details.navigateToCustomFields();
            
            // Validate security matches expected access level
            await details.validateCustomFieldsSecurity(userRole);
            
            // Validate sections are present based on access level
            if (expectedAccess === 'Full' || expectedAccess === 'ReadOnly') {
                await details.validateCustomFieldsSections();
            }
        }
    });
});

test.describe('Accommodations Details - Integration and End-to-End Testing', () => {
    
    test('E2E - Complete Details workflow for accommodation claim', async ({ login, view, details }) => {
        // End-to-end test of complete Details functionality
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        
        // Validate all required menu items
        await details.validateRequiredDetailsMenuItems();
        
        // Validate excluded items are not present
        await details.validateExcludedMenuItemsForAccommodationClaims();
        
        // Navigate through each menu item
        await details.navigateToDetailsSubMenu('Accommodations');
        await details.navigateToDetailsSubMenu('Time Tracking');
        await details.navigateToDetailsSubMenu('Contacts');
        await details.navigateToDetailsSubMenu('Custom Fields');
        
        // Validate Custom Fields sections
        await details.validateCustomFieldsSections();
        await details.validateAlternativeClaimNumbersNotPresent();
    });

    test('E2E - Data-driven test across multiple accommodation claim types', async ({ login, view, details }) => {
        const excelReader = new ExcelReader('C:\\DataVoV\\DataDriverVovQA.xlsx');
        excelReader.selectDataSet('AccommodationClaims', 1);
        
        const testCaseCount = excelReader.count();
        
        for (let i = 0; i < testCaseCount; i++) {
            excelReader.useRow(i);
            const accommodationType = excelReader.getValue('AccommodationType');
            const claimNumber = excelReader.getValue('ClaimNumber');
            const expectedMenuItems = excelReader.getValue('ExpectedMenuItems');
            const financialsTabVisible = excelReader.getValue('FinancialsTabVisible');
            
            // Navigate to specific accommodation claim
            await login.performLoginDataDriven(1);
            await view.goToClaimSearchTab();
            await view.searchSpecificClaim(claimNumber);
            
            // Validate required menu items (Req 3.4.001)
            await details.validateRequiredDetailsMenuItems();
            
            // Validate excluded menu items (Req 3.4.002)
            await details.validateExcludedMenuItemsForAccommodationClaims();
            
            // Validate Financials tab exclusion for JURIS (Req 3.4.003)
            if (accommodationType.includes('JURIS')) {
                await details.validateFinancialsTabNotDisplayedForJURIS();
            }
            
            // Validate Custom Fields functionality (Req 3.4.4.001)
            await details.navigateToCustomFields();
            await details.validateCustomFieldsSections();
            await details.validateAlternativeClaimNumbersNotPresent();
        }
    });
});

test.describe('Accommodations Details - Negative and Edge Case Testing', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Negative - Verify excluded items are not accessible via direct navigation', async ({ details, page }) => {
        // Attempt to access excluded menu items directly (should fail gracefully)
        await details.openDetailsDropdownMenu();
        
        const excludedItems = [
            'Benefit Plan',
            'Medical',
            'Legal',
            'Appeals',
            'Tender',
            'Plan Summary'
        ];
        
        for (const item of excludedItems) {
            const menuItem = page.getByRole('menuitem', { name: item });
            await expect(menuItem, `${item} should not be accessible`).not.toBeVisible();
        }
    });

    test('Edge Case - Validate Details functionality with rapid menu interactions', async ({ details }) => {
        // Test rapid navigation through menu items
        for (let i = 0; i < 3; i++) {
            await details.openDetailsDropdownMenu();
            await details.navigateToDetailsSubMenu('Accommodations');
            await details.navigateToDetailsSubMenu('Custom Fields');
            await details.validateCustomFieldsSections();
        }
    });

    test('Edge Case - Validate menu state persistence after navigation', async ({ details }) => {
        // Open dropdown menu
        await details.openDetailsDropdownMenu();
        
        // Navigate to Accommodations
        await details.navigateToDetailsSubMenu('Accommodations');
        
        // Return to Details tab and verify menu still works
        await details.navigateToDetailsTab();
        await details.validateRequiredDetailsMenuItems();
    });
});

test.describe('Accommodations Details - Performance Testing', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Performance - Validate Details tab loading performance', async ({ details }) => {
        // Measure Details tab load time
        const loadTime = await details.measureDetailsTabLoadTime();
        console.log(`Details tab load time: ${loadTime}ms`);
        expect(loadTime, 'Details tab should load within 3 seconds').toBeLessThan(3000);
    });

    test('Performance - Validate Details dropdown menu response time', async ({ details }) => {
        // Measure dropdown menu response time
        const responseTime = await details.measureDropdownMenuResponseTime();
        console.log(`Details dropdown response time: ${responseTime}ms`);
        expect(responseTime, 'Details dropdown should respond within 1 second').toBeLessThan(1000);
    });
});


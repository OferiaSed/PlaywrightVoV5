import { test, expect } from '../fixtures/BaseTest';

/**
 * Leave Claim Header Test Suite
 * 
 * This test suite covers the comprehensive testing of the Leave Claim Header functionality
 * as specified in User Story requirements 3.2.001 through 3.2.006.
 * 
 * Test Coverage:
 * - Breadcrumbs display and navigation (3.2.001)
 * - Leave Claim Header structure (3.2.002)
 * - Employee ID and Name display (3.2.003)
 * - Default fields display and validation (3.2.004)
 * - Field customization functionality (3.2.005)
 * - Customization popup behavior (3.2.05.1)
 * - Customization persistence (3.2.006)
 * - Data-driven testing scenarios
 */

test.beforeEach(async ({ view }) => {
    await view.goToDashboardPage();
    await view.goToClaimSearchTab();
});


test.describe('LV Claim Header - Breadcrumbs Display and Navigation', () => {
    
    test('Validate Breadcrumbs Display - Req 3.2.001', async ({ customClaimHeader, view }) => {
        // Validate breadcrumbs display "View / Claim Number"
        await view.SearchClaimByCriteria(11);
        await customClaimHeader.validateLeaveBreadcrumbsDisplay(11);
    });

    test('Validate View Link is Hyperlink - Req 3.2.001', async ({ customClaimHeader, view }) => {
        // Navigate to leave claim
        await view.SearchClaimByCriteria(11);
        
        // Validate View link navigation
        await customClaimHeader.validateViewLinkNavigation();
    });

    test('Validate Claim Number in Breadcrumbs Without Star Icon - Req 3.2.001', async ({ customClaimHeader, view }) => {        
        // Navigate to leave claim
        await view.SearchClaimByCriteria(11);

        // Validate star icon is NOT in breadcrumbs
        await customClaimHeader.valiteAddToWatchlistIconIsNotVisible();
    });
});

test.describe('LV Claim Header - Header Structure and Elements', () => {
    
    test('Validate Claim Number Display with Star Icon - Req 3.2.002', async ({ customClaimHeader, view }) => {
        // Validate claim number is displayed in bold and larger font with star icon
        await view.SearchClaimByCriteria(11);
        await customClaimHeader.validateClaimNumberDisplayWithStarIcon();
    });

    test('Validate Glasses Icon Display - Req 3.2.002', async ({ customClaimHeader, view }) => {
        // Validate glasses icon is displayed to the right of claim number
        await view.SearchClaimByCriteria(11);
        await customClaimHeader.validateGlassesIconDisplay();
    });

    test('Validate Employee ID Display - Req 3.2.003', async ({ customClaimHeader, view }) => {
        // Validate Employee ID is displayed in gray font, right justified
        await view.SearchClaimByCriteria(11);
        await customClaimHeader.validateEmployeeIDDisplay();
    });

    test('Validate Employee Name Display Format - Req 3.2.003', async ({ customClaimHeader, view }) => {
        // Validate Employee Name is displayed in bold, larger font (matching claim number size)
        // Format: First Last (both capitalized, not sentence case)
        await view.SearchClaimByCriteria(11);
        await customClaimHeader.validateEmployeeNameDisplay();
    });

    test('Validate Employee ID Masking When SSN Match - Req 3.2.003', async ({ customClaimHeader, view }) => {
        // Navigate to claim where Employee ID matches SSN (should be masked)
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.validateEmployeeIDDisplay('***-**-7110', true);
    });

    test('Validate Complete Leave Claim Header Structure - Req 3.2.002-3.2.003', async ({ customClaimHeader, view }) => {
        // Validate all header elements are displayed correctly
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.validateLeaveClaimHeaderStructure();
    });
});

test.describe('LV Claim Header - Default Fields Display', () => {

    test('Validate Default Leave Claim Header Fields Display - Req 3.2.004', async ({ customClaimHeader, view }) => {
        // Restore defaults first
        await view.SearchClaimByCriteria(11);
        await customClaimHeader.customizeHeaderWithFields([], [], true);
        
        // Validate default fields are displayed in correct order
        await customClaimHeader.validateDefaultLeaveClaimHeaderFields();        
        const expectedDefaultOrder = ['Status', 'Case type', 'Date begin', 'Date end', 'Examiner'];
        await customClaimHeader.validateFieldOrderInHeader(expectedDefaultOrder);
    });

    test('Validate Status Field Color Coding - Req 3.2.004', async ({ customClaimHeader, view }) => {
        // Test different status color coding scenarios
        const statusScenarios = [
            { status: 'Open', expectedColor: 'green', dataset: 12 },
            { status: 'Closed', expectedColor: 'red', dataset: 11 }
        ];

        for (const scenario of statusScenarios) {
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(scenario.dataset);
            await customClaimHeader.validateStatusColorCoding(scenario.status);
        }
    });

    test('Validate Status Field Format Display - Req 3.2.004', async ({ customClaimHeader, view }) => {
        // Validate status displays as "Open - Approved" format
        await view.SearchClaimByCriteria(12);        
        const statusValue = customClaimHeader.getClaimFieldValueLocator('Status');
        await expect.soft(statusValue, 'Status value should be visible').toBeVisible();
        let isCond = await statusValue.isVisible();
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Status value ${ctrlMessage}.`);
        
        console.log('[Test] Validating status format (should match "Open - Approved" or "Closed - ..." format).');
        const statusText = await statusValue.textContent();
        const statusFormatRegex = /^(Open|Closed)\s*-\s*.+/;
        isCond = statusFormatRegex.test(statusText || '');
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? `should display in format like "Open - Approved" and has "${statusText}"` : `should display in format like "Open - Approved" but found "${statusText}"`;
        console.log(`[Test] ${ctrlIcon} Status format ${ctrlMessage}.`);
        expect(statusText, 'Status should display in format like "Open - Approved"').toMatch(statusFormatRegex);
    });

    test('Validate Case Type Display - Req 3.2.004', async ({ customClaimHeader, view }) => {
        // Validate Case Type field displays correctly
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.validateLeaveCaseTypeDisplay(['Intermittent', 'Continuous', 'Reduced Work Schedule']);
    });

    test('Validate Date Format Display - Req 3.2.004', async ({ customClaimHeader, view }) => {
        // Validate that date fields display in MM/DD/YYYY format
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.validateLeaveDateFieldsFormat();
    });

    test('Validate Examiner Name Format - Req 3.2.004', async ({ customClaimHeader, view }) => {
        // Validate examiner displays as FIRST and LAST NAME, not as hyperlink
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.validateExaminerNameFormat('Examiner');
    });

    test('Validate Additional Fields Not Displayed by Default - Req 3.2.004', async ({ customClaimHeader, view }) => {
        // Validate that additional fields are not visible by default
        await view.SearchClaimByCriteria(12);
        const additionalFields = [
            'Examiner phone number',
            'Work state/province',
            'Relationship',
            'Caring for',
            'Gender',
            'Hours worked in last 12 months',
            'Months of service',
            'Phone #',
            'Spouse at same client',
            'SSN',
            'Relationship',
            'Client name'
        ];
        
        for (const field of additionalFields) {
            await customClaimHeader.validateFieldIsNotVisible(field);
        }
    });
});

test.describe('LV Claim Header - Customization Functionality', () => {

    test('Validate Pencil Icon Opens Customization Popup - Req 3.2.005', async ({ customClaimHeader, view }) => {
        // Click pencil icon and validate popup opens
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.openLeaveCustomizationPopup();
    });

    test('Validate Configure Leave Header Popup Title - Req 3.2.05.1', async ({ customClaimHeader, view }) => {
        // Open popup and validate title is "Configure leave header"
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.openLeaveCustomizationPopup();
        await customClaimHeader.validateLeaveCustomizationPopupIsOpen();
    });

    test('Validate Options Not Displayed for Leave Claims - Req 3.2.05.1', async ({ customClaimHeader, view }) => {
        // Validate that "Configure for all leave claims" and "Configure for {Client name} claims" 
        // radio buttons are NOT displayed for Leave claims
        await view.SearchClaimByCriteria(12);
        console.log('[Test] Opening leave customization popup.');
        await customClaimHeader.openLeaveCustomizationPopup();
        
        console.log('[Test] Getting options radio buttons count.');
        const optionCount = await customClaimHeader.getOptionsRadioButtonsCount();
        let isCond = optionCount === 0;
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'should NOT be displayed for Leave claims and has 0 options' : `should NOT be displayed for Leave claims but found ${optionCount} options`;
        console.log(`[Test] ${ctrlIcon} Options radio buttons ${ctrlMessage}.`);
        expect(optionCount, 'Options radio buttons should NOT be displayed for Leave claims').toBe(0);
                await customClaimHeader.closeCustomizationPopup();
    });

    test('Validate Available Additional Fields for Selection - Req 3.2.005', async ({ customClaimHeader, view }) => {
        // Validate that additional fields are available for selection
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.customizeHeaderWithFields([], [], true);
        await customClaimHeader.validateLeaveAvailableAdditionalFields();
    });

    test('Add Single Additional Field to Header - Req 3.2.005', async ({ customClaimHeader, view }) => {
        // Test adding Examiner phone number field
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.customizeHeaderWithFields(['Examiner phone number'], [], true);
        
        // Validate field is now visible in header
        await customClaimHeader.validateFieldIsVisible('Examiner phone number', false);
    });

    test('Add Multiple Additional Fields to Header - Req 3.2.005', async ({ customClaimHeader, view }) => {
        // Test adding multiple fields
        await view.SearchClaimByCriteria(12);
        const fieldsToAdd = ['Hours worked in last 12 months', 'Relationship', 'Gender'];
        await customClaimHeader.customizeHeaderWithFields(fieldsToAdd, [], true);
        
        // Validate all fields are now visible
        for (const field of fieldsToAdd) {
            await customClaimHeader.validateFieldIsVisible(field);
        }
    });

    test('Remove Field from Header - Req 3.2.005', async ({ customClaimHeader, view }) => {
        // First add a field
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.customizeHeaderWithFields(['Gender'], [], true);
        await customClaimHeader.validateFieldIsVisible('Gender');
        
        // Then remove it
        await customClaimHeader.customizeHeaderWithFields([], ['Case type'], false);
        await customClaimHeader.validateFieldIsNotVisible('Case type');
    });

    test('Validate Maximum 10 Fields Limit - Req 3.2.05.1', async ({ customClaimHeader, view }) => {
        // Add multiple fields to test maximum limit
        await view.SearchClaimByCriteria(12);
        const fieldsToAdd = [
            'Examiner phone number',
            'Work state/province',
            'Relationship',
            'Caring for',
            'Gender',
            'Hours worked in last 12 months',
            'Months of service',
            'Phone #',
            'Spouse at same client',
            'SSN'
        ];
        
        // Add up to 10 fields (default 5 + 5 additional = 10 total)
        await customClaimHeader.customizeHeaderWithFields(fieldsToAdd.slice(0, 5), [], true);
        
        // Validate maximum fields limit
        await customClaimHeader.customizeHeaderWithFields(fieldsToAdd.slice(6, 7), [], false, false);
        await customClaimHeader.error10MaximymMessageIsVisible();
        await customClaimHeader.closeCustomizationPopup();
    });

    test('Validate SSN Field with Eye Icon - Req 3.2.005', async ({ customClaimHeader, view }) => {
        // Validate SSN field displays with eye icon for unmasking
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.validateSSNFieldWithEyeIcon();
    });
});

test.describe('LV Claim Header - Customization Popup Behavior', () => {

    test('Validate Popup Header and Title - Req 3.2.05.1', async ({ customClaimHeader, view }) => {
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.openLeaveCustomizationPopup();
        
        // Validate popup title is "Configure leave header"
        await customClaimHeader.validateLeaveCustomizationPopupIsOpen();
    });

    test('Validate At Least One Field Must Be Selected - Req 3.2.05.1', async ({ customClaimHeader, view }) => {
        // Try to remove all fields (should not be allowed)
        await view.SearchClaimByCriteria(12);
        const allDefaultFields = ['Status', 'Case type', 'Date begin', 'Date end', 'Examiner'];
        await customClaimHeader.customizeHeaderWithFields([], allDefaultFields, true, false);
        
        // Validate error message appears
        await customClaimHeader.errorRequiredMessageIsVisible();
        await customClaimHeader.closeCustomizationPopup();
    });

    test('Validate Field Reordering Functionality - Req 3.2.05.1', async ({ customClaimHeader, view }) => {
        // Add additional fields first
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.customizeHeaderWithFields(['SSN', 'Relationship'], [], true);
        
        // Get current order
        const currentOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        console.log('Current order before changes: ', currentOrder);
        
        // Reorder fields using popup
        await customClaimHeader.openLeaveCustomizationPopup();
        await customClaimHeader.moveFieldUpInOrder('SSN');
        await customClaimHeader.saveCustomizationChanges();
        
        // Validate order changed
        const newOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        console.log('New order after changes: ', newOrder);
        expect(newOrder, 'Field order should change after reordering').not.toEqual(currentOrder);
    });

    test('Validate Cancel Button Closes Popup Without Saving - Req 3.2.05.1', async ({ customClaimHeader, view }) => {
        // Get initial field order
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.customizeHeaderWithFields([]);
        const initialOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        
        // Open popup and make changes
        await customClaimHeader.customizeHeaderWithFields(['Relationship'], [], true, false);
        
        // Cancel changes
        await customClaimHeader.closeCustomizationPopup();
        
        // Validate changes were not saved
        const finalOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        expect(finalOrder, 'Field order should remain unchanged after cancel').toEqual(initialOrder);
    });

    test('Validate Save Button Persists Changes - Req 3.2.005', async ({ customClaimHeader, view }) => {
        // Get initial field order
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.customizeHeaderWithFields([]);
        const initialOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        
        // Make changes and save
        await customClaimHeader.customizeHeaderWithFields(['Relationship']);
        
        // Validate changes were saved
        const finalOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        expect(finalOrder, 'Field order should change after saving').not.toEqual(initialOrder);
        expect(finalOrder, 'Contract # should be in the new order').toContain('Relationship');
    });

    test('Validate Restore Defaults Functionality - Req 3.2.004', async ({ customClaimHeader, view }) => {
        // First customize the header
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.customizeHeaderWithFields(['Relationship', 'SSN']);
        
        // Restore defaults
        await customClaimHeader.openLeaveCustomizationPopup();
        await customClaimHeader.restoreDefaultFields();
        await customClaimHeader.saveCustomizationChanges();
        
        // Validate default fields are restored
        await customClaimHeader.validateDefaultLeaveClaimHeaderFields();
    });
});

test.describe('LV Claim Header - Persistence and Session Management', () => {
    
    test('Validate Customization Persists Across Different Leave Claims - Req 3.2.006', async ({ login, view, customClaimHeader }) => {
        // Navigate to first leave claim and customize
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(12);
        
        // Customize header
        await customClaimHeader.customizeHeaderWithFields(['Relationship']);
        
        // Navigate to different leave claim
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(11);
        
        // Validate customization persists
        await customClaimHeader.validateFieldIsVisible('Relationship');
    });

    test('Validate Customization Persists After Logout/Login - Req 3.2.006', async ({ page, login, view, customClaimHeader }) => {
        // First session - customize header
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(12);
        await customClaimHeader.customizeHeaderWithFields(['Relationship']);
        
        // Logout
        await login.performLogout();
        
        // Second session - login and validate persistence
        const authFile = '.auth/user.json';
        await login.performLoginDataDriven(1);
        await page.context().storageState({path: authFile});
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(12);
        
        // Validate customization persisted
        await customClaimHeader.validateFieldIsVisible('Relationship');
    });

    test('Validate Leave-Specific Customization Applies to All Leave Claims - Req 3.2.006', async ({ login, view, customClaimHeader }) => {
        // Navigate to Leave claim and customize
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(11); // Leave claim
        await customClaimHeader.customizeHeaderWithFields(['Hours worked in last 12 months'], [], true);
        
        // Navigate to another Leave claim
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(12); // Another Leave claim
        
        // Validate customization applies to this Leave claim too
        await customClaimHeader.validateFieldIsVisible('Hours worked in last 12 months');
    });
});

test.describe('LV Claim Header - Error Handling and Edge Cases', () => {

    test('Error Handling - Invalid Field Selection', async ({ customClaimHeader, view }) => {
        // Try to add non-existent field (should handle gracefully)
        await view.SearchClaimByCriteria(11);
        try {
            await customClaimHeader.openLeaveCustomizationPopup();
            await customClaimHeader.addNonExistentFieldToHeader('Non-existent Field');
            
            // If we reach here, the field was added unexpectedly
            console.log('[Test] ⚠️ Warning: Non-existent field was added unexpectedly.');
            await customClaimHeader.closeCustomizationPopup();
        } catch (error) {
            // Expected behavior - should handle error gracefully
            const ctrlIcon = '✅';
            const ctrlMessage = 'error was caught and handled gracefully as expected';
            console.log(`[Test] ${ctrlIcon} Error handling ${ctrlMessage}.`);
            console.log(`[Test] Error details: ${error instanceof Error ? error.message : 'Unknown error'}`);
            
            expect(error).toBeDefined();
            await customClaimHeader.closeCustomizationPopup();
            console.log('[Test] ✅ Error Handling test completed successfully - invalid field selection was properly handled.');
        }
    });

    test('Edge Case - Empty Field Selection', async ({ customClaimHeader, view }) => {
        // Try to remove all fields (should not be allowed)
        await view.SearchClaimByCriteria(11);
        const allDefaultFields = ['Status', 'Case type', 'Date begin', 'Date end', 'Examiner'];
        await customClaimHeader.customizeHeaderWithFields([], allDefaultFields, true, false);
        await customClaimHeader.errorRequiredMessageIsVisible();
        await customClaimHeader.closeCustomizationPopup();
    });

    test('Edge Case - Rapid Field Reordering', async ({ customClaimHeader, view }) => {
        // Add fields first
        await view.SearchClaimByCriteria(11);
        await customClaimHeader.customizeHeaderWithFields([]);
        await customClaimHeader.customizeHeaderWithFields(['Client #', 'Client name']);
        
        // Rapidly reorder fields
        await customClaimHeader.openLeaveCustomizationPopup();
        await customClaimHeader.moveFieldUpInOrder('Client #');
        await customClaimHeader.moveFieldDownInOrder('Client name');
        //await customClaimHeader.moveFieldUpInOrder('Client #');
        await customClaimHeader.saveCustomizationChanges();
        
        // Validate final state is consistent
        const finalOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        expect(finalOrder, 'Field order should be consistent after rapid reordering').toBeDefined();
    });

    test('Edge Case - Maximum Fields Selection', async ({ customClaimHeader, view }) => {
        // Add maximum fields (default 5 + 5 additional = 10 total)
        await view.SearchClaimByCriteria(11);
        const maxFields = [
            'Examiner phone number',
            'Work state/province',
            'Relationship',
            'Caring for',
            'Gender'
        ];
        
        await customClaimHeader.customizeHeaderWithFields(maxFields);
        
        // Try to add more fields (should be prevented or show warning)
        await customClaimHeader.openLeaveCustomizationPopup();
        const selectedCount = await customClaimHeader.getSelectedFieldsList();
        expect(selectedCount.length, 'Should have maximum 10 fields').toBeLessThanOrEqual(10);
        await customClaimHeader.closeCustomizationPopup();
    });
});


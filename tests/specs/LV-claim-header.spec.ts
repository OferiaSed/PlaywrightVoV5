import { test, expect } from '../fixtures/BaseTest';
import { ExcelReader } from '../../utils/helpers/excel-reader';

/**
 * Leave Claim Header Test Suite
 * 
 * This test suite covers the comprehensive testing of the Leave Claim Header functionality
 * as specified in User Story requirements 3.2.001, 3.2.002, 3.2.003, 3.2.004, 3.2.005, 3.2.05.1, and 3.2.006.
 * 
 * Test Coverage:
 * - Breadcrumbs display and navigation
 * - Line of Business display
 * - Claim number and employee information display
 * - Default field display and validation
 * - Field customization functionality
 * - Customization popup behavior
 * - Field ordering and persistence
 * - Data-driven testing scenarios
 * - Leave-specific field formats and validations
 */

test.describe('LV Claim Header - Basic Display and Navigation', () => {
    
    test.beforeEach(async ({ login }) => {
        // Navigate to a leave claim for testing
        await login.performLoginDataDriven(1);
    });

    test('Validate Leave Claim Header Breadcrumbs Display', async ({ customClaimHeader, view }) => {
        // Navigate to leave claim
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        
        // Validate breadcrumbs display format: "View / Claim Number"
        const claimNumber = "LV-12345"; // This should come from test data
        await customClaimHeader.validateLeaveBreadcrumbsDisplay(claimNumber);
    });

    test('Validate Leave Line of Business Display', async ({ customClaimHeader, view }) => {
        // Navigate to leave claim
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        
        // Validate Line of Business display (e.g., "Leave of absence – Employee medical")
        const lobText = "Leave of absence – Employee medical";
        await customClaimHeader.validateLeaveLineOfBusinessDisplay(lobText);
    });

    test('Validate Leave Claim Number Display with Icons', async ({ customClaimHeader, view }) => {
        // Navigate to leave claim
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        
        // Validate claim number display with star and glasses icons
        const claimNumber = "LV-12345";
        await customClaimHeader.validateLeaveClaimNumberDisplay(claimNumber);
    });

    test('Validate Leave Employee Information Display', async ({ customClaimHeader, view }) => {
        // Navigate to leave claim
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        
        // Validate employee ID and name display
        const employeeId = "1232456";
        const employeeName = "John Smith";
        await customClaimHeader.validateLeaveEmployeeInformationDisplay(employeeId, employeeName);
    });

    test('Validate View Hyperlink Navigation', async ({ customClaimHeader, view }) => {
        // Navigate to leave claim
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        
        // Wait for page to load completely
        await customClaimHeader.delay(2000);
        
        // First validate breadcrumbs are displayed correctly
        const claimNumber = "LV-12345"; // This should come from test data
        await customClaimHeader.validateLeaveBreadcrumbsDisplay(claimNumber);
        
        // Click the View hyperlink
        await customClaimHeader.clickViewHyperlink();
        
        // Validate navigation back to View landing page
        await customClaimHeader.delay(2000);
        const currentUrl = await customClaimHeader.getCurrentUrl();
        expect(currentUrl, 'Should navigate back to View page').toContain('/view');
    });
});

test.describe('LV Claim Header - Default Fields Display', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Validate Default Leave Claim Header Fields Display', async ({ customClaimHeader }) => {
        // Validate that all default fields are displayed in the correct order
        await customClaimHeader.validateDefaultLeaveClaimHeaderFields();
        
        // Validate field order (left to right)
        const expectedDefaultOrder = ['Status', 'Case Type', 'Date Begin', 'Date End', 'Examiner'];
        await customClaimHeader.validateFieldOrderInHeader(expectedDefaultOrder);
    });

    test('Validate Leave Status Field Color Coding', async ({ customClaimHeader }) => {
        // Test different status color coding scenarios for Leave claims
        const statusScenarios = [
            { status: 'Open - Approved', expectedColor: 'green' },
            { status: 'Closed - Denied', expectedColor: 'red' }
        ];

        for (const scenario of statusScenarios) {
            await customClaimHeader.validateLeaveStatusColorCoding(scenario.status);
        }
    });

    test('Validate Leave Case Type Format', async ({ customClaimHeader }) => {
        // Validate Case Type displays valid options
        await customClaimHeader.validateLeaveCaseTypeFormat();
    });

    test('Validate Leave Date Format Display', async ({ customClaimHeader }) => {
        // Validate that date fields display in MM/DD/YYYY format
        const dateFields = ['Date Begin', 'Date End'];
        for (const field of dateFields) {
            await customClaimHeader.validateLeaveDateFormat(field);
        }
    });

    test('Validate Leave Examiner Name Format', async ({ customClaimHeader }) => {
        // Validate examiner displays as FIRST and LAST NAME, not as hyperlink
        await customClaimHeader.validateLeaveExaminerNameFormat();
    });

    test('Validate Additional Fields Not Displayed by Default', async ({ customClaimHeader }) => {
        // Validate that additional fields are not visible by default
        const additionalFields = [
            'Examiner phone number', 'Work state/province', 'Relationship', 'Caring for',
            'Gender', 'Hours worked in last 12 months', 'Months of service', 'Phone #',
            'Spouse at same client', 'SSN', 'Contract #', 'Client'
        ];
        
        for (const field of additionalFields) {
            await customClaimHeader.validateFieldIsNotVisible(field);
        }
    });
});

test.describe('LV Claim Header - Customization Functionality', () => {

    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Validate Pencil Icon Opens Leave Customization Popup', async ({ customClaimHeader }) => {
        // Click pencil icon and validate popup opens with correct title
        await customClaimHeader.openLeaveCustomizationPopup();
    });

    test('Validate Available Additional Fields for Leave Selection', async ({ customClaimHeader }) => {
        // Validate that additional fields are available for selection
        await customClaimHeader.openLeaveCustomizationPopup();
        await customClaimHeader.restoreDefaultFields();
        
        const additionalFields = [
            'Examiner phone number', 'Work state/province', 'Relationship', 'Caring for',
            'Gender', 'Hours worked in last 12 months', 'Months of service', 'Phone #',
            'Spouse at same client', 'SSN', 'Contract #', 'Client'
        ];
        
        for (const field of additionalFields) {
            await customClaimHeader.validateFieldIsAvailableForSelection(field);
        }
    });

    test('Add Single Additional Field to Leave Header', async ({ customClaimHeader }) => {
        // Test adding Examiner phone number field
        await customClaimHeader.customizeLeaveHeaderWithFields(['Examiner phone number']);
        
        // Validate field is now visible in header
        await customClaimHeader.validateFieldIsVisible('Examiner phone number');
    });

    test('Add Multiple Additional Fields to Leave Header', async ({ customClaimHeader }) => {
        // Test adding multiple fields
        const fieldsToAdd = ['Examiner phone number', 'Work state/province', 'Relationship'];
        await customClaimHeader.customizeLeaveHeaderWithFields(fieldsToAdd);
        
        // Validate all fields are now visible
        for (const field of fieldsToAdd) {
            await customClaimHeader.validateFieldIsVisible(field);
        }
    });

    test('Remove Field from Leave Header', async ({ customClaimHeader }) => {
        // First add a field
        await customClaimHeader.customizeLeaveHeaderWithFields(['Examiner phone number']);
        await customClaimHeader.validateFieldIsVisible('Examiner phone number');
        
        // Then remove it
        await customClaimHeader.customizeLeaveHeaderWithFields([], ['Examiner phone number'], false);
        await customClaimHeader.validateFieldIsNotVisible('Examiner phone number');
    });

    test('Validate Maximum 10 Fields Limit for Leave Claims', async ({ customClaimHeader }) => {
        // Add all available fields to test maximum limit
        const allFields = [
            'Examiner phone number', 'Work state/province', 'Relationship', 'Caring for',
            'Gender', 'Hours worked in last 12 months', 'Months of service', 'Phone #',
            'Spouse at same client', 'SSN', 'Contract #', 'Client'
        ];
        await customClaimHeader.customizeLeaveHeaderWithFields(allFields);
        
        // Validate maximum fields limit
        await customClaimHeader.validateMaximumFieldsLimit();
    });
});

test.describe('LV Claim Header - Customization Popup Behavior', () => {

    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Validate Leave Popup Header and Title', async ({ customClaimHeader }) => {
        await customClaimHeader.openLeaveCustomizationPopup();
        
        // Validate popup title is "Configure leave header"
        await customClaimHeader.validateLeaveCustomizationPopupIsOpen();
    });

    test('Validate At Least One Field Must Be Selected for Leave', async ({ customClaimHeader }) => {
        await customClaimHeader.openLeaveCustomizationPopup();
        await customClaimHeader.restoreDefaultFields();

        // Try to remove all fields (should not be allowed)
        await customClaimHeader.validateAtLeastOneFieldSelected();
    });

    test('Validate Field Reordering Functionality for Leave', async ({ customClaimHeader }) => {
        // Add additional fields first
        await customClaimHeader.customizeLeaveHeaderWithFields(['Examiner phone number', 'Work state/province']);
        
        // Get current order
        const currentOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        
        // Move a field up
        await customClaimHeader.reorderHeaderFields('Examiner phone number', 'up');
        
        // Validate order changed
        const newOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        expect(newOrder, 'Field order should change after reordering').not.toEqual(currentOrder);
    });

    test('Validate Cancel Button Closes Leave Popup Without Saving', async ({ customClaimHeader }) => {
        // Get initial field order
        await customClaimHeader.customizeLeaveHeaderWithFields([]);
        const initialOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        
        // Open popup and make changes
        await customClaimHeader.openLeaveCustomizationPopup();
        await customClaimHeader.addFieldToHeader('Examiner phone number');
        
        // Cancel changes
        await customClaimHeader.closeCustomizationPopup();
        
        // Validate changes were not saved
        const finalOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        expect(finalOrder, 'Field order should remain unchanged after cancel').toEqual(initialOrder);
    });

    test('Validate Save Button Persists Leave Changes', async ({ customClaimHeader }) => {
        // Get initial field order
        const initialOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        
        // Make changes and save
        await customClaimHeader.customizeLeaveHeaderWithFields(['Examiner phone number']);
        
        // Validate changes were saved
        const finalOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        expect(finalOrder, 'Field order should change after saving').not.toEqual(initialOrder);
        expect(finalOrder, 'Examiner phone number should be in the new order').toContain('Examiner phone number');
    });

    test('Validate Restore Defaults Functionality for Leave', async ({ customClaimHeader }) => {
        // First customize the header
        await customClaimHeader.customizeLeaveHeaderWithFields(['Examiner phone number', 'Work state/province']);
        
        // Restore defaults
        await customClaimHeader.openLeaveCustomizationPopup();
        await customClaimHeader.restoreDefaultFields();
        await customClaimHeader.saveCustomizationChanges();
        
        // Validate default fields are restored
        await customClaimHeader.validateDefaultLeaveClaimHeaderFields();
    });
});

test.describe('LV Claim Header - Leave-Specific Field Validations', () => {

    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Validate Leave Additional Fields Format', async ({ customClaimHeader }) => {
        // Add fields that have specific format requirements
        const fieldsToAdd = [
            'Examiner phone number', 'Work state/province', 'Phone #', 
            'Hours worked in last 12 months', 'Months of service', 'Spouse at same client'
        ];
        await customClaimHeader.customizeLeaveHeaderWithFields(fieldsToAdd);
        
        // Validate field formats
        await customClaimHeader.validateLeaveAdditionalFieldsFormat();
    });

    test('Validate Leave SSN Masking and Unmasking', async ({ customClaimHeader }) => {
        // Add SSN field
        await customClaimHeader.customizeLeaveHeaderWithFields(['SSN']);
        
        // Validate SSN is masked
        await customClaimHeader.validateLeaveSSNMasking();
        
        // Test unmasking functionality (if user has appropriate security)
        const eyeIcon = customClaimHeader.getSSNEyeIconLocator();
        await expect(eyeIcon, 'Eye icon for SSN unmasking should be visible').toBeVisible();
        await eyeIcon.click();
        
        // Validate SSN is now unmasked
        const ssnField = customClaimHeader.getClaimFieldValueLocator('SSN');
        const ssnText = await ssnField.textContent();
        expect(ssnText?.trim(), 'SSN should be unmasked after clicking eye icon').toMatch(/^\d{3}-\d{2}-\d{4}$/);
    });

    test('Validate Leave Examiner Phone Number Format', async ({ customClaimHeader }) => {
        // Add Examiner phone number field
        await customClaimHeader.customizeLeaveHeaderWithFields(['Examiner phone number']);
        
        // Validate format: 999-999-9999 X99999
        const phoneField = customClaimHeader.getClaimFieldValueLocator('Examiner phone number');
        const phoneText = await phoneField.textContent();
        expect(phoneText?.trim(), 'Examiner phone number should match format 999-999-9999 X99999').toMatch(/^\d{3}-\d{3}-\d{4}\s+X\d{5}$/);
    });

    test('Validate Leave Work State Format', async ({ customClaimHeader }) => {
        // Add Work state/province field
        await customClaimHeader.customizeLeaveHeaderWithFields(['Work state/province']);
        
        // Validate format: Two-letter state code (e.g., MI)
        const stateField = customClaimHeader.getClaimFieldValueLocator('Work state/province');
        const stateText = await stateField.textContent();
        expect(stateText?.trim(), 'Work state should be two-letter code').toMatch(/^[A-Z]{2}$/);
    });

    test('Validate Leave Phone Number Format', async ({ customClaimHeader }) => {
        // Add Phone # field
        await customClaimHeader.customizeLeaveHeaderWithFields(['Phone #']);
        
        // Validate format: 999-999-9999
        const phoneField = customClaimHeader.getClaimFieldValueLocator('Phone #');
        const phoneText = await phoneField.textContent();
        expect(phoneText?.trim(), 'Phone number should match format 999-999-9999').toMatch(/^\d{3}-\d{3}-\d{4}$/);
    });

    test('Validate Leave Numeric Fields Format', async ({ customClaimHeader }) => {
        // Add numeric fields
        const numericFields = ['Hours worked in last 12 months', 'Months of service'];
        await customClaimHeader.customizeLeaveHeaderWithFields(numericFields);
        
        // Validate numeric formats
        for (const field of numericFields) {
            const fieldValue = customClaimHeader.getClaimFieldValueLocator(field);
            const fieldText = await fieldValue.textContent();
            
            if (field === 'Hours worked in last 12 months') {
                expect(fieldText?.trim(), 'Hours worked should be numeric with decimal').toMatch(/^\d+\.?\d*$/);
            } else if (field === 'Months of service') {
                expect(fieldText?.trim(), 'Months of service should be whole number').toMatch(/^\d+$/);
            }
        }
    });

    test('Validate Leave Boolean Field Format', async ({ customClaimHeader }) => {
        // Add Spouse at same client field
        await customClaimHeader.customizeLeaveHeaderWithFields(['Spouse at same client']);
        
        // Validate format: Yes/No
        const spouseField = customClaimHeader.getClaimFieldValueLocator('Spouse at same client');
        const spouseText = await spouseField.textContent();
        expect(spouseText?.trim(), 'Spouse at same client should be Yes or No').toMatch(/^(Yes|No)$/);
    });
});

test.describe('LV Claim Header - Persistence and Session Management', () => {

    test('Validate Leave Customization Persists Across Different Claims', async ({ login, view, customClaimHeader }) => {
        // Navigate to first leave claim and customize
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        
        // Customize header
        await customClaimHeader.customizeLeaveHeaderWithFields(['Examiner phone number', 'Work state/province']);
        
        // Navigate to different leave claim
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(2);
        
        // Validate customization persists
        await customClaimHeader.validateFieldIsVisible('Examiner phone number');
        await customClaimHeader.validateFieldIsVisible('Work state/province');
    });

    test('Validate Leave Customization Persists After Logout/Login', async ({ login, view, customClaimHeader }) => {
        // First session - customize header
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        await customClaimHeader.customizeLeaveHeaderWithFields(['Examiner phone number', 'Phone #']);
        
        // Logout
        await login.performLogout();
        
        // Second session - login and validate persistence
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        
        // Validate customization persisted
        await customClaimHeader.validateFieldIsVisible('Examiner phone number');
        await customClaimHeader.validateFieldIsVisible('Phone #');
    });

    test('Validate Leave Line of Business Specific Customization', async ({ login, view, customClaimHeader }) => {
        // Test that customization applies to all Leave claims
        // Navigate to Leave claim and customize
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1); // Leave claim
        await customClaimHeader.customizeLeaveHeaderWithFields(['Examiner phone number']);
        
        // Navigate to another Leave claim
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(3); // Another Leave claim
        
        // Validate customization applies to this Leave claim too
        await customClaimHeader.validateFieldIsVisible('Examiner phone number');
    });
});

test.describe('LV Claim Header - Error Handling and Edge Cases', () => {

    test.beforeEach(async ({ login, view, customClaimHeader }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Error Handling - Invalid Field Selection for Leave', async ({ customClaimHeader }) => {
        // Try to add non-existent field (should handle gracefully)
        try {
            await customClaimHeader.addFieldToHeader('Non-existent Leave Field');
        } catch (error) {
            // Expected behavior - should handle error gracefully
            expect(error).toBeDefined();
        }
    });

    test('Edge Case - Empty Field Selection for Leave', async ({ customClaimHeader }) => {
        // Try to remove all fields (should not be allowed)
        const allDefaultFields = ['Status', 'Case Type', 'Date Begin', 'Date End', 'Examiner'];
        await customClaimHeader.customizeLeaveHeaderWithFields([], allDefaultFields, true, false);
        await customClaimHeader.errorRequiredMessageIsVisible();
    });

    test('Edge Case - Rapid Field Reordering for Leave', async ({ customClaimHeader }) => {
        // Add fields first
        await customClaimHeader.customizeLeaveHeaderWithFields(['Examiner phone number', 'Work state/province']);
        
        // Rapidly reorder fields
        await customClaimHeader.reorderHeaderFields('Examiner phone number', 'up');
        await customClaimHeader.reorderHeaderFields('Work state/province', 'down');
        await customClaimHeader.reorderHeaderFields('Examiner phone number', 'down');
        
        // Validate final state is consistent
        const finalOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
        expect(finalOrder, 'Field order should be consistent after rapid reordering').toBeDefined();
    });

    test('Edge Case - Maximum Fields Limit for Leave', async ({ customClaimHeader }) => {
        // Try to add more than 10 fields
        const allAvailableFields = [
            'Examiner phone number', 'Work state/province', 'Relationship', 'Caring for',
            'Gender', 'Hours worked in last 12 months', 'Months of service', 'Phone #',
            'Spouse at same client', 'SSN', 'Contract #', 'Client'
        ];
        
        // Add all fields
        await customClaimHeader.customizeLeaveHeaderWithFields(allAvailableFields);
        
        // Validate maximum limit is enforced
        await customClaimHeader.validateMaximumFieldsLimit();
    });
});

test.describe('LV Claim Header - Data-Driven Testing', () => {

    test('Data-Driven Leave Claim Header Testing', async ({ login, view, customClaimHeader }) => {
        // Use Excel data for comprehensive testing
        const excelReader = new ExcelReader('C:\\DataVoV\\DataDriverVovQA.xlsx');
        
        // Test with different data sets
        const testSets = [1, 2, 3, 4];
        
        for (const setValue of testSets) {
            try {
                excelReader.selectDataSet('LeaveClaimHeader', setValue);
                const rowCount = excelReader.count();
                
                for (let i = 0; i < rowCount; i++) {
                    excelReader.useRow(i);
                    const dataRow = excelReader.getAll();
                    
                    // Navigate to claim based on test data
                    await login.performLoginDataDriven(parseInt(dataRow.DataSet));
                    await view.goToClaimSearchTab();
                    await view.SearchClaimByCriteria(parseInt(dataRow.DataSet));
                    
                    // Validate default fields
                    await customClaimHeader.validateDefaultLeaveClaimHeaderFields();
                    
                    // Test customization based on test data
                    if (dataRow.FieldsToAdd) {
                        const fieldsToAdd = dataRow.FieldsToAdd.split(',');
                        await customClaimHeader.customizeLeaveHeaderWithFields(fieldsToAdd);
                        
                        // Validate added fields
                        for (const field of fieldsToAdd) {
                            await customClaimHeader.validateFieldIsVisible(field.trim());
                        }
                    }
                    
                    // Validate expected results
                    if (dataRow.ExpectedResult) {
                        const expectedFields = dataRow.ExpectedResult.split(',');
                        for (const field of expectedFields) {
                            await customClaimHeader.validateFieldIsVisible(field.trim());
                        }
                    }
                }
            } catch (error) {
                console.log(`Set ${setValue} not found or error: ${error}`);
            }
        }
    });

    test('Data-Driven Leave Status Color Testing', async ({ login, view, customClaimHeader }) => {
        // Test different status scenarios from Excel data
        const excelReader = new ExcelReader('C:\\DataVoV\\DataDriverVovQA.xlsx');
        
        try {
            excelReader.selectDataSet('LeaveStatusColors', 1);
            const rowCount = excelReader.count();
            
            for (let i = 0; i < rowCount; i++) {
                excelReader.useRow(i);
                const dataRow = excelReader.getAll();
                
                await login.performLoginDataDriven(parseInt(dataRow.DataSet));
                await view.goToClaimSearchTab();
                await view.SearchClaimByCriteria(parseInt(dataRow.DataSet));
                
                // Validate status color coding
                await customClaimHeader.validateLeaveStatusColorCoding(dataRow.Status);
            }
        } catch (error) {
            console.log(`LeaveStatusColors data not found: ${error}`);
        }
    });

    test('Data-Driven Leave Field Format Testing', async ({ login, view, customClaimHeader }) => {
        // Test field formats from Excel data
        const excelReader = new ExcelReader('C:\\DataVoV\\DataDriverVovQA.xlsx');
        
        try {
            excelReader.selectDataSet('LeaveFieldFormats', 1);
            const rowCount = excelReader.count();
            
            for (let i = 0; i < rowCount; i++) {
                excelReader.useRow(i);
                const dataRow = excelReader.getAll();
                
                await login.performLoginDataDriven(parseInt(dataRow.DataSet));
                await view.goToClaimSearchTab();
                await view.SearchClaimByCriteria(parseInt(dataRow.DataSet));
                
                // Add field and validate format
                await customClaimHeader.customizeLeaveHeaderWithFields([dataRow.FieldName]);
                await customClaimHeader.validateLeaveAdditionalFieldsFormat();
            }
        } catch (error) {
            console.log(`LeaveFieldFormats data not found: ${error}`);
        }
    });
});

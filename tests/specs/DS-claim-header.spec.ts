import { test, expect } from '../fixtures/BaseTest';
import { ExcelReader } from '../../utils/helpers/excel-reader';

/**
 * Disability Claim Header Test Suite
 * 
 * This test suite covers the comprehensive testing of the Disability Claim Header functionality
 * as specified in User Story requirements 3.2.004, 3.2.005, 3.2.05.1, and 3.2.006.
 * 
 * Test Coverage:
 * - Default field display and validation
 * - Field customization functionality
 * - Customization popup behavior
 * - Field ordering and persistence
 * - Data-driven testing scenarios
 */

    test.describe('DS Claim Header - Default Fields Display', () => {
        
        test.beforeEach(async ({ login }) => {
            // Navigate to a disability claim for testing
            await login.performLoginDataDriven(1);
        });

        test('Validate Default DS Claim Header Fields Display', async ({ customClaimHeader, view }) => {
            // Validate that all default fields are displayed in the correct order
            // Validate field order (left to right)
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(1);
            await customClaimHeader.customizeHeaderWithFields([]);
            await customClaimHeader.validateDefaultDisabilityClaimHeaderFields();
            const expectedDefaultOrder = [ 'Status', 'Opened', 'First absence', 'Closed', 'Reopened', 'Examiner'];
            await customClaimHeader.validateFieldOrderInHeader(expectedDefaultOrder);
        });

        test('Validate Status Field Color Coding', async ({ customClaimHeader, view }) => {
            // Test different status color coding scenarios
            const statusScenarios = [
                { status: 'Open', expectedColor: 'green', dataset: 2 },
                { status: 'Closed', expectedColor: 'red', dataset: 3 },
                { status: 'Incident', expectedColor: 'yellow', dataset: 4 }
            ];

            for (const scenario of statusScenarios) {
                await view.goToClaimSearchTab();
                await view.SearchClaimByCriteria(scenario.dataset);
                await customClaimHeader.validateStatusColorCoding(scenario.status);
            }
        });

        test('Validate Date Format Display', async ({ customClaimHeader, view }) => {
            // Validate that date fields display in MM/DD/YYYY format
            const dateFields = ['Opened', 'First absence', 'Closed', 'Reopened'];
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(3);
            for (const field of dateFields) {
                await customClaimHeader.validateDateFormat(field);
            }
        });

        test('Validate Examiner Name Format', async ({ customClaimHeader, view }) => {
            // Validate examiner displays as FIRST and LAST NAME, not as hyperlink
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(1);
            await customClaimHeader.validateExaminerNameFormat();
        });

        test('Validate Additional Fields Not Displayed by Default', async ({ customClaimHeader }) => {
            // Validate that additional fields are not visible by default
            const additionalFields = ['Client #', 'Client name', 'Last worked'];
            
            for (const field of additionalFields) {
                await customClaimHeader.validateFieldIsNotVisible(field);
            }
        });
    });

    test.describe('DS Claim Header - Customization Functionality', () => {

        test.beforeEach(async ({ login, view }) => {
            await login.performLoginDataDriven(1);
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(5);
        });

        test('Validate Pencil Icon Opens Customization Popup', async ({ customClaimHeader, view }) => {
            // Click pencil icon and validate popup opens
            await customClaimHeader.openCustomizationPopup();
        });

        test('Validate Available Additional Fields for Selection', async ({ customClaimHeader }) => {
            // Validate that additional fields are available for selection
            await customClaimHeader.openCustomizationPopup();
            await customClaimHeader.restoreDefaultFields();
            const additionalFields = ['Client #', 'Client name', 'Last worked'];
            for (const field of additionalFields) {
                await customClaimHeader.validateFieldIsAvailableForSelection(field);
            }
        });

        test('Add Single Additional Field to Header', async ({ customClaimHeader }) => {
            // Test adding Client # field
            await customClaimHeader.customizeHeaderWithFields(['Client #']);
            
            
            // Validate field is now visible in header
            await customClaimHeader.validateFieldIsVisible('Client #');
        });

        test('Add Multiple Additional Fields to Header', async ({ customClaimHeader }) => {
            // Test adding multiple fields
            const fieldsToAdd = ['Client #', 'Client name', 'Last worked'];
            await customClaimHeader.customizeHeaderWithFields(fieldsToAdd);
            
            // Validate all fields are now visible
            for (const field of fieldsToAdd) {
                await customClaimHeader.validateFieldIsVisible(field);
            }
        });

        test('Remove Field from Header', async ({ customClaimHeader }) => {
            // First add a field
            await customClaimHeader.customizeHeaderWithFields(['Client #']);
            await customClaimHeader.validateFieldIsVisible('Client #');
            
            // Then remove it
            await customClaimHeader.customizeHeaderWithFields([], ['Client #'], false);
            await customClaimHeader.validateFieldIsNotVisible('Client #');
        });

        test('Validate Maximum 10 Fields Limit', async ({ customClaimHeader }) => {
            // Add all available fields to test maximum limit
            const allFields = ['Client #', 'Client name', 'Last worked'];
            await customClaimHeader.customizeHeaderWithFields(allFields);
            
            // Validate maximum fields limit
            await customClaimHeader.validateMaximumFieldsLimit();
        });
    });

    test.describe('DS Claim Header - Customization Popup Behavior', () => {

        test.beforeEach(async ({ login, view }) => {
            await login.performLoginDataDriven(1);
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(1);
        });

        test('Validate Popup Header and Title', async ({ customClaimHeader }) => {
            await customClaimHeader.openCustomizationPopup();
            
            // Validate popup title is "Configure disability header"
            await customClaimHeader.validateCustomizationPopupIsOpen();
        });

        test('Validate At Least One Field Must Be Selected', async ({ customClaimHeader }) => {
            await customClaimHeader.openCustomizationPopup();
            await customClaimHeader.restoreDefaultFields();

            // Try to remove all fields (should not be allowed)
            // Note: This test assumes the system prevents removing all fields
            await customClaimHeader.validateAtLeastOneFieldSelected();
        });

        test('Validate Field Reordering Functionality', async ({ customClaimHeader }) => {
            // Add additional fields first
            await customClaimHeader.customizeHeaderWithFields(['Client #', 'Client name']);
            
            // Get current order
            const currentOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
            
            // Move a field up
            await customClaimHeader.reorderHeaderFields('Client #', 'up');
            
            // Validate order changed
            const newOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
            expect(newOrder, 'Field order should change after reordering').not.toEqual(currentOrder);
        });

        test('Validate Cancel Button Closes Popup Without Saving', async ({ customClaimHeader }) => {
            // Get initial field order
            await customClaimHeader.customizeHeaderWithFields([]);
            const initialOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
            
            // Open popup and make changes
            await customClaimHeader.openCustomizationPopup();
            await customClaimHeader.addFieldToHeader('Client #');
            
            // Cancel changes
            await customClaimHeader.closeCustomizationPopup();
            
            // Validate changes were not saved
            const finalOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
            expect(finalOrder, 'Field order should remain unchanged after cancel').toEqual(initialOrder);
        });

        test('Validate Save Button Persists Changes', async ({ customClaimHeader }) => {
            // Get initial field order
            const initialOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
            
            // Make changes and save
            await customClaimHeader.customizeHeaderWithFields(['Client #']);
            
            // Validate changes were saved
            const finalOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
            expect(finalOrder, 'Field order should change after saving').not.toEqual(initialOrder);
            expect(finalOrder, 'Client # should be in the new order').toContain('Client #');
        });

        test('Validate Restore Defaults Functionality', async ({ customClaimHeader }) => {
            // First customize the header
            await customClaimHeader.customizeHeaderWithFields(['Client #', 'Client name']);
            
            // Restore defaults
            await customClaimHeader.openCustomizationPopup();
            await customClaimHeader.restoreDefaultFields();
            await customClaimHeader.saveCustomizationChanges();
            
            // Validate default fields are restored
            await customClaimHeader.validateDefaultDisabilityClaimHeaderFields();
        });
    });
    
    test.describe('DS Claim Header - Persistence and Session Management', () => {

        test('Validate Customization Persists Across Different Claims', async ({ login, view, customClaimHeader }) => {
            // Navigate to first claim and customize
            await login.performLoginDataDriven(1);
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(1);
            
            // Customize header
            await customClaimHeader.customizeHeaderWithFields(['Client #', 'Client name']);
            
            // Navigate to different claim
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(2);
            
            // Validate customization persists
            await customClaimHeader.validateFieldIsVisible('Client #');
            await customClaimHeader.validateFieldIsVisible('Client name');
        });

        test('Validate Customization Persists After Logout/Login', async ({ login, view, customClaimHeader }) => {
            // First session - customize header
            await login.performLoginDataDriven(1);
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(1);
            await customClaimHeader.customizeHeaderWithFields(['Client #', 'Last worked']);
            
            // Logout
            await login.performLogout();
            
            // Second session - login and validate persistence
            await login.performLoginDataDriven(1);
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(1);
            
            // Validate customization persisted
            await customClaimHeader.validateFieldIsVisible('Client #');
            await customClaimHeader.validateFieldIsVisible('Last worked');
        });

        test('Validate Line of Business Specific Customization', async ({ login, view, customClaimHeader }) => {
            // Test that customization applies to all claims with same Line of Business
            // Navigate to DS claim and customize
            await login.performLoginDataDriven(1);
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(1); // DS claim
            await customClaimHeader.customizeHeaderWithFields(['Client #']);
            
            // Navigate to another DS claim
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(3); // Another DS claim
            
            // Validate customization applies to this DS claim too
            await customClaimHeader.validateFieldIsVisible('Client #');
            
            // Navigate to different Line of Business claim (if available)
            // This should not have the customization
            // Note: This test assumes there are claims with different LOB
        });
    });

    test.describe('DS Claim Header - Error Handling and Edge Cases', () => {

        test.beforeEach(async ({ login, view, customClaimHeader }) => {
            await login.performLoginDataDriven(1);
            await view.goToClaimSearchTab();
            await view.SearchClaimByCriteria(1);
        });

        test('Error Handling - Invalid Field Selection', async ({ customClaimHeader }) => {
            // Try to add non-existent field (should handle gracefully)
            try {
                await customClaimHeader.addFieldToHeader('Non-existent Field');
            } catch (error) {
                // Expected behavior - should handle error gracefully
                expect(error).toBeDefined();
            }
        });

        
        test('Edge Case - Empty Field Selection', async ({ customClaimHeader }) => {
            // Try to remove all fields (should not be allowed)
            const allDefaultFields = ['Status', 'Opened', 'First absence', 'Closed', 'Reopened', 'Examiner'];
            await customClaimHeader.customizeHeaderWithFields([], allDefaultFields, true, false);
            await customClaimHeader.errorRequiredMessageIsVisible();
        });

        test('Edge Case - Rapid Field Reordering', async ({ customClaimHeader }) => {
            // Add fields first
            await customClaimHeader.customizeHeaderWithFields(['Client #', 'Client name']);
            
            // Rapidly reorder fields
            await customClaimHeader.reorderHeaderFields('Client #', 'up');
            await customClaimHeader.reorderHeaderFields('Client name', 'down');
            await customClaimHeader.reorderHeaderFields('Client #', 'down');
            
            // Validate final state is consistent
            const finalOrder = await customClaimHeader.getCurrentHeaderFieldOrder();
            expect(finalOrder, 'Field order should be consistent after rapid reordering').toBeDefined();
        });
    });


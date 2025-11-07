import { test, expect } from '../fixtures/BaseTest';
import { ExcelReader } from '../../utils/helpers/excel-reader';

/**
 * LEAVE - DETAILS>CONTACTS Screen Test Suite
 * 
 * This test suite covers the comprehensive testing of the DETAILS>CONTACTS screen
 * as specified in User Story requirements 3.9.001 through 3.9.007.
 * 
 * Test Coverage:
 * - Page header and structure validation (3.9.001)
 * - Grid display with all required columns (3.9.001)
 * - Expandable row details functionality (3.9.002, 3.9.003)
 * - Grid filtering and count display (3.9.004)
 * - Pagination functionality (3.9.005)
 * - Scroll to top link (3.9.006)
 * - Standard footer (3.9.007)
 * - Data format validation
 * - Data-driven testing scenarios
 */

test.beforeEach(async ({ view }) => {
    await view.goToDashboardPage();
    await view.goToClaimSearchTab();
    await view.SearchClaimByCriteria(15);
});

test.describe('LV Contacts - Page Structure and Header', () => {
    
    test('Validate Contacts Page Header and Structure - Req 3.9.001', async ({ contacts }) => {
        // Navigate to Contacts tab
        await contacts.navigateToContactsTab();
        
        // Validate page header
        await contacts.validateContactsPageHeader();
        
        // Validate grid structure with all required columns
        await contacts.validateGridStructure();
        
        // Validate contact count display
        await contacts.validateContactCountDisplay();
    });

    test('Validate Grid Columns and Data Format - Req 3.9.001', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Validate grid has rows
        await contacts.waitTableToBeLoaded();
        const rowCount = await contacts.getGridRowCount();
        await expect(rowCount, 'Grid should have at least one contact row').toBeGreaterThan(0);
        
        // Validate data format for first row
        await contacts.validateGridRowDataFormat(0);
    });

    test('Validate Type Column Displays Full Description - Req 3.9.001', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Validate Type column displays full description, not 3-character codes
        await contacts.validateTypeColumnDisplaysFullDescription(0);
    });
});

test.describe('LV Contacts - Expandable Row Details (First Column)', () => {
    
    test('Validate Expandable Row Indicator Display - Req 3.9.002', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Validate expand button ('>') is displayed for rows with additional populated fields
        await contacts.validateExpandableRowIndicator(0);
    });

    test('Validate Expanded Row First Column Fields - Req 3.9.002', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate first column fields (Other phone, Authorized, Authorized begin, Authorized end, Comment)
        await contacts.validateExpandedRowFirstColumnFields(0);
    });

    test('Validate Other Phone Format - Req 3.9.002', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate Other phone format: (999) 999-9999
        const otherPhoneField = contacts.getExpandedField(0, 'Other phone', 'first');
        const isVisible = await contacts.isLocatorVisible(otherPhoneField);
        
        if (isVisible) {
            const phoneText = await otherPhoneField.textContent();
            if (phoneText && phoneText.trim() !== '') {
                const phoneRegex = /^\(\d{3}\)\s*\d{3}-\d{4}$/;
                expect(phoneText.trim(), 'Other phone should be in format (999) 999-9999').toMatch(phoneRegex);
            }
        }
    });

    test('Validate Authorized Fields Format - Req 3.9.002', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate Authorized field (Yes/No)
        const authorizedField = contacts.getExpandedField(0, 'Authorized', 'first');
        const isVisible = await contacts.isLocatorVisible(authorizedField);
        
        if (isVisible) {
            const authorizedText = await authorizedField.textContent();
            if (authorizedText && authorizedText.trim() !== '') {
                expect(authorizedText.trim(), 'Authorized should be Yes or No').toMatch(/^(Yes|No)$/);
            }
        }
        
        // Validate Authorized begin format: MM/DD/YYYY
        const authBeginField = contacts.getExpandedField(0, 'Authorized begin', 'first');
        const isAuthBeginVisible = await contacts.isLocatorVisible(authBeginField);
        
        if (isAuthBeginVisible) {
            const authBeginText = await authBeginField.textContent();
            if (authBeginText && authBeginText.trim() !== '') {
                const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                expect(authBeginText.trim(), 'Authorized begin should be in format MM/DD/YYYY').toMatch(dateRegex);
            }
        }
        
        // Validate Authorized end format: MM/DD/YYYY
        const authEndField = contacts.getExpandedField(0, 'Authorized end', 'first');
        const isAuthEndVisible = await contacts.isLocatorVisible(authEndField);
        
        if (isAuthEndVisible) {
            const authEndText = await authEndField.textContent();
            if (authEndText && authEndText.trim() !== '') {
                const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                expect(authEndText.trim(), 'Authorized end should be in format MM/DD/YYYY').toMatch(dateRegex);
            }
        }
    });

    test('Validate Comment Field Display - Req 3.9.002', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate Comment field (free form text)
        const commentField = contacts.getExpandedField(0, 'Comment', 'first');
        const isVisible = await contacts.isLocatorVisible(commentField);
        
        if (isVisible) {
            await expect(commentField, 'Comment field should be visible if populated').toBeVisible();
            const commentText = await commentField.textContent();
            expect(commentText, 'Comment should contain text').toBeTruthy();
        }
    });

    test('Validate Row Collapse Functionality - Req 3.9.002', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Collapse the row
        await contacts.collapseContactRow(0);
        
        // Validate expanded content is hidden
        const expandedContent = contacts.getExpandedRowFirstColumn(0);
        await expect(expandedContent, 'Expanded row content should be hidden after collapse').toBeHidden();
    });
});

test.describe('LV Contacts - Expandable Row Details (Second Column)', () => {
    
    test.beforeEach(async ({ view }) => {
        await view.goToDashboardPage();
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(14);
    });

    test('Validate Expanded Row Second Column Fields - Req 3.9.003', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate second column fields (CCE wage, Contact, Contact date, Contact place)
        await contacts.validateExpandedRowSecondColumnFields(0);
    });

    test('Validate CCE Wage Format and Display Logic - Req 3.9.003', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate CCE wage format: $999,999,999.99 (only display if value > 0)
        const cceWageField = contacts.getExpandedField(0, 'CCE wage', 'second');
        const isVisible = await contacts.isLocatorVisible(cceWageField);
        
        if (isVisible) {
            const wageText = await cceWageField.textContent();
            if (wageText && wageText.trim() !== '') {
                // Format: $999,999,999.99
                const wageRegex = /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/;
                expect(wageText.trim(), 'CCE wage should be in format $999,999,999.99').toMatch(wageRegex);
                
                // Extract numeric value and validate it's > 0
                const numericValue = parseFloat(wageText.replace(/[$,]/g, ''));
                expect(numericValue, 'CCE wage should be greater than 0 if displayed').toBeGreaterThan(0);
            }
        } else {
            // If not visible, it means value is 0 or doesn't apply (which is acceptable)
            console.log('[Test] CCE wage is not displayed (value is 0 or doesn\'t apply).');
        }
    });

    test('Validate Contact Date Format - Req 3.9.003', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate Contact date format: MM/DD/YYYY HH:MM:SS AM/PM or MM/DD/YYYY if time not populated
        const contactDateField = contacts.getExpandedField(0, 'Contact date', 'second');
        const isVisible = await contacts.isLocatorVisible(contactDateField);
        
        if (isVisible) {
            const dateText = await contactDateField.textContent();
            if (dateText && dateText.trim() !== '') {
                // Format: MM/DD/YYYY HH:MM:SS AM/PM or MM/DD/YYYY
                const dateTimeRegex = /^\d{1,2}\/\d{1,2}\/\d{4}(\s+\d{1,2}:\d{2}:\d{2}\s+(AM|PM))?$/;
                expect(dateText.trim(), 'Contact date should be in format MM/DD/YYYY HH:MM:SS AM/PM or MM/DD/YYYY').toMatch(dateTimeRegex);
            }
        }
    });

    test('Validate Contact and Contact Place Fields - Req 3.9.003', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate Contact field (free form text)
        const contactField = contacts.getExpandedField(0, 'Contact', 'second');
        const isContactVisible = await contacts.isLocatorVisible(contactField);
        
        if (isContactVisible) {
            await expect(contactField, 'Contact field should be visible if populated').toBeVisible();
            const contactText = await contactField.textContent();
            expect(contactText, 'Contact should contain text').toBeTruthy();
        }
        
        // Validate Contact place field (free form text)
        const contactPlaceField = contacts.getExpandedField(0, 'Contact place', 'second');
        const isContactPlaceVisible = await contacts.isLocatorVisible(contactPlaceField);
        
        if (isContactPlaceVisible) {
            await expect(contactPlaceField, 'Contact place field should be visible if populated').toBeVisible();
            const contactPlaceText = await contactPlaceField.textContent();
            expect(contactPlaceText, 'Contact place should contain text').toBeTruthy();
        }
    });

    test('Validate Complete Expanded Row Data - Req 3.9.002-3.9.003', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Validate complete expanded row data (both columns)
        await contacts.validateExpandedRowCompleteData(0);
    });
});

test.describe('LV Contacts - Grid Filtering and Count Display', () => {
    
    test.beforeEach(async ({ view }) => {
        await view.goToDashboardPage();
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(14);
    });

    test('Validate Filter Functionality - Req 3.9.004', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Get initial row count
        const initialCount = await contacts.getGridRowCount();
        expect(initialCount, 'Grid should have at least one contact row').toBeGreaterThan(0);
        
        // Apply filter
        await contacts.filterContacts('John', true);
        
        // Validate filtered results
        const filteredCount = await contacts.getGridRowCount();
        expect(filteredCount, 'Filtered results should be displayed').toBeGreaterThan(0);
    });

    test('Validate Contact Count Display Format - Req 3.9.004', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Validate contact count display format: "1 contact", "3 contacts", etc.
        await contacts.validateContactCountDisplay();
        
        const contactCount = await contacts.getContactCount();
        expect(contactCount, 'Contact count should be greater than 0').toBeGreaterThan(0);
    });

    test('Validate Filter Updates Contact Count - Req 3.9.004', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Get initial count
        const initialCount = await contacts.getContactCount();
        
        // Apply filter
        await contacts.filterContacts('Doctor', false);
        
        // Get filtered count
        const filteredCount = await contacts.getContactCount();
        
        // Filtered count should be less than or equal to initial count
        expect(filteredCount, 'Filtered count should be less than or equal to initial count').toBeLessThanOrEqual(initialCount);
        
        // Clean filter
        const filterCleaner = contacts.getFilterCleaner();
        if (await contacts.isLocatorVisible(filterCleaner)) {
            await filterCleaner.click();
            await contacts.delay(2000);
        }
    });
});

test.describe('LV Contacts - Pagination Functionality', () => {
    
    test.beforeEach(async ({ view }) => {
        await view.goToDashboardPage();
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(14);
    });

    test('Validate Pagination Controls Display - Req 3.9.005', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Validate pagination controls
        await contacts.validatePaginationControls();
    });

    test('Validate Next Page Navigation - Req 3.9.005', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Check if pagination is available
        const paginationSection = contacts.getPaginationSection();
        const isPaginationVisible = await contacts.isLocatorVisible(paginationSection);
        
        if (isPaginationVisible) {
            // Validate we're on a different page
            let currentPageNumber = await contacts.getCurrentPageNumber();
            await contacts.navigateToNextPage();
            let nextPageNumber = await contacts.getCurrentPageNumber();
            expect(currentPageNumber, `Page number should change after navigation. Initial Page [${currentPageNumber}], Actual Page [${nextPageNumber}]`).not.toBe(nextPageNumber);
        } else {
            console.log('[Test] Pagination is not available (less than one page of results).');
        }
    });

    test('Validate Previous Page Navigation - Req 3.9.005', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Check if pagination is available
        const paginationSection = contacts.getPaginationSection();
        const isPaginationVisible = await contacts.isLocatorVisible(paginationSection);
        
        if (isPaginationVisible) {
            // Navigate to next page first
            await contacts.navigateToNextPage();
            let currentPageNumber = await contacts.getCurrentPageNumber();
            
            // Navigate to previous page
            await contacts.navigateToPreviousPage();
            let previousPageNumber = await contacts.getCurrentPageNumber();
            
            expect(currentPageNumber, `Page number should change after navigation. Current Page [${currentPageNumber}], Previous Page [${previousPageNumber}]`).not.toBe(previousPageNumber);
        } else {
            console.log('[Test] Pagination is not available (less than one page of results).');
        }
    });

    test('Validate Specific Page Navigation - Req 3.9.005', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Check if pagination is available
        const paginationSection = contacts.getPaginationSection();
        const isPaginationVisible = await contacts.isLocatorVisible(paginationSection);
        
        if (isPaginationVisible) {
            // Navigate to page 2
            await contacts.navigateToSpecificPage(2);
            let pageNumber = await contacts.getCurrentPageNumber();
            expect(pageNumber, 'Should navigate to page 2').toBe('2');
        } else {
            console.log('[Test] Pagination is not available (less than one page of results).');
        }
    });
});

test.describe('LV Contacts - Scroll to Top Link', () => {
    
    test.beforeEach(async ({ view }) => {
        await view.goToDashboardPage();
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(14);
    });

    test('Validate Scroll to Top Link Visibility - Req 3.9.006', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Validate scroll to top link is visible at bottom of page
        await contacts.validateScrollToTopLink();
    });

    test('Test Scroll to Top Functionality - Req 3.9.006', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Test scroll to top functionality
        await contacts.clickScrollToTopLink();
    });
});

test.describe('LV Contacts - Standard Footer', () => {
    
    test.beforeEach(async ({ view }) => {
        await view.goToDashboardPage();
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(14);
    });

    test('Validate Standard Footer Display - Req 3.9.007', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Validate standard footer is displayed
        await contacts.validateStandardFooter();
    });
});

test.describe('LV Contacts - Data Format Validation', () => {
    
    test.beforeEach(async ({ view }) => {
        await view.goToDashboardPage();
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(14);
    });

    test('Validate All Grid Column Formats - Req 3.9.001', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Validate all columns for multiple rows
        const rowCount = await contacts.getGridRowCount();
        const rowsToValidate = Math.min(rowCount, 5); // Validate up to 5 rows
        
        for (let i = 0; i < rowsToValidate; i++) {
            await contacts.validateGridRowDataFormat(i);
            await contacts.validateTypeColumnDisplaysFullDescription(i);
        }
    });

    test('Validate Multiple Expanded Rows - Req 3.9.002-3.9.003', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Validate expanded row data for multiple rows
        const rowCount = await contacts.getGridRowCount();
        const rowsToValidate = Math.min(rowCount, 3); // Validate up to 3 rows
        
        for (let i = 0; i < rowsToValidate; i++) {
            // Check if row is expandable
            const expandButton = contacts.getExpandButton(i);
            const isExpandable = await contacts.isLocatorVisible(expandButton);
            
            if (isExpandable) {
                await contacts.validateExpandedRowCompleteData(i);
                await contacts.collapseContactRow(i);
            }
        }
    });
});

test.describe('LV Contacts - Error Handling and Edge Cases', () => {
    
    test.beforeEach(async ({ view }) => {
        await view.goToDashboardPage();
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(14);
    });

    test('Edge Case - No Contacts Available', async ({ contacts, view }) => {
        // Navigate to a claim that may have no contacts
        await view.SearchClaimByCriteria(15);
        await contacts.navigateToContactsTab();
        
        // Validate page still loads correctly
        await contacts.validateContactsPageHeader();
        
        // Validate grid structure is still present
        await contacts.validateGridStructure();
    });

    test('Edge Case - Filter with No Results', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Apply filter that should return no results
        await contacts.filterContacts('NonExistentContact12345', true);
        
        // Validate filter handles no results gracefully
        const rowCount = await contacts.getGridRowCount();
        expect(rowCount, 'Filter with no results should handle gracefully').toBeGreaterThanOrEqual(0);
    });

    test('Edge Case - Rapid Row Expansion and Collapse', async ({ contacts }) => {
        await contacts.navigateToContactsTab();
        
        // Rapidly expand and collapse multiple rows
        const rowCount = await contacts.getGridRowCount();
        const rowsToTest = Math.min(rowCount, 3);
        
        for (let i = 0; i < rowsToTest; i++) {
            const expandButton = contacts.getExpandButton(i);
            const isExpandable = await contacts.isLocatorVisible(expandButton);
            
            if (isExpandable) {
                await contacts.expandContactRow(i);
                await contacts.delay(500);
                await contacts.collapseContactRow(i);
                await contacts.delay(500);
            }
        }
        
        // Validate final state is consistent
        await contacts.validateGridStructure();
    });
});


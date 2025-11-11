import { test, expect } from '../fixtures/BaseTest';

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

test.beforeEach(async ({ view, contacts }) => {
    await view.goToDashboardPage();
    await view.goToClaimSearchTab();
    await view.SearchClaimByCriteria(13);
    await contacts.navigateToContactsTab();
});

test.describe('LV Contacts - Page Structure and Header', () => {
    
    test('Validate Contacts Page Header and Structure - Req 3.9.001', async ({ contacts }) => {
        // Validate page header
        await contacts.validateContactsPageHeader();
        
        // Validate grid structure with all required columns
        await contacts.validateGridStructure();
        
        // Validate contact count display
        await contacts.validateContactCountDisplay();
    });

    test('Validate Grid Columns and Data Format - Req 3.9.001', async ({ contacts }) => {
        // Validate grid has rows
        await contacts.waitTableToBeLoaded();
        const rowCount = await contacts.getGridRowCount();
        
        // Validate row count is greater than 0
        const countIsValid = rowCount > 0;
        await expect(rowCount, 'Grid should have at least one contact row').toBeGreaterThan(0);
        
        let ctrlIcon = countIsValid ? '✅': '❌';
        let ctrlMessage = countIsValid 
            ? `found (${rowCount} rows)` 
            : `no rows found (expected at least 1, found ${rowCount})`;
        console.log(`[Test] ${ctrlIcon} Grid rows ${ctrlMessage}.`);
        
        // Validate data format for first row
        await contacts.validateGridRowDataFormat(0);
    });

    test('Validate Type Column Displays Full Description - Req 3.9.001', async ({ contacts }) => {
        // Validate Type column displays full description, not 3-character codes
        await contacts.validateTypeColumnDisplaysFullDescription(0);
    });
});

test.describe('LV Contacts - Expandable Row Details (First Column)', () => {
    
    test('Validate Expandable Row Indicator Display - Req 3.9.002', async ({ contacts }) => {
        // Validate expand button ('>') is displayed for rows with additional populated fields
        await contacts.validateExpandableRowIndicator(0);
    });

    test('Validate Expanded Row First Column Fields - Req 3.9.002', async ({ contacts }) => {
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate first column fields (Other phone, Authorized, Authorized begin, Authorized end, Comment)
        await contacts.validateExpandedRowFirstColumnFields(0);
    });

    test('Validate Other Phone Format - Req 3.9.002', async ({ contacts }) => {
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate Other phone format: (999) 999-9999
        const otherPhoneField = contacts.getExpandedField(0, 'Other phone', 'first');
        
        // Fail if element is not present
        await expect.soft(otherPhoneField, 'Other phone field should be visible').toBeVisible();
        let isCond = await contacts.isLocatorVisible(otherPhoneField);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Other phone field ${ctrlMessage}.`);
        
        // Fail if text content is empty
        const phoneText = await otherPhoneField.textContent();
        const hasTextContent = !!phoneText;
        expect.soft(phoneText, 'Other phone field should have text content').toBeTruthy();
        
        ctrlIcon = hasTextContent ? '✅': '❌';
        ctrlMessage = hasTextContent ? 'has text content' : 'should have text content but was empty';
        console.log(`[Test] ${ctrlIcon} Other phone field ${ctrlMessage}.`);
        
        const isNotEmpty = phoneText?.trim() !== '';
        expect.soft(phoneText?.trim(), 'Other phone field should not be empty').not.toBe('');
        
        ctrlIcon = isNotEmpty ? '✅': '❌';
        ctrlMessage = isNotEmpty ? 'is not empty' : 'should not be empty but was empty';
        console.log(`[Test] ${ctrlIcon} Other phone field ${ctrlMessage}.`);
        
        // Validate format: (999) 999-9999
        const phoneRegex = /^\(\d{3}\)\s*\d{3}-\d{4}$/;
        const phoneTextTrimmed = phoneText!.trim();
        const formatMatches = phoneRegex.test(phoneTextTrimmed);
        expect.soft(phoneTextTrimmed, 'Other phone should be in format (999) 999-9999').toMatch(phoneRegex);
        
        ctrlIcon = formatMatches ? '✅': '❌';
        ctrlMessage = formatMatches 
            ? `is in correct format: "${phoneTextTrimmed}"` 
            : `should be in format "(999) 999-9999" but found "${phoneTextTrimmed}"`;
        console.log(`[Test] ${ctrlIcon} Other phone format ${ctrlMessage}.`);
    });

    test('Validate Authorized Fields Format - Req 3.9.002', async ({ contacts }) => {
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate Authorized field (Yes/No)
        const authorizedField = contacts.getExpandedField(0, 'Authorized', 'first');
        const isVisible = await contacts.isLocatorVisible(authorizedField);
        
        if (isVisible) {
            let ctrlIcon = '✅';
            let ctrlMessage = 'is visible (field is populated)';
            console.log(`[Test] ${ctrlIcon} Authorized field ${ctrlMessage}.`);
            
            const authorizedText = await authorizedField.textContent();
            if (authorizedText && authorizedText.trim() !== '') {
                const authorizedTextTrimmed = authorizedText.trim();
                const authorizedRegex = /^(Yes|No)$/;
                const formatMatches = authorizedRegex.test(authorizedTextTrimmed);
                expect.soft(authorizedTextTrimmed, 'Authorized should be Yes or No').toMatch(authorizedRegex);
                
                ctrlIcon = formatMatches ? '✅': '❌';
                ctrlMessage = formatMatches 
                    ? `is in correct format: "${authorizedTextTrimmed}"` 
                    : `should be "Yes" or "No" but found "${authorizedTextTrimmed}"`;
                console.log(`[Test] ${ctrlIcon} Authorized field format ${ctrlMessage}.`);
            } else {
                console.log(`[Test] ⚠️ Authorized field is empty or not found.`);
            }
        } else {
            let ctrlIcon = '⚠️';
            let ctrlMessage = 'is not visible (field is not populated)';
            console.log(`[Test] ${ctrlIcon} Authorized field ${ctrlMessage}.`);
        }
        
        // Validate Authorized begin format: MM/DD/YYYY
        const authBeginField = contacts.getExpandedField(0, 'Authorized begin', 'first');
        const isAuthBeginVisible = await contacts.isLocatorVisible(authBeginField);
        
        if (isAuthBeginVisible) {
            let ctrlIcon = '✅';
            let ctrlMessage = 'is visible (field is populated)';
            console.log(`[Test] ${ctrlIcon} Authorized begin field ${ctrlMessage}.`);
            
            const authBeginText = await authBeginField.textContent();
            if (authBeginText && authBeginText.trim() !== '') {
                const authBeginTextTrimmed = authBeginText.trim();
                const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                const formatMatches = dateRegex.test(authBeginTextTrimmed);
                expect.soft(authBeginTextTrimmed, 'Authorized begin should be in format MM/DD/YYYY').toMatch(dateRegex);
                
                ctrlIcon = formatMatches ? '✅': '❌';
                ctrlMessage = formatMatches 
                    ? `is in correct format: "${authBeginTextTrimmed}"` 
                    : `should be in format "MM/DD/YYYY" but found "${authBeginTextTrimmed}"`;
                console.log(`[Test] ${ctrlIcon} Authorized begin format ${ctrlMessage}.`);
            } else {
                console.log(`[Test] ⚠️ Authorized begin field is empty or not found.`);
            }
        } else {
            let ctrlIcon = '⚠️';
            let ctrlMessage = 'is not visible (field is not populated)';
            console.log(`[Test] ${ctrlIcon} Authorized begin field ${ctrlMessage}.`);
        }
        
        // Validate Authorized end format: MM/DD/YYYY
        const authEndField = contacts.getExpandedField(0, 'Authorized end', 'first');
        const isAuthEndVisible = await contacts.isLocatorVisible(authEndField);
        
        if (isAuthEndVisible) {
            let ctrlIcon = '✅';
            let ctrlMessage = 'is visible (field is populated)';
            console.log(`[Test] ${ctrlIcon} Authorized end field ${ctrlMessage}.`);
            
            const authEndText = await authEndField.textContent();
            if (authEndText && authEndText.trim() !== '') {
                const authEndTextTrimmed = authEndText.trim();
                const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                const formatMatches = dateRegex.test(authEndTextTrimmed);
                expect.soft(authEndTextTrimmed, 'Authorized end should be in format MM/DD/YYYY').toMatch(dateRegex);
                
                ctrlIcon = formatMatches ? '✅': '❌';
                ctrlMessage = formatMatches 
                    ? `is in correct format: "${authEndTextTrimmed}"` 
                    : `should be in format "MM/DD/YYYY" but found "${authEndTextTrimmed}"`;
                console.log(`[Test] ${ctrlIcon} Authorized end format ${ctrlMessage}.`);
            } else {
                console.log(`[Test] ⚠️ Authorized end field is empty or not found.`);
            }
        } else {
            let ctrlIcon = '⚠️';
            let ctrlMessage = 'is not visible (field is not populated)';
            console.log(`[Test] ${ctrlIcon} Authorized end field ${ctrlMessage}.`);
        }
    });

    test('Validate Comment Field Display - Req 3.9.002', async ({ contacts }) => {
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate Comment field (free form text)
        const commentField = contacts.getExpandedField(0, 'Comment', 'first');
        
        // Fail if element is not present
        await expect.soft(commentField, 'Comment field should be visible').toBeVisible();
        let isCond = await contacts.isLocatorVisible(commentField);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Comment field ${ctrlMessage}.`);
        
        // Fail if text content is empty
        const commentText = await commentField.textContent();
        const hasTextContent = !!commentText;
        expect.soft(commentText, 'Comment field should have text content').toBeTruthy();
        
        ctrlIcon = hasTextContent ? '✅': '❌';
        ctrlMessage = hasTextContent ? 'has text content' : 'should have text content but was empty';
        console.log(`[Test] ${ctrlIcon} Comment field ${ctrlMessage}.`);
        
        const isNotEmpty = commentText?.trim() !== '';
        expect.soft(commentText?.trim(), 'Comment field should not be empty').not.toBe('');
        
        ctrlIcon = isNotEmpty ? '✅': '❌';
        ctrlMessage = isNotEmpty ? 'is not empty' : 'should not be empty but was empty';
        console.log(`[Test] ${ctrlIcon} Comment field ${ctrlMessage}.`);
    });

    test('Validate Row Collapse Functionality - Req 3.9.002', async ({ contacts }) => {
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Collapse the row
        await contacts.collapseContactRow(0);
        
        // Validate expanded content is hidden
        const expandedContent = contacts.getExpandedRowFirstColumn(0);
        await expect.soft(expandedContent, 'Expanded row content should be hidden after collapse').toBeHidden();
        
        const isHidden = !(await contacts.isLocatorVisible(expandedContent));
        let ctrlIcon = isHidden ? '✅': '❌';
        let ctrlMessage = isHidden ? 'is hidden (row collapsed successfully)' : 'should be hidden but is still visible';
        console.log(`[Test] ${ctrlIcon} Expanded row content ${ctrlMessage}.`);
    });
});

test.describe('LV Contacts - Expandable Row Details (Second Column)', () => {
    

    test('Validate Expanded Row Second Column Fields - Req 3.9.003', async ({ contacts }) => {
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate second column fields (CCE wage, Contact, Contact date, Contact place)
        await contacts.validateExpandedRowSecondColumnFields(0);
    });

    test('Validate Contact Date Format - Req 3.9.003', async ({ contacts }) => {
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate Contact date format: MM/DD/YYYY HH:MM:SS AM/PM or MM/DD/YYYY if time not populated
        const contactDateField = contacts.getExpandedField(0, 'Contact date', 'second');
        
        // Fail if element is not present
        await expect(contactDateField, 'Contact date field should be visible').toBeVisible();
        let isCond = await contacts.isLocatorVisible(contactDateField);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Contact date field ${ctrlMessage}.`);

        // Fail if text content is empty
        const dateText = await contactDateField.textContent();
        expect(dateText, 'Contact date field should have text content').toBeTruthy();
        expect(dateText?.trim(), 'Contact date field should not be empty').not.toBe('');
        
        // Validate format: MM/DD/YYYY HH:MM:SS AM/PM or MM/DD/YYYY
        const dateTimeRegex = /^\d{1,2}\/\d{1,2}\/\d{4}(\s+\d{1,2}:\d{2}:\d{2}\s+(AM|PM))?$/;
        const dateTimeMatches = dateTimeRegex.test(dateText!.trim());
        expect(dateText!.trim(), 'Contact date should be in format MM/DD/YYYY HH:MM:SS AM/PM or MM/DD/YYYY').toMatch(dateTimeRegex);
        
        ctrlIcon = dateTimeMatches ? '✅': '❌';
        ctrlMessage = dateTimeMatches 
            ? `is in correct format (MM/DD/YYYY): "${dateText!.trim()}"` 
            : `should be in format "MM/DD/YYYY" or "MM/DD/YYYY" but found "${dateText!.trim()}"`;
        console.log(`[Test] ${ctrlIcon} Contact date format ${ctrlMessage}.`);
    });

    test('Validate Contact and Contact Place Fields - Req 3.9.003', async ({ contacts }) => {
        // Expand first row
        await contacts.expandContactRow(0);
        
        // Validate Contact field (free form text)
        const contactField = contacts.getExpandedField(0, 'Contact', 'second');
        const isContactVisible = await contacts.isLocatorVisible(contactField);
        
        if (isContactVisible) {
            await expect.soft(contactField, 'Contact field should be visible if populated').toBeVisible();
            let isCond = await contacts.isLocatorVisible(contactField);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is visible (field is populated)' : 'should be visible but was not found';
            console.log(`[Test] ${ctrlIcon} Contact field ${ctrlMessage}.`);
            
            const contactText = await contactField.textContent();
            if (contactText && contactText.trim() !== '') {
                expect(contactText, 'Contact should contain text').toBeTruthy();
                ctrlIcon = '✅';
                ctrlMessage = `contains text: "${contactText.trim()}"`;
                console.log(`[Test] ${ctrlIcon} Contact field ${ctrlMessage}.`);
            } else {
                console.log(`[Test] ⚠️ Contact field is empty or not found.`);
            }
        } else {
            let ctrlIcon = '⚠️ ';
            let ctrlMessage = 'is not visible (field is not populated)';
            console.log(`[Test] ${ctrlIcon} Contact field ${ctrlMessage}.`);
        }
        
        // Validate Contact place field (free form text)
        const contactPlaceField = contacts.getExpandedField(0, 'Contact place', 'second');
        const isContactPlaceVisible = await contacts.isLocatorVisible(contactPlaceField);
        
        if (isContactPlaceVisible) {
            await expect.soft(contactPlaceField, 'Contact place field should be visible if populated').toBeVisible();
            let isCond = await contacts.isLocatorVisible(contactPlaceField);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is visible (field is populated)' : 'should be visible but was not found';
            console.log(`[Test] ${ctrlIcon} Contact place field ${ctrlMessage}.`);
            
            const contactPlaceText = await contactPlaceField.textContent();
            if (contactPlaceText && contactPlaceText.trim() !== '') {
                expect(contactPlaceText, 'Contact place should contain text').toBeTruthy();
                ctrlIcon = '✅';
                ctrlMessage = `contains text: "${contactPlaceText.trim()}"`;
                console.log(`[Test] ${ctrlIcon} Contact place field ${ctrlMessage}.`);
            } else {
                console.log(`[Test] ⚠️ Contact place field is empty or not found.`);
            }
        } else {
            let ctrlIcon = '⚠️ ';
            let ctrlMessage = 'is not visible (field is not populated)';
            console.log(`[Test] ${ctrlIcon} Contact place field ${ctrlMessage}.`);
        }
    });

    test('Validate Complete Expanded Row Data - Req 3.9.002-3.9.003', async ({ contacts }) => {
        // Validate complete expanded row data (both columns)
        await contacts.validateExpandedRowCompleteData(0);
    });
});

test.describe('LV Contacts - Grid Filtering and Count Display', () => {
    
    test('Validate Filter Functionality - Req 3.9.004', async ({ contacts }) => {
        // Get initial row count
        const initialCount = await contacts.getGridRowCount();
        const countIsValid = initialCount > 0;
        expect.soft(initialCount, 'Grid should have at least one contact row').toBeGreaterThan(0);
        
        let ctrlIcon = countIsValid ? '✅': '❌';
        let ctrlMessage = countIsValid 
            ? `found (${initialCount} rows)` 
            : `no rows found (expected at least 1, found ${initialCount})`;
        console.log(`[Test] ${ctrlIcon} Grid rows ${ctrlMessage}.`);
        
        // Apply filter
        await contacts.filterContacts('COLLEEN AALTO', true);
    });

    test('Validate Contact Count Display Format - Req 3.9.004', async ({ contacts }) => {
        // Validate contact count display format: "1 contact", "3 contacts", etc.
        await contacts.validateContactCountDisplay();
        
        // Validate contact count is greater than 0
        const contactCount = await contacts.getContactCount();
        const countIsValid = contactCount > 0;
        expect.soft(contactCount, 'Contact count should be greater than 0').toBeGreaterThan(0);
        
        let ctrlIcon = countIsValid ? '✅': '❌';
        let ctrlMessage = countIsValid 
            ? `is valid: ${contactCount} contact(s)` 
            : `should be greater than 0 but found ${contactCount}`;
        console.log(`[Test] ${ctrlIcon} Contact count ${ctrlMessage}.`);
    });

    test('Validate Filter Updates Contact Count - Req 3.9.004', async ({ contacts }) => {
        // Apply filter
        await contacts.filterContacts('System-Custom Contact MN2', false);
        
        // Validate contact count number
        const contactCount = await contacts.getContactCount();
        const expectedCount = 2;
        const countMatches = contactCount === expectedCount;
        expect.soft(contactCount, 'Contact count should return 2 rows').toBe(expectedCount);
        
        let ctrlIcon = countMatches ? '✅': '❌';
        let ctrlMessage = countMatches 
            ? `matches expected count: ${contactCount}` 
            : `should be ${expectedCount} but found ${contactCount}`;
        console.log(`[Test] ${ctrlIcon} Contact count ${ctrlMessage}.`);
        
        // Validate contact count text display
        const contactCountText = await contacts.getContactCountText();
        const expectedText = "2 found";
        const textMatches = contactCountText === expectedText;
        expect.soft(contactCountText, 'Contact count should display "2 found"').toBe(expectedText);
        
        ctrlIcon = textMatches ? '✅': '❌';
        ctrlMessage = textMatches 
            ? `displays correct text: "${contactCountText}"` 
            : `should display "${expectedText}" but found "${contactCountText}"`;
        console.log(`[Test] ${ctrlIcon} Contact count text ${ctrlMessage}.`);
    });
});

test.describe('LV Contacts - Pagination Functionality', () => {
    
    test('Validate Pagination Controls Display - Req 3.9.005', async ({ contacts }) => {
        // Validate pagination controls
        await contacts.validatePaginationControls();
    });

    test('Validate Next Page Navigation - Req 3.9.005', async ({ contacts }) => {
        // Get initial page number before navigation
        let initialPageNumber = await contacts.getCurrentPageNumber();
        console.log(`[Test] Current page before clicking next: ${initialPageNumber}`);
        
        // Check if pagination is available - navigate to next page
        await contacts.navigateToNextPage();
        let currentPageNumber = await contacts.getCurrentPageNumber();
        console.log(`[Test] Current page after clicking next: ${currentPageNumber}`);
        
        // Validate page number changed
        const pageChanged = currentPageNumber !== initialPageNumber;
        expect.soft(currentPageNumber, `Page number should change after navigation. Current Page [${currentPageNumber}], Previous Page [${initialPageNumber}]`).not.toBe(initialPageNumber);
        
        let ctrlIcon = pageChanged ? '✅': '❌';
        let ctrlMessage = pageChanged 
            ? `page changed from ${initialPageNumber} to ${currentPageNumber}` 
            : `page did not change, still on page ${currentPageNumber}`;
        console.log(`[Test] ${ctrlIcon} Page navigation ${ctrlMessage}.`);
    });

    test('Validate Previous Page Navigation - Req 3.9.005', async ({ contacts }) => {
        // Get initial page number before navigation
        let initialPageNumber = await contacts.getCurrentPageNumber();
        console.log(`[Test] Current page before clicking next: ${initialPageNumber}`);
        
        // Check if pagination is available - navigate to next page
        await contacts.navigateToNextPage();
        let currentPageNumber = await contacts.getCurrentPageNumber();
        console.log(`[Test] Current page after clicking next: ${currentPageNumber}`);
        
        // Validate page number changed after clicking next
        const pageChangedAfterNext = currentPageNumber !== initialPageNumber;
        expect(currentPageNumber, `Page number should change after navigation. Current Page [${currentPageNumber}], Previous Page [${initialPageNumber}]`).not.toBe(initialPageNumber);
        
        let ctrlIcon = pageChangedAfterNext ? '✅': '❌';
        let ctrlMessage = pageChangedAfterNext 
            ? `page changed from ${initialPageNumber} to ${currentPageNumber}` 
            : `page did not change, still on page ${currentPageNumber}`;
        console.log(`[Test] ${ctrlIcon} Next page navigation ${ctrlMessage}.`);

        // Check if pagination is available - navigate to previous page
        await contacts.navigateToPreviousPage();
        let previousPageNumber = await contacts.getCurrentPageNumber();
        console.log(`[Test] Current page after clicking previous: ${previousPageNumber}`);
        
        // Validate page number changed back to initial
        const pageChangedBack = previousPageNumber === initialPageNumber;
        expect(previousPageNumber, `Page number should change after navigation. Current Page [${previousPageNumber}], Previous Page [${initialPageNumber}]`).toBe(initialPageNumber);
        
        ctrlIcon = pageChangedBack ? '✅': '❌';
        ctrlMessage = pageChangedBack 
            ? `page changed back from ${currentPageNumber} to ${previousPageNumber}` 
            : `page did not change back, expected page ${initialPageNumber} but found ${previousPageNumber}`;
        console.log(`[Test] ${ctrlIcon} Previous page navigation ${ctrlMessage}.`);
    });

    test('Validate Specific Page Navigation - Req 3.9.005', async ({ contacts }) => {
        // Check if pagination is available
        const paginationSection = contacts.getPaginationSection();
        const isPaginationVisible = await contacts.isLocatorVisible(paginationSection);
        
        if (isPaginationVisible) {
            // Get initial page number before navigation
            let initialPageNumber = await contacts.getCurrentPageNumber();
            console.log(`[Test] Current page before navigation: ${initialPageNumber}`);
            
            // Navigate to page 2
            const targetPage = 3;
            await contacts.navigateToSpecificPage(targetPage);
            let pageNumber = await contacts.getCurrentPageNumber();
            console.log(`[Test] Current page after navigation: ${pageNumber}`);
            
            // Validate page number changed to target page
            const pageNavigated = pageNumber === String(targetPage);
            expect(pageNumber, 'Should navigate to page 3').toBe('3');
            
            let ctrlIcon = pageNavigated ? '✅': '❌';
            let ctrlMessage = pageNavigated 
                ? `navigated to page ${pageNumber} successfully` 
                : `did not navigate to page ${targetPage}, found page ${pageNumber}`;
            console.log(`[Test] ${ctrlIcon} Specific page navigation ${ctrlMessage}.`);
        } else {
            console.log('[Test] Pagination is not available (less than one page of results).');
        }
    });
});

test.describe('LV Contacts - Scroll to Top Link', () => {
    
    test('Validate Scroll to Top Link Visibility - Req 3.9.006', async ({ contacts }) => {
        // Validate scroll to top link is visible at bottom of page
        await contacts.validateScrollToTopLink();
    });

    test('Test Scroll to Top Functionality - Req 3.9.006', async ({ contacts }) => {
        // Validate scroll to top link is visible at bottom of page
        await contacts.validateScrollToTopLink();
        
        // Test scroll to top functionality
        await contacts.clickScrollToTopLink();
    });
});

test.describe('LV Contacts - Standard Footer', () => {
    
    test('Validate Standard Footer Display - Req 3.9.007', async ({ contacts }) => {
        // Validate standard footer is displayed
        await contacts.validateStandardFooter();
    });
});

test.describe('LV Contacts - Data Format Validation', () => {
    
    test('Validate All Grid Column Formats - Req 3.9.001', async ({ contacts }) => {
        // Validate all columns for multiple rows
        const rowCount = await contacts.getGridRowCount();
        const rowsToValidate = Math.min(rowCount, 5); // Validate up to 5 rows
        
        for (let i = 0; i < rowsToValidate; i++) {
            await contacts.validateGridRowDataFormat(i);
            await contacts.validateTypeColumnDisplaysFullDescription(i);
        }
    });

    test('Validate Multiple Expanded Rows - Req 3.9.002-3.9.003', async ({ contacts }) => {
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
    
    test('Edge Case - Filter with No Results', async ({ contacts }) => {
        // Get initial row count before filter
        const initialRowCount = await contacts.getGridRowCount();
        console.log(`[Test] Initial row count before filter: ${initialRowCount}`);
        
        // Apply filter that should return no results
        const filterValue = 'NonExistentContact12345';
        await contacts.filterContacts(filterValue, false, false);
        console.log(`[Test] Applied filter: "${filterValue}"`);
        
        // Validate filter handles no results gracefully
        const rowCount = await contacts.getGridRowCount();
        const noResultsFound = rowCount === 0;
        expect(rowCount, 'Filter with no results should handle gracefully').toBe(0);
        
        let ctrlIcon = noResultsFound ? '✅': '❌';
        let ctrlMessage = noResultsFound 
            ? `filter handled correctly, no results found (${rowCount} rows)` 
            : `filter should return 0 results but found ${rowCount} rows`;
        console.log(`[Test] ${ctrlIcon} Filter with no results ${ctrlMessage}.`);
    });

});


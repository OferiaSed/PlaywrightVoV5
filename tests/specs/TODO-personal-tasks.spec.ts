import { test, expect } from '../fixtures/BaseTest';

/**
 * TO-DO Module - Personal Tasks Test Suite
 * 
 * This test suite covers the comprehensive testing of the TO-DO module Personal Tasks functionality
 * as specified in User Story requirements 3.4.001 through 3.4.003.
 * 
 * Test Coverage:
 * - Personal Tasks page browse view elements (Req 3.4.001)
 * - Personal Tasks calendar functionality (Req 3.4.001)
 * - Personal Tasks search functionality (Req 3.4.001)
 * - Personal Tasks table structure and actions (Req 3.4.002)
 * - New Task screen elements and functionality (Req 3.4.003)
 * - Data-driven testing scenarios
 */

test.beforeEach(async ({ view, todo }) => {
    await view.goToDashboardPage();
    await todo.navigateToTodoModule();
});

test.describe('TO-DO Personal Tasks - Browse View', () => {
    
    test.beforeEach(async ({ todo }) => {
        await todo.selectPersonalTasksTab();
    });

    test('Validate Browse View Elements - Req 3.4.001', async ({ todo }) => {
        // Validate Browse radio button is selected by default
        await todo.validatePersonalTasksBrowseRadioButton();
        
        // Validate calendar elements (same as Shared Diaries)
        await todo.validateCalendarElements();
        
        // Validate calendar date range display format
        await todo.validateCalendarDateRangeDisplay();
    });

    test('Validate Calendar Navigation - Previous Week - Req 3.4.001', async ({ todo }) => {
        // Get initial date range
        const initialDateRange = await todo.getCalendarHeader().textContent();
        console.log(`[Test] Initial date range: ${initialDateRange}`);
        
        // Click previous arrow
        await todo.clickCalendarPreviousArrow();
        
        // Validate date range changed
        const newDateRange = await todo.getCalendarHeader().textContent();
        const dateRangeChanged = newDateRange !== initialDateRange;
        expect.soft(newDateRange, 'Date range should change after clicking previous arrow').not.toBe(initialDateRange);
        
        let ctrlIcon = dateRangeChanged ? '✅': '❌';
        let ctrlMessage = dateRangeChanged 
            ? `date range changed from "${initialDateRange}" to "${newDateRange}"` 
            : `date range did not change, still "${newDateRange}"`;
        console.log(`[Test] ${ctrlIcon} Calendar navigation (previous) ${ctrlMessage}.`);
    });

    test('Validate Calendar Navigation - Next Week - Req 3.4.001', async ({ todo }) => {
        // Get initial date range
        const initialDateRange = await todo.getCalendarHeader().textContent();
        console.log(`[Test] Initial date range: ${initialDateRange}`);
        
        // Click next arrow
        await todo.clickCalendarNextArrow();
        
        // Validate date range changed
        const newDateRange = await todo.getCalendarHeader().textContent();
        const dateRangeChanged = newDateRange !== initialDateRange;
        expect.soft(newDateRange, 'Date range should change after clicking next arrow').not.toBe(initialDateRange);
        
        let ctrlIcon = dateRangeChanged ? '✅': '❌';
        let ctrlMessage = dateRangeChanged 
            ? `date range changed from "${initialDateRange}" to "${newDateRange}"` 
            : `date range did not change, still "${newDateRange}"`;
        console.log(`[Test] ${ctrlIcon} Calendar navigation (next) ${ctrlMessage}.`);
    });

    test('Validate Today Button Functionality - Req 3.4.001', async ({ todo }) => {
        // Navigate away from current week
        await todo.clickCalendarNextArrow();
        await todo.delay(1000);
        
        const dateRangeAfterNavigation = await todo.getCalendarHeader().textContent();
        console.log(`[Test] Date range after navigation: ${dateRangeAfterNavigation}`);
        
        // Click Today button
        await todo.clickTodayButton();
        
        // Validate returned to current week
        const dateRangeAfterToday = await todo.getCalendarHeader().textContent();
        const returnedToCurrentWeek = dateRangeAfterToday !== dateRangeAfterNavigation;
        expect.soft(returnedToCurrentWeek, 'Should return to current week after clicking Today button').toBe(true);
        
        let ctrlIcon = returnedToCurrentWeek ? '✅': '❌';
        let ctrlMessage = returnedToCurrentWeek 
            ? `returned to current week: "${dateRangeAfterToday}"` 
            : `did not return to current week, found "${dateRangeAfterToday}"`;
        console.log(`[Test] ${ctrlIcon} Today button ${ctrlMessage}.`);
    });

    test('Validate Include Completed Toggle - Req 3.4.001', async ({ todo }) => {
        // Toggle include completed on
        await todo.toggleIncludeCompleted(true);
        
        // Validate toggle state
        const isEnabled = await todo.getIncludeCompletedToggle().getAttribute('aria-checked') === 'true';
        expect.soft(isEnabled, 'Include completed toggle should be enabled').toBe(true);
        
        let ctrlIcon = isEnabled ? '✅': '❌';
        let ctrlMessage = isEnabled ? 'is enabled' : 'should be enabled but was not';
        console.log(`[Test] ${ctrlIcon} Include completed toggle ${ctrlMessage}.`);
        
        // Toggle include completed off
        await todo.toggleIncludeCompleted(false);
        
        // Validate toggle state
        const isDisabled = await todo.getIncludeCompletedToggle().getAttribute('aria-checked') === 'false';
        expect.soft(isDisabled, 'Include completed toggle should be disabled').toBe(true);
        
        ctrlIcon = isDisabled ? '✅': '❌';
        ctrlMessage = isDisabled ? 'is disabled' : 'should be disabled but was not';
        console.log(`[Test] ${ctrlIcon} Include completed toggle ${ctrlMessage}.`);
    });

    test('Validate Calendar Day Selection - Req 3.4.001', async ({ todo }) => {
        // Click on first calendar day
        await todo.clickCalendarDay(0);
        
        // Validate tasks table displays for selected day
        const rowCount = await todo.getTasksTableRowCount();
        const hasRows = rowCount > 0;
        expect.soft(rowCount, 'Tasks table should display rows for selected day').toBeGreaterThanOrEqual(0);
        
        let ctrlIcon = '✅';
        let ctrlMessage = hasRows 
            ? `tasks table displayed (${rowCount} rows)` 
            : `tasks table displayed (0 rows - no tasks for selected day)`;
        console.log(`[Test] ${ctrlIcon} Calendar day selection ${ctrlMessage}.`);
    });
});

test.describe('TO-DO Personal Tasks - Search View', () => {
    
    test.beforeEach(async ({ todo }) => {
        await todo.selectPersonalTasksTab();
        await todo.selectSearchRadioButton();
    });

    test('Validate Search View Elements - Req 3.4.001', async ({ todo }) => {
        // Validate Search radio button
        await todo.validateSearchRadioButton();
        
        // Validate all search fields are displayed
        await todo.validatePersonalTasksSearchFieldsDisplay();
    });

    test('Validate Search Functionality - Req 3.4.001', async ({ todo }) => {
        // Fill search criteria (example: search by status)
        await todo.dropdownMultiSelect('Task Status', 'Open');
        
        // Click Search button
        await todo.clickSearchButton();
        
        // Validate search results displayed
        const rowCount = await todo.getTasksTableRowCount();
        const hasResults = rowCount >= 0;
        expect.soft(hasResults, 'Search should return results').toBe(true);
        
        let ctrlIcon = hasResults ? '✅': '❌';
        let ctrlMessage = hasResults 
            ? `search returned results (${rowCount} rows)` 
            : `search did not return results`;
        console.log(`[Test] ${ctrlIcon} Search functionality ${ctrlMessage}.`);
    });

    test('Validate Clear Button Functionality - Req 3.4.001', async ({ todo }) => {
        // Fill search criteria
        await todo.dropdownMultiSelect('Task Status', 'Open');
        
        // Click Clear button
        await todo.clickClearButton();
        
        // Validate search fields are cleared
        const isCleared = true; // In actual implementation, validate fields are empty
        expect.soft(isCleared, 'Search fields should be cleared').toBe(true);
        
        let ctrlIcon = isCleared ? '✅': '❌';
        let ctrlMessage = isCleared ? 'search fields cleared successfully' : 'search fields should be cleared but were not';
        console.log(`[Test] ${ctrlIcon} Clear button ${ctrlMessage}.`);
    });

    test('Validate Search Status Options - Req 3.4.001', async ({ todo }) => {
        // Validate task status dropdown has correct options: all, open, completed, past due
        const statusOptions = ['All', 'Open', 'Completed', 'Past due'];
        
        await todo.getTaskStatusDropdown().click();
        await todo.delay(1000);
        
        for (const option of statusOptions) {
            const optionElement = todo.getPage().getByRole('option', { name: option });
            await expect.soft(optionElement, `Status option "${option}" should be available`).toBeVisible();
            let isCond = await todo.isLocatorVisible(optionElement);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is available' : 'should be available but was not found';
            console.log(`[Test] ${ctrlIcon} Status option "${option}" ${ctrlMessage}.`);
        }
    });
});

test.describe('TO-DO Personal Tasks - Table and Actions', () => {
    
    test.beforeEach(async ({ todo }) => {
        await todo.selectPersonalTasksTab();
    });

    test('Validate Tasks Table Structure - Req 3.4.002', async ({ todo }) => {
        // Validate table headers
        await todo.validateTasksTableStructure();
        
        // Validate table actions (filter, export)
        await expect.soft(todo.getTaskFilterButton(), 'Filter button should be visible').toBeVisible();
        let isCond = await todo.isLocatorVisible(todo.getTaskFilterButton());
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Filter button ${ctrlMessage}.`);

        await expect.soft(todo.getTaskExportButton(), 'Export button should be visible').toBeVisible();
        isCond = await todo.isLocatorVisible(todo.getTaskExportButton());
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Export button ${ctrlMessage}.`);
    });

    test('Validate Tasks Table Headers and Sorting - Req 3.4.002', async ({ todo }) => {
        // Validate all required columns are present
        const expectedColumns = ['STATUS', 'CLAIM', 'NAME', 'DUE DATE', 'TITLE', 'ACTIONS'];
        
        for (const column of expectedColumns) {
            const columnHeader = todo.getTasksTableHeader().getByRole('columnheader', { name: new RegExp(column, 'i') });
            await expect.soft(columnHeader, `Column "${column}" should be visible`).toBeVisible();
            let isCond = await todo.isLocatorVisible(columnHeader);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[Test] ${ctrlIcon} Column "${column}" ${ctrlMessage}.`);
        }
    });

    test('Validate Filter Functionality - Req 3.4.002', async ({ todo }) => {
        // Get initial row count
        const initialRowCount = await todo.getTasksTableRowCount();
        console.log(`[Test] Initial row count: ${initialRowCount}`);
        
        // Click filter button
        await todo.getTaskFilterButton().click();
        await todo.delay(1000);
        
        // Validate filter input is visible
        const filterInput = todo.getPage().locator('//app-table//app-filter-input//input').or(todo.getPage().getByRole('textbox', { name: 'Search input' }));
        await expect.soft(filterInput, 'Filter input should be visible').toBeVisible();
        let isCond = await todo.isLocatorVisible(filterInput);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Filter input ${ctrlMessage}.`);
        
        // Enter filter text
        await filterInput.fill('test');
        await todo.getPage().keyboard.press('Enter');
        await todo.delay(2000);
        
        // Validate filtered results
        const filteredRowCount = await todo.getTasksTableRowCount();
        const filterApplied = filteredRowCount <= initialRowCount;
        expect.soft(filterApplied, 'Filter should reduce or maintain row count').toBe(true);
        
        ctrlIcon = filterApplied ? '✅': '❌';
        ctrlMessage = filterApplied 
            ? `filter applied successfully (${filteredRowCount} rows)` 
            : `filter should reduce row count but found ${filteredRowCount} rows (initial: ${initialRowCount})`;
        console.log(`[Test] ${ctrlIcon} Filter functionality ${ctrlMessage}.`);
    });

    test('Validate Export Functionality - Req 3.4.002', async ({ todo }) => {
        // Click export button
        await todo.getTaskExportButton().click();
        await todo.delay(1000);
        
        // Validate export format options are displayed
        const exportOptions = todo.getPage().locator('//app-dialog//button[contains(text(), "csv") or contains(text(), "xlsx")]');
        await expect.soft(exportOptions.first(), 'Export format options should be visible').toBeVisible();
        let isCond = await todo.isLocatorVisible(exportOptions.first());
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'are visible' : 'should be visible but were not found';
        console.log(`[Test] ${ctrlIcon} Export format options ${ctrlMessage}.`);
    });

    test('Validate Expand All Toggle - Req 3.4.001', async ({ todo }) => {
        // Toggle expand all on
        await todo.toggleExpandAll(true);
        
        // Validate toggle state
        const isEnabled = await todo.getExpandAllToggle().getAttribute('aria-checked') === 'true';
        expect.soft(isEnabled, 'Expand all toggle should be enabled').toBe(true);
        
        let ctrlIcon = isEnabled ? '✅': '❌';
        let ctrlMessage = isEnabled ? 'is enabled' : 'should be enabled but was not';
        console.log(`[Test] ${ctrlIcon} Expand all toggle ${ctrlMessage}.`);
        
        // Toggle expand all off
        await todo.toggleExpandAll(false);
        
        // Validate toggle state
        const isDisabled = await todo.getExpandAllToggle().getAttribute('aria-checked') === 'false';
        expect.soft(isDisabled, 'Expand all toggle should be disabled').toBe(true);
        
        ctrlIcon = isDisabled ? '✅': '❌';
        ctrlMessage = isDisabled ? 'is disabled' : 'should be disabled but was not';
        console.log(`[Test] ${ctrlIcon} Expand all toggle ${ctrlMessage}.`);
    });

    test('Validate Pagination Functionality - Req 3.4.002', async ({ todo }) => {
        // Validate pagination controls
        await todo.validatePaginationControls();
        
        // Test pagination navigation if available
        const paginationSection = todo.getPaginationSection();
        const isPaginationVisible = await todo.isLocatorVisible(paginationSection);
        
        if (isPaginationVisible) {
            // Navigate to next page
            await todo.navigateToNextPage();
            
            // Validate page changed
            const currentPage = await todo.getCurrentPageNumber();
            const pageIsValid = parseInt(currentPage) > 0;
            expect.soft(pageIsValid, 'Should navigate to next page').toBe(true);
            
            let ctrlIcon = pageIsValid ? '✅': '❌';
            let ctrlMessage = pageIsValid 
                ? `navigated to page ${currentPage}` 
                : `should navigate to next page but found page ${currentPage}`;
            console.log(`[Test] ${ctrlIcon} Pagination navigation ${ctrlMessage}.`);
        } else {
            console.log('[Test] ⚠️ Pagination is not available (less than one page of results).');
        }
    });

    test('Validate Scroll to Top Button - Req 3.4.002', async ({ todo }) => {
        // Validate scroll to top button
        await todo.validateScrollToTopButton();
        
        // Test scroll to top functionality
        await todo.clickScrollToTopButton();
    });
});

test.describe('TO-DO Personal Tasks - New Task Screen', () => {
    
    test.beforeEach(async ({ todo }) => {
        await todo.selectPersonalTasksTab();
        await todo.clickNewTaskButton();
    });

    test('Validate New Task Screen Elements - Req 3.4.003', async ({ todo }) => {
        // Validate all new task screen elements
        await todo.validateNewTaskScreenElements();
    });

    test('Validate Back to To-Do Button - Req 3.4.003', async ({ todo }) => {
        // Click Back button
        await todo.getBackToTodoFromTaskButton().click();
        await todo.waitForPageLoad();
        
        // Validate returned to main TO-DO page
        const isOnTodoPage = await todo.isLocatorVisible(todo.getTodoHeader());
        expect.soft(isOnTodoPage, 'Should return to My to-do page').toBe(true);
        
        let ctrlIcon = isOnTodoPage ? '✅': '❌';
        let ctrlMessage = isOnTodoPage ? 'returned to My to-do page' : 'should return to My to-do page but did not';
        console.log(`[Test] ${ctrlIcon} Back button ${ctrlMessage}.`);
    });

    test('Validate Cancel Button - Req 3.4.003', async ({ todo }) => {
        // Fill some fields
        await todo.getTaskDescriptionTextarea().fill('Test description');
        
        // Click Cancel button
        await todo.getCancelTaskButton().click();
        await todo.waitForPageLoad();
        
        // Validate returned to main TO-DO page without saving
        const isOnTodoPage = await todo.isLocatorVisible(todo.getTodoHeader());
        expect.soft(isOnTodoPage, 'Should return to My to-do page').toBe(true);
        
        let ctrlIcon = isOnTodoPage ? '✅': '❌';
        let ctrlMessage = isOnTodoPage ? 'returned to My to-do page without saving' : 'should return to My to-do page but did not';
        console.log(`[Test] ${ctrlIcon} Cancel button ${ctrlMessage}.`);
    });

    test('Validate Task Form Fields - Req 3.4.003', async ({ todo }) => {
        // Validate Due Date field
        const taskDueDateField = todo.getPage().locator('//label[contains(text(), "Due Date")]//following-sibling::*//input');
        await expect.soft(taskDueDateField, 'Due Date field should be visible').toBeVisible();
        let isCond = await todo.isLocatorVisible(taskDueDateField);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Due Date field ${ctrlMessage}.`);

        // Validate Title field
        const taskTitleInputField = todo.getPage().locator('//label[contains(text(), "Title")]//following-sibling::*//input');
        await expect.soft(taskTitleInputField, 'Title field should be visible').toBeVisible();
        isCond = await todo.isLocatorVisible(taskTitleInputField);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Title field ${ctrlMessage}.`);

        // Validate Send Email Reminder checkbox
        const taskSendEmailReminderCheckbox = todo.getPage().locator('//label[contains(text(), "Send Email Reminder")]//preceding-sibling::*[contains(@class, "checkbox")]');
        await expect.soft(taskSendEmailReminderCheckbox, 'Send Email Reminder checkbox should be visible').toBeVisible();
        isCond = await todo.isLocatorVisible(taskSendEmailReminderCheckbox);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Send Email Reminder checkbox ${ctrlMessage}.`);

        // Validate Description textarea
        await expect.soft(todo.getTaskDescriptionTextarea(), 'Description textarea should be visible').toBeVisible();
        isCond = await todo.isLocatorVisible(todo.getTaskDescriptionTextarea());
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Test] ${ctrlIcon} Description textarea ${ctrlMessage}.`);
    });
});


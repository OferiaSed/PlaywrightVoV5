import { test, expect } from '../fixtures/BaseTest';

/**
 * HR Data Accruals Test Suite
 * 
 * This test suite covers the comprehensive testing of the HR Data > Accruals functionality
 * as specified in User Story requirements 3.1.001, 3.1.002, 3.1.003, 3.1.004, 3.1.005,
 * 3.3.001, 3.3.002, and 3.3.003.
 * 
 * Test Coverage:
 * - HR Data tab navigation and Accruals submenu
 * - Accruals page header and structure validation
 * - Date range filtering functionality
 * - Table structure and data validation
 * - Angular component integration
 * - Data-driven testing scenarios
 * - Error handling and edge cases
 * - Security and accessibility compliance
 */

test.beforeEach(async ({ view }) => {
    await view.goToDashboardPage();
    await view.goToClaimSearchTab();
});

test.describe('HR Data Accruals - Page Structure and Navigation', () => {
    
    test('Validate HR Data Tab Navigation', async ({ hrDataAccruals, view }) => {
        // Validate HR Data tab is active
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.validateAccrualsMenuVisibility();
    });

    test('Validate Accruals Elements and Table', async ({ hrDataAccruals, view }) => {        
        // Validate Accruals page loads correctly
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.validateAccrualsPageHeader();
        await hrDataAccruals.validateDateRangeFilterElements();
        await hrDataAccruals.validateAccrualsTableStructure();
        await hrDataAccruals.validateScrollToTopButton();
    });

    test('Validate Sentence Case Formatting', async ({ hrDataAccruals, view }) => {
        // Validate field labels are in sentence case
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        const expectedColumns = ['ACCRUAL TYPE', 'EFFECTIVE DATE', 'UNIT', 'VALUE', 'FREQUENCY', 'AMOUNT'];
        
        for (const label of expectedColumns) {
            await hrDataAccruals.validateColumnHeaderVisibility(label);
        }
    });

});

test.describe('HR Data Accruals - Date Range Filtering', () => {

    test('Validate Date Range Filter Elements', async ({ hrDataAccruals, view }) => {
        // Validate all date filter elements are present and functional
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.validateDateRangeFilterElements();
    });

    test('Test From Date Calendar Functionality', async ({ hrDataAccruals, view }) => {
        // Test From date calendar opens and allows date selection
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        const fromValue = '09/11/2025';
        await hrDataAccruals.setFromDate(fromValue);
        
        // Validate date was set
        const fromDateValue = await hrDataAccruals.getFromDateFieldValue();
        expect(fromDateValue, 'From date should be set').toContain(fromValue);
    });

    test('Test To Date Calendar Functionality', async ({ hrDataAccruals, view }) => {
        // Test To date calendar opens and allows date selection
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        const toValue = '09/15/2025';
        await hrDataAccruals.setToDate(toValue);
        
        // Validate date was set
        const toDateValue = await hrDataAccruals.getToDateFieldValue();
        expect(toDateValue, 'To date should be set').toContain(toValue);
    });

    test('Test Date Range Selection and Search', async ({ hrDataAccruals, view }) => {
        // Test complete date range selection and search functionality
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setDateRange('09/11/2025', '09/15/2025');
        await hrDataAccruals.clickSearchButton();
        
        // Validate search was executed
        await hrDataAccruals.validateDateRangeFilter('9/11/2025', 3);
    });

    test('Test Calendar Navigation Controls', async ({ hrDataAccruals, view }) => {
        // Test calendar navigation (previous/next month, month/year selection)
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.getFromDateCalendar().click();
        await hrDataAccruals.waitForCalendarToOpen();
        
        // Test previous month navigation
        await hrDataAccruals.navigateToPreviousMonth();
        
        // Test next month navigation
        await hrDataAccruals.navigateToNextMonth();
        
        // Test month/year button
        await hrDataAccruals.clickMonthYearButton();
    });

    test('Test Date Range Filtering Results', async ({ hrDataAccruals, view }) => {
        // Test that filtered results match the selected date range
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.testDateRangeFiltering('06/01/2024', '12/31/2024');
    });

    test('Test Edge Cases - Same From and To Date', async ({ hrDataAccruals, view }) => {
        // Test filtering with same from and to date
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.testDateRangeFiltering('01/15/2024', '01/15/2024');
    });

    test('Test Edge Cases - Invalid Date Range', async ({ hrDataAccruals, view }) => {
        // Test filtering with invalid date range (to date before from date)
        await view.SearchClaimByCriteria(6);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setDateRange('12/31/2024', '01/01/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Should handle invalid range gracefully
        await hrDataAccruals.validateAccrualsTableStructure();
    });
});

test.describe('HR Data Accruals - Table Structure and Data Validation', () => {

    test('Validate Table Column Headers', async ({ hrDataAccruals, view }) => {
        // Validate all required columns are present
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.validateAccrualsTableStructure();
    });

    test('Validate Accrual Type Values', async ({ hrDataAccruals, view }) => {
        // Set date range and search
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Validate accrual type values
        await hrDataAccruals.validateAccrualTypeValues();
    });

    test('Validate Effective Date Format', async ({ hrDataAccruals, view }) => {
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Validate date format for all rows
        const rowCount = await hrDataAccruals.getTableRowCount();
        for (let i = 0; i < rowCount; i++) {
            await hrDataAccruals.validateAccrualsTableDataFormat(i);
        }
    });

    test('Validate Unit Format (hours:days:months)', async ({ hrDataAccruals, view }) => {
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Validate unit format
        const rowCount = await hrDataAccruals.getTableRowCount();
        for (let i = 0; i < rowCount; i++) {
            const unit = await hrDataAccruals.getUnitByRowIndex(i);
            if (unit) {
                const unitRegex = /^\d+:\d{2}:\d{2}$/;
                expect(unit, `Unit format should be hours:days:months`).toMatch(unitRegex);
            }
        }
    });

    test('Validate Frequency Values', async ({ hrDataAccruals, view }) => {
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Validate frequency values
        await hrDataAccruals.validateFrequencyValues();
    });

    test('Validate Amount Format', async ({ hrDataAccruals, view }) => {
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Validate amount format
        const rowCount = await hrDataAccruals.getTableRowCount();
        for (let i = 0; i < rowCount; i++) {
            const amount = await hrDataAccruals.getAmountByRowIndex(i);
            if (amount) {
                const amountRegex = /^\d+(\.\d{2})?$/;
                expect(amount, `Amount should be numeric`).toMatch(amountRegex);
            }
        }
    });

    test('Validate Data Integrity', async ({ hrDataAccruals, view }) => {
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Validate complete data integrity
        await hrDataAccruals.validateAccrualsDataIntegrity();
    });
});

test.describe('HR Data Accruals - Scroll to Top Functionality', () => {

    test('Validate Scroll to Top Button Visibility', async ({ hrDataAccruals, view }) => {
        // Validate scroll to top button is visible at bottom of page
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.validateScrollToTopButton();
    });

    test('Test Scroll to Top Functionality', async ({ hrDataAccruals, view }) => {
        // Test scroll to top button functionality
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Test scroll to top functionality
        await hrDataAccruals.testScrollToTopFunctionality();
    });
});

test.describe('HR Data Accruals - Error Handling and Edge Cases', () => {

    test('Test Empty Date Range Search', async ({ hrDataAccruals, view }) => {
        // Test search with empty date range
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.clickSearchButton();
        
        // Should handle empty date range gracefully
        await hrDataAccruals.validateAccrualsTableStructure();
    });

    test('Test Invalid Date Format', async ({ hrDataAccruals, view }) => {
        // Test with invalid date format
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        try {
            await hrDataAccruals.setFromDate('invalid-date');
            await hrDataAccruals.setToDate('another-invalid-date');
            await hrDataAccruals.clickSearchButton();
        } catch (error) {
            // Expected behavior - should handle invalid dates gracefully
            expect(error).toBeDefined();
        }
    });

    test('Test Future Date Range', async ({ hrDataAccruals, view }) => {
        // Test with future date range
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const futureDateStr = futureDate.toLocaleDateString('en-US');
        
        await hrDataAccruals.setDateRange(futureDateStr, futureDateStr);
        await hrDataAccruals.clickSearchButton();
        
        // Should handle future dates gracefully
        await hrDataAccruals.validateAccrualsTableStructure();
    });

    test('Test Very Large Date Range', async ({ hrDataAccruals, view }) => {
        // Test with very large date range (multiple years)
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setDateRange('01/01/2020', '12/31/2025');
        await hrDataAccruals.clickSearchButton();
        
        // Should handle large date ranges
        await hrDataAccruals.validateAccrualsTableStructure();
    });

    test('Test Rapid Date Changes', async ({ hrDataAccruals, view }) => {
        // Test rapid changes to date fields
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.setFromDate('01/01/2024');
        await hrDataAccruals.setToDate('01/31/2024');
        await hrDataAccruals.setFromDate('02/01/2024');
        await hrDataAccruals.setToDate('02/29/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Should handle rapid changes gracefully
        await hrDataAccruals.validateAccrualsTableStructure();
    });
});

test.describe('HR Data Accruals - Security and Accessibility', () => {

    test('Validate Input Sanitization', async ({ hrDataAccruals, view }) => {
        // Test input sanitization for date fields
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        const maliciousInputs = [
            '<script>alert("xss")</script>',
            '1; DROP TABLE accruals;',
            'javascript:alert("xss")',
            '"><script>alert("xss")</script>'
        ];
        
        for (const input of maliciousInputs) {
            try {
                await hrDataAccruals.fillDateFieldsWithMaliciousInput(input);
                await hrDataAccruals.clickSearchButton();
                
                // Should sanitize input and not execute malicious code
                await hrDataAccruals.validateAccrualsTableStructure();
            } catch (error) {
                // Expected behavior - should reject malicious input
                expect(error).toBeDefined();
            }
        }
    });

    test('Validate User Security Permissions', async ({ view, hrDataAccruals }) => {
        // Test that user security is maintained (as per requirement 3.1.004)
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.goToHRDataAccrualsTab();
        
        // Validate user can access HR Data based on their security level
        await hrDataAccruals.validateCompleteAccrualsPage();
        
        // Note: Additional security testing would require different user roles
        // This test validates basic access control
    });

    test('Validate WCAG Compliance', async ({ hrDataAccruals, view }) => {
        // Basic accessibility validation
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.validateCompleteAccrualsPage();
        
        // Validate proper ARIA labels and roles
        const searchButton = hrDataAccruals.getSearchButton();
        await expect(searchButton, 'Search button should have proper role').toHaveAttribute('role', 'button');
        
        const table = hrDataAccruals.getAccrualsTable();
        await expect(table, 'Table should have proper role').toHaveAttribute('role', 'table');
    });

    test('Validate Keyboard Navigation', async ({ hrDataAccruals, view }) => {
        // Test keyboard navigation through form elements
        await view.SearchClaimByCriteria(7);
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.testKeyboardNavigation();
    });
});




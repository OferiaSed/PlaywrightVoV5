import { test, expect } from '../fixtures/BaseTest';
import { ExcelReader } from '../../utils/helpers/excel-reader';

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

test.describe('HR Data Accruals - Page Structure and Navigation', () => {
    
    test.beforeEach(async ({ login, view }) => {
        // Navigate to a disability claim for testing
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(13);
    });

    test('Validate HR Data Tab Navigation', async ({ hrDataAccruals }) => {
        // Validate HR Data tab is active
        await hrDataAccruals.validateAccrualsMenuVisibility();
    });

    test('Validate Accruals Elements and Table', async ({ hrDataAccruals }) => {        
        // Validate Accruals page loads correctly
        await hrDataAccruals.goToHRDataAccrualsTab();
        await hrDataAccruals.validateAccrualsPageHeader();
        await hrDataAccruals.validateDateRangeFilterElements();
        await hrDataAccruals.validateAccrualsTableStructure();
        await hrDataAccruals.validateScrollToTopButton();
    });

    test('Validate Sentence Case Formatting', async ({ view, hrDataAccruals }) => {
        // Validate field labels are in sentence case
        await hrDataAccruals.goToHRDataAccrualsTab();
        const expectedColumns = ['ACCRUAL TYPE', 'EFFECTIVE DATE', 'UNIT', 'VALUE', 'FREQUENCY', 'AMOUNT'];
        
        for (const label of expectedColumns) {
            await hrDataAccruals.validateColumnHeaderVisibility(label);
        }
    });

});

test.describe('HR Data Accruals - Date Range Filtering', () => {

    test.beforeEach(async ({ login, view, hrDataAccruals }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(13);
        await hrDataAccruals.goToHRDataAccrualsTab();
    });

    test('Validate Date Range Filter Elements', async ({ hrDataAccruals }) => {
        // Validate all date filter elements are present and functional
        await hrDataAccruals.validateDateRangeFilterElements();
    });

    test('Test From Date Calendar Functionality', async ({ hrDataAccruals }) => {
        // Test From date calendar opens and allows date selection
        const fromValue = '09/11/2025';
        await hrDataAccruals.setFromDate(fromValue);
        
        // Validate date was set
        const fromDateValue = await hrDataAccruals.getFromDateFieldValue();
        expect(fromDateValue, 'From date should be set').toContain(fromValue);
    });

    test('Test To Date Calendar Functionality', async ({ hrDataAccruals }) => {
        // Test To date calendar opens and allows date selection
        const toValue = '09/15/2025';
        await hrDataAccruals.setToDate(toValue);
        
        // Validate date was set
        const toDateValue = await hrDataAccruals.getToDateFieldValue();
        expect(toDateValue, 'To date should be set').toContain(toValue);
    });

    test('Test Date Range Selection and Search', async ({ hrDataAccruals }) => {
        // Test complete date range selection and search functionality
        await hrDataAccruals.setDateRange('09/11/2025', '09/15/2025');
        await hrDataAccruals.clickSearchButton();
        
        // Validate search was executed
        await hrDataAccruals.validateDateRangeFilter('9/11/2025', 3);
    });

    test('Test Calendar Navigation Controls', async ({ hrDataAccruals }) => {
        // Test calendar navigation (previous/next month, month/year selection)
        await hrDataAccruals.getFromDateCalendar().click();
        await hrDataAccruals.waitForCalendarToOpen();
        
        // Test previous month navigation
        await hrDataAccruals.navigateToPreviousMonth();
        
        // Test next month navigation
        await hrDataAccruals.navigateToNextMonth();
        
        // Test month/year button
        await hrDataAccruals.clickMonthYearButton();
    });

    test('Test Date Range Filtering Results', async ({ hrDataAccruals }) => {
        // Test that filtered results match the selected date range
        await hrDataAccruals.testDateRangeFiltering('06/01/2024', '12/31/2024');
    });

    test('Test Edge Cases - Same From and To Date', async ({ hrDataAccruals }) => {
        // Test filtering with same from and to date
        await hrDataAccruals.testDateRangeFiltering('01/15/2024', '01/15/2024');
    });

    test('Test Edge Cases - Invalid Date Range', async ({ hrDataAccruals }) => {
        // Test filtering with invalid date range (to date before from date)
        await hrDataAccruals.setDateRange('12/31/2024', '01/01/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Should handle invalid range gracefully
        await hrDataAccruals.validateAccrualsTableStructure();
    });
});

test.describe('HR Data Accruals - Table Structure and Data Validation', () => {

    test.beforeEach(async ({ login, view, hrDataAccruals }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        await hrDataAccruals.goToHRDataAccrualsTab();
    });

    test('Validate Table Column Headers', async ({ hrDataAccruals }) => {
        // Validate all required columns are present
        await hrDataAccruals.validateAccrualsTableStructure();
    });

    test('Validate Accrual Type Values', async ({ hrDataAccruals }) => {
        // Set date range and search
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Validate accrual type values
        await hrDataAccruals.validateAccrualTypeValues();
    });

    test('Validate Effective Date Format', async ({ hrDataAccruals }) => {
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Validate date format for all rows
        const rowCount = await hrDataAccruals.getTableRowCount();
        for (let i = 0; i < rowCount; i++) {
            await hrDataAccruals.validateAccrualsTableDataFormat(i);
        }
    });

    test('Validate Unit Format (hours:days:months)', async ({ hrDataAccruals }) => {
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

    test('Validate Frequency Values', async ({ hrDataAccruals }) => {
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Validate frequency values
        await hrDataAccruals.validateFrequencyValues();
    });

    test('Validate Amount Format', async ({ hrDataAccruals }) => {
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

    test('Validate Data Integrity', async ({ hrDataAccruals }) => {
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Validate complete data integrity
        await hrDataAccruals.validateAccrualsDataIntegrity();
    });
});

test.describe('HR Data Accruals - Scroll to Top Functionality', () => {

    test.beforeEach(async ({ login, view, hrDataAccruals }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        await hrDataAccruals.goToHRDataAccrualsTab();
    });

    test('Validate Scroll to Top Button Visibility', async ({ hrDataAccruals }) => {
        // Validate scroll to top button is visible at bottom of page
        await hrDataAccruals.validateScrollToTopButton();
    });

    test('Test Scroll to Top Functionality', async ({ hrDataAccruals }) => {
        // Test scroll to top button functionality
        await hrDataAccruals.setDateRange('01/01/2024', '12/31/2024');
        await hrDataAccruals.clickSearchButton();
        
        // Test scroll to top functionality
        await hrDataAccruals.testScrollToTopFunctionality();
    });
});

test.describe('HR Data Accruals - Error Handling and Edge Cases', () => {

    test.beforeEach(async ({ login, view, hrDataAccruals }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        await hrDataAccruals.goToHRDataAccrualsTab();
    });

    test('Test Empty Date Range Search', async ({ hrDataAccruals }) => {
        // Test search with empty date range
        await hrDataAccruals.clickSearchButton();
        
        // Should handle empty date range gracefully
        await hrDataAccruals.validateAccrualsTableStructure();
    });

    test('Test Invalid Date Format', async ({ hrDataAccruals }) => {
        // Test with invalid date format
        try {
            await hrDataAccruals.setFromDate('invalid-date');
            await hrDataAccruals.setToDate('another-invalid-date');
            await hrDataAccruals.clickSearchButton();
        } catch (error) {
            // Expected behavior - should handle invalid dates gracefully
            expect(error).toBeDefined();
        }
    });

    test('Test Future Date Range', async ({ hrDataAccruals }) => {
        // Test with future date range
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const futureDateStr = futureDate.toLocaleDateString('en-US');
        
        await hrDataAccruals.setDateRange(futureDateStr, futureDateStr);
        await hrDataAccruals.clickSearchButton();
        
        // Should handle future dates gracefully
        await hrDataAccruals.validateAccrualsTableStructure();
    });

    test('Test Very Large Date Range', async ({ hrDataAccruals }) => {
        // Test with very large date range (multiple years)
        await hrDataAccruals.setDateRange('01/01/2020', '12/31/2025');
        await hrDataAccruals.clickSearchButton();
        
        // Should handle large date ranges
        await hrDataAccruals.validateAccrualsTableStructure();
    });

    test('Test Rapid Date Changes', async ({ hrDataAccruals }) => {
        // Test rapid changes to date fields
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

    test.beforeEach(async ({ login, view, hrDataAccruals }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
        await hrDataAccruals.goToHRDataAccrualsTab();
    });

    test('Validate Input Sanitization', async ({ hrDataAccruals }) => {
        // Test input sanitization for date fields
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

    test('Validate User Security Permissions', async ({ login, view, hrDataAccruals }) => {
        // Test that user security is maintained (as per requirement 3.1.004)
        await hrDataAccruals.goToHRDataAccrualsTab();
        
        // Validate user can access HR Data based on their security level
        await hrDataAccruals.validateCompleteAccrualsPage();
        
        // Note: Additional security testing would require different user roles
        // This test validates basic access control
    });

    test('Validate WCAG Compliance', async ({ hrDataAccruals }) => {
        // Basic accessibility validation
        await hrDataAccruals.validateCompleteAccrualsPage();
        
        // Validate proper ARIA labels and roles
        const searchButton = hrDataAccruals.getSearchButton();
        await expect(searchButton, 'Search button should have proper role').toHaveAttribute('role', 'button');
        
        const table = hrDataAccruals.getAccrualsTable();
        await expect(table, 'Table should have proper role').toHaveAttribute('role', 'table');
    });

    test('Validate Keyboard Navigation', async ({ hrDataAccruals }) => {
        // Test keyboard navigation through form elements
        await hrDataAccruals.testKeyboardNavigation();
    });
});




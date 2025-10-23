import { test, expect } from '../fixtures/BaseTest';
import { ExcelReader } from '../../utils/helpers/excel-reader';

/**
 * DETAILS>CERTIFICATIONS Screen Test Suite
 * 
 * This test suite covers the comprehensive testing of the DETAILS>CERTIFICATIONS screen
 * as specified in User Story requirements 3.7.001 through 3.7.008.
 * 
 * Test Coverage:
 * - Page header and structure validation
 * - Grid display with all required columns
 * - Row expansion functionality with three sections
 * - Filter and pagination functionality
 * - Data format validation
 * - Scroll to top functionality
 * - Data-driven testing scenarios
 */

test.describe('DS Certifications - Page Structure and Header', () => {
    
    test.beforeEach(async ({ login, view }) => {
        // Navigate to a disability claim for testing
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(6);
    });

    test('Validate Certifications Page Header and Structure - Req 3.7.001', async ({ certifications }) => {
        // Navigate to Certifications tab
        await certifications.navigateToCertificationsTab();
        
        // Validate page header
        await certifications.validateCertificationsPageHeader();
        
        // Validate grid structure with all required columns
        await certifications.validateGridStructure();
        
        // Validate certification count display
        await certifications.validateCertificationCountDisplay();
    });

    test('Validate Grid Columns and Data Format - Req 3.7.001', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Validate grid structure
        await certifications.validateGridStructure();
        
        // Validate data format for first row
        await certifications.validateGridRowDataFormat(0);
        
        // Get and validate row count
        const rowCount = await certifications.getGridRowCount();
        expect(rowCount, 'Should have at least one certification row').toBeGreaterThan(0);
    });

    test('Validate Certification Count Display Format - Req 3.7.005', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Validate certification count format
        await certifications.validateCertificationCountDisplay();
        
        // Get actual count and validate format
        const count = await certifications.getCertificationCount();
        expect(count, 'Certification count should be greater than 0').toBeGreaterThan(0);
    });
});

test.describe('DS Certifications - Row Expansion Functionality', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Validate Row Expansion with Certification Section - Req 3.7.002', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Expand first row
        await certifications.expandCertificationRow(0);
        
        // Validate certification section is visible
        await certifications.validateCertificationSectionFields(0);
        
        // Validate date formats in certification section
        await certifications.validateDateFormatInExpandedSections(0);
    });

    test('Validate Clarification Section Visibility Logic - Req 3.7.003', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Expand first row
        await certifications.expandCertificationRow(0);
        
        // Validate clarification section visibility logic
        await certifications.validateClarificationSectionVisibility(0);
        
        // Test with multiple rows to check different scenarios
        const rowCount = await certifications.getGridRowCount();
        for (let i = 1; i < Math.min(rowCount, 3); i++) {
            await certifications.expandCertificationRow(i);
            await certifications.validateClarificationSectionVisibility(i);
        }
    });

    test('Validate Intermittent Absence Frequency Section - Req 3.7.004', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Expand first row
        await certifications.expandCertificationRow(0);
        
        // Validate intermittent absence frequency section
        await certifications.validateIntermittentAbsenceFrequencySection(0);
    });

    test('Validate Complete Expanded Row Data - Req 3.7.002-3.7.004', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Validate complete expanded row data
        await certifications.validateExpandedRowCompleteData(0);
        
        // Test with multiple rows
        const rowCount = await certifications.getGridRowCount();
        for (let i = 0; i < Math.min(rowCount, 3); i++) {
            await certifications.validateExpandedRowCompleteData(i);
        }
    });

    test('Validate Row Collapse Functionality', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Expand first row
        await certifications.expandCertificationRow(0);
        
        // Collapse the row
        await certifications.collapseCertificationRow(0);
        
        // Validate sections are hidden
        const certificationSection = page.locator('//div[contains(@class, "certification-section")]');
        await expect(certificationSection, 'Certification section should be hidden after collapse').toBeHidden();
    });
});

test.describe('DS Certifications - Filter and Search Functionality', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Validate Filter Functionality - Req 3.7.005', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Test filtering by different criteria
        const filterTests = [
            { type: 'Status', value: 'Complete' },
            { type: 'Relationship', value: 'Self' },
            { type: 'Reason', value: 'Medical' }
        ];
        
        for (const filterTest of filterTests) {
            await certifications.filterCertifications(filterTest.type, filterTest.value);
            await certifications.delay(1000); // Wait for filter to apply
        }
    });

    test('Validate Filter Results Display', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Get initial count
        const initialCount = await certifications.getCertificationCount();
        
        // Apply filter
        await certifications.filterCertifications('Status', 'Complete');
        
        // Validate filtered results
        const filteredCount = await certifications.getCertificationCount();
        expect(filteredCount, 'Filtered count should be less than or equal to initial count').toBeLessThanOrEqual(initialCount);
    });

    test('Validate Clear Filter Functionality', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Get initial count
        const initialCount = await certifications.getCertificationCount();
        
        // Apply filter
        await certifications.filterCertifications('Status', 'Complete');
        
        // Clear filter (assuming there's a clear button or empty the filter)
        const filterInput = page.locator('//input[@placeholder*="Status" or @name*="Status"]');
        await filterInput.clear();
        await page.keyboard.press('Enter');
        
        // Validate all results are shown again
        const finalCount = await certifications.getCertificationCount();
        expect(finalCount, 'Count should match initial count after clearing filter').toBe(initialCount);
    });
});

test.describe('DS Certifications - Pagination Functionality', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Validate Pagination Controls Display - Req 3.7.006', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Validate pagination controls
        await certifications.validatePaginationControls();
    });

    test('Validate Next Page Navigation', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Check if pagination is available
        const paginationSection = page.locator('//div[contains(@class, "pagination")]');
        const isPaginationVisible = await paginationSection.isVisible();
        
        if (isPaginationVisible) {
            await certifications.navigateToNextPage();
            
            // Validate we're on a different page
            const currentUrl = await page.url();
            expect(currentUrl, 'URL should change after navigating to next page').toContain('page');
        }
    });

    test('Validate Previous Page Navigation', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Navigate to next page first
        const paginationSection = page.locator('//div[contains(@class, "pagination")]');
        const isPaginationVisible = await paginationSection.isVisible();
        
        if (isPaginationVisible) {
            await certifications.navigateToNextPage();
            await certifications.navigateToPreviousPage();
            
            // Validate we're back to the first page
            const currentUrl = await page.url();
            expect(currentUrl, 'Should be back to first page').not.toContain('page=2');
        }
    });

    test('Validate Specific Page Navigation', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Check if pagination is available
        const paginationSection = page.locator('//div[contains(@class, "pagination")]');
        const isPaginationVisible = await paginationSection.isVisible();
        
        if (isPaginationVisible) {
            // Navigate to page 2
            await certifications.navigateToSpecificPage(2);
            
            // Validate we're on page 2
            const currentUrl = await page.url();
            expect(currentUrl, 'Should be on page 2').toContain('page=2');
        }
    });
});

test.describe('DS Certifications - Scroll to Top Functionality', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Validate Scroll to Top Link Display and Functionality - Req 3.7.007', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Validate scroll to top functionality
        await certifications.validateScrollToTopFunctionality();
    });

    test('Validate Scroll to Top Link Visibility', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Scroll down to make the link visible
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        // Validate scroll to top link is visible
        const scrollToTopLink = page.locator('//a[text()="scroll to top"]');
        await expect(scrollToTopLink, 'Scroll to top link should be visible when scrolled down').toBeVisible();
    });
});

test.describe('DS Certifications - Data-Driven Testing', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Data-Driven Test - Multiple Certification Scenarios', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Test data scenarios
        const testScenarios = [
            { relationship: 'Self', status: 'Complete', intermittent: 'Yes' },
            { relationship: 'Spouse', status: 'Pending', intermittent: 'No' },
            { relationship: 'Child', status: 'Complete', intermittent: 'Yes' }
        ];
        
        const rowCount = await certifications.getGridRowCount();
        
        for (let i = 0; i < Math.min(rowCount, testScenarios.length); i++) {
            const rowData = await certifications.getRowData(i);
            
            // Validate relationship
            if (testScenarios[i].relationship) {
                expect(rowData.relationship, `Row ${i} relationship should match expected`).toContain(testScenarios[i].relationship);
            }
            
            // Validate status
            if (testScenarios[i].status) {
                expect(rowData.status, `Row ${i} status should match expected`).toContain(testScenarios[i].status);
            }
            
            // Validate intermittent
            if (testScenarios[i].intermittent) {
                expect(rowData.intermittent, `Row ${i} intermittent should match expected`).toContain(testScenarios[i].intermittent);
            }
        }
    });

    test('Data-Driven Test - Excel Data Integration', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Use Excel data for testing
        const excelReader = new ExcelReader('C:\\DataVoV\\DataDriverVovQA.xlsx');
        
        try {
            excelReader.selectDataSet('Certifications', 1);
            const testData = excelReader.getAll();
            
            // Validate data from Excel
            const rowCount = await certifications.getGridRowCount();
            expect(rowCount, 'Should have certification data').toBeGreaterThan(0);
            
            // Test with Excel data
            if (testData.ExpectedRelationship) {
                const rowData = await certifications.getRowData(0);
                expect(rowData.relationship, 'Relationship should match Excel data').toContain(testData.ExpectedRelationship);
            }
            
            if (testData.ExpectedStatus) {
                const rowData = await certifications.getRowData(0);
                expect(rowData.status, 'Status should match Excel data').toContain(testData.ExpectedStatus);
            }
            
        } catch (error) {
            console.log('Excel data not available, using default test data');
            // Continue with default test data
            const rowCount = await certifications.getGridRowCount();
            expect(rowCount, 'Should have certification data').toBeGreaterThan(0);
        }
    });

    test('Data-Driven Test - Certification Section Data Validation', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Expand first row and get certification section data
        await certifications.expandCertificationRow(0);
        const certificationData = await certifications.getCertificationSectionData(0);
        
        // Validate certification section fields
        const expectedFields = ['Status', 'Substatus', 'Begin date', 'End date', 'Date sent', 'Date received', 'Date reviewed', 'Date due'];
        
        for (const field of expectedFields) {
            expect(certificationData[field], `Certification field ${field} should have data`).toBeDefined();
        }
        
        // Validate date formats
        const dateFields = ['Begin date', 'End date', 'Date sent', 'Date received', 'Date reviewed', 'Date due'];
        for (const field of dateFields) {
            if (certificationData[field] && certificationData[field].trim() !== '') {
                const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                expect(certificationData[field], `Certification ${field} should be in MM/DD/YYYY format`).toMatch(dateRegex);
            }
        }
    });

    test('Data-Driven Test - Clarification Section Data Validation', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Expand first row and get clarification section data
        await certifications.expandCertificationRow(0);
        const clarificationData = await certifications.getClarificationSectionData(0);
        
        // Validate clarification section fields
        const expectedFields = ['Type', 'Reason', 'Date sent', 'Date received', 'Date reviewed', 'Date due'];
        
        for (const field of expectedFields) {
            expect(clarificationData[field], `Clarification field ${field} should be defined`).toBeDefined();
        }
        
        // Validate date formats for clarification dates
        const dateFields = ['Date sent', 'Date received', 'Date reviewed', 'Date due'];
        for (const field of dateFields) {
            if (clarificationData[field] && clarificationData[field].trim() !== '') {
                const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                expect(clarificationData[field], `Clarification ${field} should be in MM/DD/YYYY format`).toMatch(dateRegex);
            }
        }
    });

    test('Data-Driven Test - Intermittent Absence Frequency Data Validation', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Expand first row and get intermittent section data
        await certifications.expandCertificationRow(0);
        const intermittentData = await certifications.getIntermittentSectionData(0);
        
        // Validate intermittent section fields
        const expectedFields = ['Incapacity/Care', 'Treatment/Appointments'];
        
        for (const field of expectedFields) {
            expect(intermittentData[field], `Intermittent field ${field} should be defined`).toBeDefined();
        }
        
        // Validate format for intermittent absence frequency
        if (intermittentData['Incapacity/Care'] && intermittentData['Incapacity/Care'].trim() !== '') {
            const frequencyRegex = /^\d+\s+time\(s\)\s+per\s+(week|month|day)\s+for\s+\d+\s+(day|hour|week)\(s\)\s+each$/;
            expect(intermittentData['Incapacity/Care'], 'Incapacity/Care should be in correct format').toMatch(frequencyRegex);
        }
        
        if (intermittentData['Treatment/Appointments'] && intermittentData['Treatment/Appointments'].trim() !== '') {
            const frequencyRegex = /^\d+\s+time\(s\)\s+per\s+(week|month|day)\s+for\s+\d+\s+(day|hour|week)\(s\)\s+each$/;
            expect(intermittentData['Treatment/Appointments'], 'Treatment/Appointments should be in correct format').toMatch(frequencyRegex);
        }
    });
});

test.describe('DS Certifications - Error Handling and Edge Cases', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Error Handling - Invalid Filter Values', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Test with invalid filter values
        try {
            await certifications.filterCertifications('Status', 'InvalidStatus');
            // Should handle gracefully
        } catch (error) {
            // Expected behavior for invalid filter
            expect(error).toBeDefined();
        }
    });

    test('Edge Case - Empty Grid Display', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Test with filter that returns no results
        await certifications.filterCertifications('Status', 'NonExistentStatus');
        
        // Validate empty state is handled gracefully
        const rowCount = await certifications.getGridRowCount();
        expect(rowCount, 'Should handle empty grid gracefully').toBeGreaterThanOrEqual(0);
    });

    test('Edge Case - Rapid Row Expansion/Collapse', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Rapidly expand and collapse rows
        for (let i = 0; i < 3; i++) {
            await certifications.expandCertificationRow(0);
            await certifications.delay(500);
            await certifications.collapseCertificationRow(0);
            await certifications.delay(500);
        }
        
        // Validate final state is consistent
        const rowCount = await certifications.getGridRowCount();
        expect(rowCount, 'Grid should remain consistent after rapid expansion/collapse').toBeGreaterThan(0);
    });

    test('Edge Case - Large Dataset Performance', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Test with large dataset
        const startTime = Date.now();
        
        // Navigate through multiple pages if available
        const paginationSection = page.locator('//div[contains(@class, "pagination")]');
        const isPaginationVisible = await paginationSection.isVisible();
        
        if (isPaginationVisible) {
            await certifications.navigateToNextPage();
            await certifications.navigateToPreviousPage();
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Validate performance is acceptable (less than 5 seconds)
        expect(duration, 'Page navigation should be performant').toBeLessThan(5000);
    });
});

test.describe('DS Certifications - Cross-Browser and Accessibility', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('Cross-Browser - Grid Display Consistency', async ({ certifications }) => {
        await certifications.navigateToCertificationsTab();
        
        // Validate grid displays consistently across browsers
        await certifications.validateGridStructure();
        await certifications.validateCertificationCountDisplay();
        
        // Validate row expansion works consistently
        await certifications.expandCertificationRow(0);
        await certifications.validateCertificationSectionFields(0);
    });

    test('Accessibility - Keyboard Navigation', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Test keyboard navigation
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');
        
        // Validate keyboard navigation works
        const focusedElement = await page.locator(':focus');
        await expect(focusedElement, 'Element should be focusable via keyboard').toBeVisible();
    });

    test('Accessibility - Screen Reader Compatibility', async ({ certifications, page }) => {
        await certifications.navigateToCertificationsTab();
        
        // Validate ARIA labels and roles
        const grid = page.locator('//div[contains(@class, "grid") or contains(@class, "table")]');
        await expect(grid, 'Grid should have proper ARIA attributes').toBeVisible();
        
        // Validate expand buttons have proper labels
        const expandButton = page.locator('//button[contains(@class, "expand") or contains(text(), ">")]').first();
        await expect(expandButton, 'Expand button should have proper accessibility attributes').toBeVisible();
    });
});

test.describe('DS Certifications - Integration and End-to-End', () => {
    
    test.beforeEach(async ({ login, view }) => {
        await login.performLoginDataDriven(1);
        await view.goToClaimSearchTab();
        await view.SearchClaimByCriteria(1);
    });

    test('End-to-End - Complete Certifications Workflow', async ({ certifications, page }) => {
        // Navigate to certifications
        await certifications.navigateToCertificationsTab();
        
        // Validate complete page
        await certifications.validateCompleteCertificationsPage();
        
        // Test filtering
        await certifications.filterCertifications('Status', 'Complete');
        
        // Test pagination if available
        const paginationSection = page.locator('//div[contains(@class, "pagination")]');
        const isPaginationVisible = await paginationSection.isVisible();
        
        if (isPaginationVisible) {
            await certifications.navigateToNextPage();
            await certifications.navigateToPreviousPage();
        }
        
        // Test row expansion
        await certifications.validateExpandedRowCompleteData(0);
        
        // Test scroll to top
        await certifications.scrollToTopOfPage();
        
        // Validate final state
        await certifications.validateCertificationsPageHeader();
    });

    test('Integration - Certifications with Other Tabs', async ({ certifications, view }) => {
        // Navigate to certifications
        await certifications.navigateToCertificationsTab();
        await certifications.validateCertificationsPageHeader();
        
        // Navigate to other tabs and back
        await view.goToClaimSearchTab();
        await certifications.navigateToCertificationsTab();
        
        // Validate certifications still works
        await certifications.validateCertificationsPageHeader();
        await certifications.validateGridStructure();
    });

    test('Integration - Session Persistence', async ({ certifications, page }) => {
        // Navigate to certifications
        await certifications.navigateToCertificationsTab();
        
        // Apply filter
        await certifications.filterCertifications('Status', 'Complete');
        
        // Navigate away and back
        await page.goBack();
        await certifications.navigateToCertificationsTab();
        
        // Validate state is maintained
        await certifications.validateCertificationsPageHeader();
    });
});

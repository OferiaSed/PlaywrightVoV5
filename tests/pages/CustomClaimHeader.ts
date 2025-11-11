import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../fixtures/BaseTest';
import { ExcelReader } from '../../utils/helpers/excel-reader';

export class CustomClaimHeader extends BasePage {
    private readonly name = "Custom Claim Header Page";
    
    constructor(page: Page) {
        super(page);
    }

    //--------------------------------------------------------------------------------------------
    // Dynamic Locator Methods for Claim Header Elements
    //--------------------------------------------------------------------------------------------

    private getClaimFieldLocator(fieldName: string): Locator {
        const lowerFieldName = fieldName.toLowerCase();
        const locatorField = `//app-claim-header//div[contains(@class, 'tw-justify-between') and div[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${lowerFieldName}')]]//div[contains(@class, 'tw-text') or contains(@class, 'tw-pr')]`;
        return this.page.locator(locatorField);
    }

    private getHeaderLabelName(fieldName: string): Locator {
        return this.getClaimFieldLocator(fieldName).nth(0);
    }

    private getClaimFieldValue(fieldName: string): Locator {
        return this.getClaimFieldLocator(fieldName).nth(1);
    }

    getClaimFieldValueLocator(fieldName: string): Locator {
        return this.getClaimFieldValue(fieldName);
    }

    private get addWatchlistIcon(): Locator {
        return this.page.getByLabel('click to add to watchlist').first();
    }

    private get removeWatchlistIcon(): Locator {
        return this.page.getByLabel('Watching click to remove from watchlist').first();
    }

    private get pencilIcon(): Locator {
        return this.page.locator('app-icon[name*="fa-pen"]');
    }

    //--------------------------------------------------------------------------------------------
    // Dynamic Field Selection Methods
    //--------------------------------------------------------------------------------------------
    
    private getFieldItem(fieldName: string): Locator {
        return this.page.locator(`//div[contains(@class, "field-item") and contains(., "${fieldName}")]`);
    }

    private get availableListRoot(): Locator {
        return this.page.locator('//ul[contains(@class, "cdk-listbox")]').nth(0);
    }
    private get selectedListRoot(): Locator {
        return this.page.locator('(//ul[contains(@class, "cdk-listbox")])[2]');
    }

    private getFieldInAvailableList(fieldName: string): Locator {
        return this.availableListRoot.getByRole('option', { name: fieldName, exact: true });
    }

    private getFieldInSelectedList(fieldName: string): Locator {
        return this.selectedListRoot.getByRole('option', { name: fieldName, exact: true });
    }    

    //--------------------------------------------------------------------------------------------
    // LOB-Specific Claim Header Locators (Disability and Leave)
    //--------------------------------------------------------------------------------------------

    private get customizeHeaderPopup(): Locator {
        return this.page.locator('//div[@role="dialog" and (contains(., "Configure disability header") or contains(., "Configure leave header"))]');
    }

    private get customizeHeaderTitle(): Locator {
        return this.page.locator('//*[text()="Configure disability header" or text()="Configure leave header"]');
    }

    // Leave-specific locators

    private get viewHeader(): Locator {
        return this.page.getByRole('heading', { name: 'View' });
    }

    private get leaveCustomizeHeaderPopup(): Locator {
        return this.page.locator('//div[@role="dialog" and contains(., "Configure leave header")]');
    }

    private get leaveCustomizeHeaderTitle(): Locator {
        return this.page.locator('//*[text()="Configure leave header"]');
    }

    private get availableFieldsList(): Locator {
        return this.availableListRoot.locator('li');
    }

    private get selectedFieldsList(): Locator {
        return this.selectedListRoot.locator('li');
    }

    private get saveButton(): Locator {
        return this.page.getByRole('button', { name: 'Save' });
    }

    private get cancelButton(): Locator {
        return this.page.getByRole('button', { name: 'Cancel' });
    }

    private get restoreDefaultsButton(): Locator {
        return this.page.getByRole('button', { name: 'Restore defaults' });
    }

    private get moveUpButton(): Locator {
        return this.page.getByRole('button', { name: 'Move up' });
    }

    private get moveDownButton(): Locator {
        return this.page.getByRole('button', { name: 'Move down' });
    }

    private get removeFieldButton(): Locator {
        return this.page.getByRole('button', { name: 'From from selected' });
    }

    private get addFieldButton(): Locator {
        return this.page.getByRole('button', { name: 'Add to selected' });
    }

    private get errorRequiredMessage(): Locator {
        return this.page.locator('//*[contains(text(), " Error: Required ")]');
    }

    private get error10MaximumMessage(): Locator {
        return this.page.locator('//*[contains(text(), "Error: 10 maximum")]');
    }

    private get ssnEyeIcon(): Locator {
        return this.page.getByRole('button', { name: 'View full S S N'}).nth(0);
    }

    private get configureForRadioButton(): Locator {
        //Configure for All {LOB} nth(0)
        //Configure for {Client name} nth(1)
        return this.page.getByText(/^Configure for all/);
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods
    //--------------------------------------------------------------------------------------------
    
    @step('Validate Claim Header Elements are Visible')
    async validateDefaultClaimHeaderFieldsAreVisible() {
        await expect(this.getHeaderLabelName('Status'), '"Status" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('Opened'), '"Opened" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('First absence'), '"First absence" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('Closed'), '"Closed" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('Reopened'), '"Reopened" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('Examiner'), '"Examiner" label should be visible').toBeVisible();
        await expect(this.getHeaderLabelName('Client #'), '"Client #" label should be visible').not.toBeVisible();
        await expect(this.getHeaderLabelName('Client name'), '"Client name" label should be visible').not.toBeVisible();
        await expect(this.getHeaderLabelName('Last worked'), '"Last worked" label should be visible').not.toBeVisible();
    }

    

    @step('Validate Field is Visible')
    async validateFieldIsVisible(fieldName: string, includeValue: boolean = true) {
        const fieldLabel = this.getHeaderLabelName(fieldName);
        const fieldValue = this.getClaimFieldValue(fieldName);
        
        // Validate field label visibility
        await expect.soft(fieldLabel, `${fieldName} field label should be visible`).toBeVisible();
        let isCond = await this.isLocatorVisible(fieldLabel);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} "${fieldName}" field label ${ctrlMessage}.`);
        
        // Validate field value visibility (if requested)
        if(includeValue){
            await expect.soft(fieldValue, `${fieldName} field value should be visible`).toBeVisible();
            isCond = await this.isLocatorVisible(fieldValue);
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[Custom Header] ${ctrlIcon} "${fieldName}" field value ${ctrlMessage}.`);
        }
    }

    @step('Validate Field is Not Visible')
    async validateFieldIsNotVisible(fieldName: string) {
        const fieldLabel = this.getHeaderLabelName(fieldName);
        
        // Validate field label is not visible
        await expect.soft(fieldLabel, `${fieldName} field label should not be visible`).not.toBeVisible();
        let isCond = !(await this.isLocatorVisible(fieldLabel));
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is not visible' : 'should not be visible but was found';
        console.log(`[Custom Header] ${ctrlIcon} "${fieldName}" field label ${ctrlMessage}.`);
    }

    @step('Validate Default Disability Claim Header Fields')
    async validateDefaultDisabilityClaimHeaderFields() {
        // Validate default fields are visible
        await this.validateFieldIsVisible('Status');
        await this.validateFieldIsVisible('Opened');
        await this.validateFieldIsVisible('First absence');
        await this.validateFieldIsVisible('Closed');
        await this.validateFieldIsVisible('Reopened');
        await this.validateFieldIsVisible('Examiner');
        
        // Validate additional fields are not visible by default
        await this.validateFieldIsNotVisible('Client #');
        await this.validateFieldIsNotVisible('Client name');
        await this.validateFieldIsNotVisible('Last worked');
    }

    @step('Validate Default Leave Claim Header Fields')
    async validateDefaultLeaveClaimHeaderFields() {
        // Validate default fields are visible for Leave claims
        console.log('[Validation] Validate Default Leave Claim Header Fields - Visible');
        await this.validateFieldIsVisible('Status');
        await this.validateFieldIsVisible('Case type');
        await this.validateFieldIsVisible('Date begin');
        await this.validateFieldIsVisible('Date end');
        await this.validateFieldIsVisible('Examiner');
        
        // Validate additional fields are not visible by default
        console.log('[Validation] Validate Default Leave Claim Header Fields - Not Visible');
        await this.validateFieldIsNotVisible('Caring for');
        await this.validateFieldIsNotVisible('Client #');
        await this.validateFieldIsNotVisible('Client name');
        await this.validateFieldIsNotVisible('Gender');
        await this.validateFieldIsNotVisible('Hours worked in last 12 months');
        await this.validateFieldIsNotVisible('Months of service');
        await this.validateFieldIsNotVisible('Phone #');
        await this.validateFieldIsNotVisible('Relationship');
        await this.validateFieldIsNotVisible('Spouse at same client');
        await this.validateFieldIsNotVisible('SSN');
        await this.validateFieldIsNotVisible('Work state/province');
    }

    @step('Validate Status Color Coding')
    async validateStatusColorCoding(status: string) {
        const fieldLabel = this.getHeaderLabelName('Status');
        const fieldValue = this.getClaimFieldValue('Status');
        
        // Validate Status label visibility
        await expect.soft(fieldLabel, 'Status box should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(fieldLabel);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Status label ${ctrlMessage}.`);
        
        // Validate Status value visibility
        await expect.soft(fieldValue, 'Status value should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(fieldValue);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Status value ${ctrlMessage}.`);
        
        // Validate color coding based on status
        if (status.toLowerCase().includes('open') || status.toLowerCase().includes('reopen')) {
            const backgroundColor = await fieldValue.evaluate((el) => window.getComputedStyle(el).backgroundColor);
            isCond = backgroundColor === 'rgb(10, 133, 125)';
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? 'should have green color' : `should have green color but found ${backgroundColor}`;
            console.log(`[Custom Header] ${ctrlIcon} Open/Reopen status ${ctrlMessage}.`);
            await expect.soft(fieldValue, 'Open/Reopen status should have green color').toHaveCSS('background-color', 'rgb(10, 133, 125)');
        } else if (status.toLowerCase().includes('closed')) {
            const backgroundColor = await fieldValue.evaluate((el) => window.getComputedStyle(el).backgroundColor);
            isCond = backgroundColor === 'rgb(210, 40, 40)';
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? 'should have red color' : `should have red color but found ${backgroundColor}`;
            console.log(`[Custom Header] ${ctrlIcon} Closed status ${ctrlMessage}.`);
            await expect.soft(fieldValue, 'Closed status should have red color').toHaveCSS('background-color', 'rgb(210, 40, 40)');
        } else if (status.toLowerCase().includes('incident')) {
            const backgroundColor = await fieldValue.evaluate((el) => window.getComputedStyle(el).backgroundColor);
            isCond = backgroundColor === 'rgb(228, 217, 60)';
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? 'should have yellow color' : `should have yellow color but found ${backgroundColor}`;
            console.log(`[Custom Header] ${ctrlIcon} Incident Status ${ctrlMessage}.`);
            await expect.soft(fieldValue, 'Incident status should have yellow color').toHaveCSS('background-color', 'rgb(228, 217, 60)');
        }
    }

    @step('Validate Date Format')
    async validateDateFormat(fieldName: string) {
        const fieldLabel = this.getHeaderLabelName(fieldName);
        const fieldValue = this.getClaimFieldValue(fieldName);
        
        // Validate field label visibility
        await expect.soft(fieldLabel, `${fieldName} label should be visible`).toBeVisible();
        let isCond = await this.isLocatorVisible(fieldLabel);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} "${fieldName}" label ${ctrlMessage}.`);
        
        // Validate field value visibility
        await expect.soft(fieldValue, `${fieldName} value should be visible`).toBeVisible();
        isCond = await this.isLocatorVisible(fieldValue);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} "${fieldName}" value ${ctrlMessage}.`);

        const dateText = await fieldValue.textContent();
        const dateTrimmed = dateText?.trim();

        // Validate MM/DD/YYYY format
        const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        await fieldValue.highlight();
        isCond = dateRegex.test(dateTrimmed || '');
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? `should be in MM/DD/YYYY format and has "${dateTrimmed}"` : `should be in MM/DD/YYYY format but found "${dateTrimmed}"`;
        console.log(`[Custom Header] ${ctrlIcon} "${fieldName}" ${ctrlMessage}.`);
        expect(dateTrimmed, `${fieldName} should be in MM/DD/YYYY format`).toMatch(dateRegex);
    }

    @step('Validate Examiner Name Format')
    async validateExaminerNameFormat(examinerLabel = 'Examiner') {
        const examinerValue = this.getClaimFieldValue(examinerLabel);
        
        // Validate examiner value visibility
        await expect.soft(examinerValue, `${examinerLabel} value should be visible`).toBeVisible();
        let isCond = await this.isLocatorVisible(examinerValue);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} "${examinerLabel}" value ${ctrlMessage}.`);
        
        const examinerText = await examinerValue.textContent();
        const trimmedText = examinerText?.trim() || '';
        
        // Should display FIRST and LAST NAME, not be a hyperlink
        const nameRegex = /^[A-Za-z]+(\s+[A-Za-z]+)+$/;
        isCond = nameRegex.test(trimmedText);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? `should display first and last name and has "${trimmedText}"` : `should display first and last name but found "${trimmedText}"`;
        console.log(`[Custom Header] ${ctrlIcon} "${examinerLabel}" ${ctrlMessage}.`);
        expect(trimmedText, `${examinerLabel} should display first and last name`).toMatch(nameRegex);
        
        // Should not be a hyperlink
        const examinerLink = this.page.locator(`//app-claim-header//div[div[contains(text(), "${examinerLabel}")]]//a`);
        await expect.soft(examinerLink, `${examinerLabel} should not be a hyperlink`).not.toBeVisible();
        isCond = !(await this.isLocatorVisible(examinerLink));
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'should not be a hyperlink' : 'should not be a hyperlink but was found';
        console.log(`[Custom Header] ${ctrlIcon} "${examinerLabel}" ${ctrlMessage}.`);
    }

    @step('Wait Customization Popup to be Hidden')
    async waitCustomizationToBeHidden() {
        // Validate customization popup is hidden
        await expect.soft(this.customizeHeaderPopup, 'Customization popup should be hidden').toBeHidden();
        let isCond = !(await this.isLocatorVisible(this.customizeHeaderPopup));
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is hidden' : 'should be hidden but was found visible';
        console.log(`[Custom Header] ${ctrlIcon} Customization popup ${ctrlMessage}.`);
    }

    @step('Validate Customization Popup is Open')
    async validateCustomizationPopupIsOpen() {
        // Validate customization popup is visible
        await expect.soft(this.customizeHeaderPopup, 'Customization popup should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.customizeHeaderPopup);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Customization popup ${ctrlMessage}.`);
        
        // Validate popup title is visible
        await expect.soft(this.customizeHeaderTitle, 'Popup title should be "Configure disability header"').toBeVisible();
        isCond = await this.isLocatorVisible(this.customizeHeaderTitle);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Popup title ${ctrlMessage}.`);
    }

    @step('Validate Leave Customization Popup is Open')
    async validateLeaveCustomizationPopupIsOpen() {
        // Validate leave customization popup is visible
        await expect.soft(this.leaveCustomizeHeaderPopup, 'Leave customization popup should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.leaveCustomizeHeaderPopup);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Leave customization popup ${ctrlMessage}.`);
        
        // Validate popup title is visible
        await expect.soft(this.leaveCustomizeHeaderTitle, 'Popup title should be "Configure leave header"').toBeVisible();
        isCond = await this.isLocatorVisible(this.leaveCustomizeHeaderTitle);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Leave popup title ${ctrlMessage}.`);
    }

    @step('Validate Customization Popup is Closed')
    async validateCustomizationPopupIsClosed() {
        // Validate customization popup is closed (not visible)
        await expect.soft(this.customizeHeaderPopup, 'Customization popup should not be visible').not.toBeVisible();
        let isCond = !(await this.isLocatorVisible(this.customizeHeaderPopup));
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is closed (not visible)' : 'should be closed but was found visible';
        console.log(`[Custom Header] ${ctrlIcon} Customization popup ${ctrlMessage}.`);
    }

    @step('Validate Field Order in Header')
    async validateFieldOrderInHeader(expectedOrder: string[]) {
        const headerFields = this.page.locator('//app-claim-header//div[contains(@class, "tw-flex tw-justify-between")]');
        const fieldCount = await headerFields.count();
        console.log('[Validation] Validate Default Order for Leave Claim Header Fields');
        
        // Validate field count
        let isCond = fieldCount === expectedOrder.length;
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? `should have ${expectedOrder.length} fields` : `should have ${expectedOrder.length} fields but found ${fieldCount}`;
        console.log(`[Custom Header] ${ctrlIcon} Header field count ${ctrlMessage}.`);
        expect.soft(fieldCount, `Expected ${expectedOrder.length} fields, found ${fieldCount}`).toBe(expectedOrder.length);
        
        // Validate each field position and text
        for (let i = 0; i < expectedOrder.length; i++) {
            const fieldLabel = headerFields.nth(i).locator('//div[contains(@class, "tw-items-top")]');
            const fieldText = await fieldLabel.textContent();
            isCond = fieldText?.trim() === expectedOrder[i];
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? `should be "${expectedOrder[i]}"` : `should be "${expectedOrder[i]}" but found "${fieldText?.trim()}"`;
            console.log(`[Custom Header] ${ctrlIcon} Field at position ${i + 1} ${ctrlMessage}.`);
            await expect.soft(fieldLabel, `Field at position ${i + 1} should be "${expectedOrder[i]}"`).toHaveText(expectedOrder[i]);
        }
    }

    @step('Validate Maximum Fields Limit')
    async validateMaximumFieldsLimit() {
        const selectedFields = this.selectedFieldsList;
        const fieldCount = await selectedFields.count();
        
        // Validate maximum fields limit (10 fields)
        let isCond = fieldCount <= 10;
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? `should have maximum 10 fields and has ${fieldCount}` : `should have maximum 10 fields but found ${fieldCount}`;
        console.log(`[Custom Header] ${ctrlIcon} Selected fields count ${ctrlMessage}.`);
        expect(fieldCount, 'Maximum 10 fields should be allowed').toBeLessThanOrEqual(10);
    }

    
    //--------------------------------------------------------------------------------------------
    // Action Methods
    //--------------------------------------------------------------------------------------------

    @step('Click Star Icon from Watchlist')
    async clickStarIcon() {
        // Validate star icon is visible
        await expect.soft(this.removeWatchlistIcon, 'Star Icon from Watchlist should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.removeWatchlistIcon);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Star icon (Remove from Watchlist) ${ctrlMessage}.`);
        
        // Click star icon
        await this.removeWatchlistIcon.click();
        console.log('[Custom Header] Star icon clicked successfully.');
    }

    @step('Click Pencil Icon to configure header')
    async clickPencilIcon() {
        // Validate pencil icon is visible
        await expect.soft(this.pencilIcon, 'Pencil icon should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.pencilIcon);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Pencil icon ${ctrlMessage}.`);
        
        // Click pencil icon
        await this.pencilIcon.click();
        console.log('[Custom Header] Pencil icon clicked successfully.');
    }

    @step('Open Customization Popup')
    async openCustomizationPopup() {
        await this.clickPencilIcon();
        await this.validateCustomizationPopupIsOpen();
    }

    @step('Open Leave Customization Popup')
    async openLeaveCustomizationPopup() {
        await this.clickPencilIcon();
        await this.validateLeaveCustomizationPopupIsOpen();
    }

    @step('Close Customization Popup')
    async closeCustomizationPopup() {
        await this.cancelButton.click();
        await this.validateCustomizationPopupIsClosed();
    }

    @step('Save Customization Changes')
    async saveCustomizationChanges() {
        await this.saveButton.click();
        await this.validateCustomizationPopupIsClosed();
        await this.waitCustomizationToBeHidden();
    }

    @step('Add Field to Header')
    async addFieldToHeader(fieldName: string) {
        //Select Field from available list
        const fieldInAvailable = this.getFieldInAvailableList(fieldName);
        let isCond = await this.isLocatorVisible(fieldInAvailable);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is available for selection' : 'should be available for selection but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Field "${fieldName}" ${ctrlMessage}.`);
        await expect.soft(fieldInAvailable, `Field "${fieldName}" should be available for selection`).toBeVisible();
        
        await fieldInAvailable.click();
        console.log(`[Custom Header] Field "${fieldName}" selected from available list.`);
        
        await this.addFieldButton.click();
        console.log(`[Custom Header] Add field button clicked.`);
        
        // Validate field is now in selected list
        const fieldInSelected = this.getFieldInSelectedList(fieldName);
        await expect.soft(fieldInSelected, `Field "${fieldName}" should be in selected list`).toBeVisible();
        isCond = await this.isLocatorVisible(fieldInSelected);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is now in selected list' : 'should be in selected list but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Field "${fieldName}" ${ctrlMessage}.`);
    }

    @step('Add Non-existent Field to Header')
    async addNonExistentFieldToHeader(fieldName: string) {
        //Select Field from available list
        const fieldInAvailable = this.getFieldInAvailableList(fieldName);
        await fieldInAvailable.click();
        await this.addFieldButton.click();
    }

    @step('Remove Field from Header')
    async removeFieldFromHeader(fieldName: string) {
        console.log(`[Custom Header] Removing field "${fieldName}" from header.`);
        const fieldInSelected = await this.getFieldInSelectedList(fieldName);
        await expect.soft(fieldInSelected, `Field "${fieldName}" should be in selected list`).toBeVisible();
        let isCond = await this.isLocatorVisible(fieldInSelected);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is in selected list' : 'should be in selected list but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Field "${fieldName}" ${ctrlMessage}.`);

        if(isCond){
            await fieldInSelected.click(); // Select the field
            console.log(`[Custom Header] Field "${fieldName}" selected from selected list.`);
            
            await this.removeFieldButton.click();
            console.log(`[Custom Header] Remove field button clicked.`);
            
            // Validate field is now in available list
            const fieldInAvailable = this.getFieldInAvailableList(fieldName);
            await expect.soft(fieldInAvailable, `Field "${fieldName}" should be in available list`).toBeVisible();
            isCond = await this.isLocatorVisible(fieldInAvailable);
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? 'is now in available list' : 'should be in available list but was not found';
            console.log(`[Custom Header] ${ctrlIcon} Field "${fieldName}" ${ctrlMessage}.`);
        }
        
    }

    @step('Move Field Up in Order')
    async moveFieldUpInOrder(fieldName: string) {
        const fieldInSelected = this.getFieldInSelectedList(fieldName);
        
        await expect(fieldInSelected, `Field "${fieldName}" should be in selected list`).toBeVisible();
        await fieldInSelected.click(); // Select the field
        await this.moveUpButton.click();
    }

    @step('Move Field Down in Order')
    async moveFieldDownInOrder(fieldName: string) {
        const fieldInSelected = this.getFieldInSelectedList(fieldName);
        
        await expect(fieldInSelected, `Field "${fieldName}" should be in selected list`).toBeVisible();
        await fieldInSelected.click(); // Select the field
        await this.moveDownButton.click();
    }

    @step('Restore Default Fields')
    async restoreDefaultFields() {
        console.log(`[Custom Header] Restoring default fields.`);
        await expect.soft(this.restoreDefaultsButton, 'Restore Defaults button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.restoreDefaultsButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Restore defaults button ${ctrlMessage}.`);
        
        console.log(`[Custom Header] Clicking restore defaults button.`);
        await this.restoreDefaultsButton.click();
        await this.delay(3000);
        console.log(`[Custom Header] Default fields restored successfully.`);
    }

    @step('Customize Header with Fields')
    async customizeHeaderWithFields(fieldsToAdd: string[], fieldsToRemove: string[] = [], restoreDefaultFields = true, saveChanges = true) {
        // Restore Defaults Options
        await this.openCustomizationPopup();
        if( restoreDefaultFields ){ 
            await this.restoreDefaultFields(); 
        }
        
        // Add fields
        for (const field of fieldsToAdd) {
            await this.addFieldToHeader(field);
        }
        
        // Remove fields
        for (const field of fieldsToRemove) {
            await this.removeFieldFromHeader(field);
        }
        
        if(saveChanges){
            await this.saveCustomizationChanges();
        }
    }


    @step('Reorder Header Fields')
    async reorderHeaderFields(fieldName: string, direction: 'up' | 'down') {
        await this.openCustomizationPopup();
        
        if (direction === 'up') {
            await this.moveFieldUpInOrder(fieldName);
        } else {
            await this.moveFieldDownInOrder(fieldName);
        }
        
        await this.saveCustomizationChanges();
    }

    @step('Validate At Least One Field Selected')
    async validateAtLeastOneFieldSelected() {
        const selectedFields = this.selectedFieldsList;
        const fieldCount = await selectedFields.count();
        
        expect(fieldCount, 'At least one field must be selected').toBeGreaterThan(0);
    }

    @step('Validate Field is Available for Selection')
    async validateFieldIsAvailableForSelection(fieldName: string) {
        const fieldInAvailable = this.getFieldInAvailableList(fieldName);
        
        // Validate field is available for selection
        await expect.soft(fieldInAvailable, `Field "${fieldName}" should be available for selection`).toBeVisible();
        let isCond = await this.isLocatorVisible(fieldInAvailable);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is available for selection' : 'should be available for selection but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Field "${fieldName}" ${ctrlMessage}.`);
    }

    @step('Validate Field is Selected')
    async validateFieldIsSelected(fieldName: string) {
        const fieldInSelected = this.getFieldInSelectedList(fieldName);
        await expect(fieldInSelected, `Field "${fieldName}" should be selected`).toBeVisible();
    }

    @step('Validate Field is Not Selected')
    async validateFieldIsNotSelected(fieldName: string) {
        const fieldInSelected = this.getFieldInSelectedList(fieldName);
        await expect(fieldInSelected, `Field "${fieldName}" should not be selected`).not.toBeVisible();
    }

    //--------------------------------------------------------------------------------------------
    // Status Check Methods
    //--------------------------------------------------------------------------------------------

    @step('Get Current Header Field Order')
    async getCurrentHeaderFieldOrder(): Promise<string[]> {
        const headerFields = await this.page.locator('//app-claim-header//div[contains(@class, "tw-justify-between")]//div[not(contains(@class, "insert")) and contains(@class, "tw-text-balance")]').all();
        const fieldOrder: string[] = [];
        
        for (const field of headerFields){
            const fieldText = await field.textContent();
            if (fieldText) {
                fieldOrder.push(fieldText.trim());
            }
        }

        return fieldOrder;
    }

    @step('Get Available Fields List')
    async getAvailableFieldsList(): Promise<string[]> {
        const availableFields = this.availableFieldsList;
        const fieldCount = await availableFields.count();
        const fields: string[] = [];
        
        for (let i = 0; i < fieldCount; i++) {
            const fieldText = await availableFields.nth(i).textContent();
            if (fieldText) {
                fields.push(fieldText.trim());
            }
        }
        
        return fields;
    }

    @step('Get Selected Fields List')
    async getSelectedFieldsList(): Promise<string[]> {
        const selectedFields = this.selectedFieldsList;
        const fieldCount = await selectedFields.count();
        const fields: string[] = [];
        
        for (let i = 0; i < fieldCount; i++) {
            const fieldText = await selectedFields.nth(i).textContent();
            if (fieldText) {
                fields.push(fieldText.trim());
            }
        }
        
        return fields;
    }

    @step('Error Required: At least one field selected')
    async errorRequiredMessageIsVisible() {
        await expect(this.errorRequiredMessage, 'Error Required: At least one field selected should be visible').toBeVisible();
    }

    @step('Error: 10 fields maximum selected')
    async error10MaximymMessageIsVisible() {
        await expect(this.error10MaximumMessage, 'Error: 10 fields maximum selected should be visible').toBeVisible();
    }

    //--------------------------------------------------------------------------------------------
    // Leave-Specific Locators (Breadcrumbs, LOB, Employee Info, Glasses Icon)
    //--------------------------------------------------------------------------------------------

    private get breadcrumbsContainer(): Locator {
        return this.page.locator('app-breadcrumb');
    }

    private get breadcrumbViewLink(): Locator {
        return this.page.locator('app-breadcrumb app-link-label');
    }

    private get breadcrumbClaimNumber(): Locator {
        return this.page.locator('app-breadcrumb span[class*="tw-font-bold"]');
    }

    private get lineOfBusinessAbsenceType(): Locator {
        return this.page.locator('//div[contains(text(), "Leave of Absence") and contains(@class, "tw-leading")]');
    }

    private get claimNumberHeader(): Locator {
        return this.page.locator('//div//h1').first();
    }

    private get glassesIcon(): Locator {
        return this.page.getByLabel('Search claim fields');
    }

    private get employeeIdLabel(): Locator {
        return this.page.locator('//*[contains(text(), "Employee ID:")]');
    }

    private get employeeName(): Locator {
        return this.page.locator('div[class="tw-text-right"] h1');
    }

    private get claimHeaderGrayBox(): Locator {
        return this.page.locator('//app-claim-header//*[contains(@class, "bg-gray") or contains(@class, "gray-box")]');
    }

    //--------------------------------------------------------------------------------------------
    // Leave-Specific Validation Methods
    //--------------------------------------------------------------------------------------------

    @step('Validate Leave Breadcrumbs Display - Req 3.2.001')
    async validateLeaveBreadcrumbsDisplay(dataset: number) {
        // Validate breadcrumbs container is visible
        let isCond = await this.isLocatorVisible(this.breadcrumbsContainer);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Breadcrumbs container ${ctrlMessage}.`);
        
        const breadcrumbText = await this.breadcrumbsContainer.textContent();
        isCond = (breadcrumbText || '').includes('View');
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'contains "View"' : 'should contain "View" but found something else';
        console.log(`[Custom Header] ${ctrlIcon} Breadcrumbs ${ctrlMessage}.`);
        expect(breadcrumbText, 'Breadcrumbs should contain "View /"').toContain('View');
        
        // Validate "View" is a hyperlink
        const viewLink = this.breadcrumbViewLink;
        if (await viewLink.count() > 0) {
            await expect.soft(viewLink, '"View" should be a clickable link').toBeVisible();
            isCond = await this.isLocatorVisible(viewLink);
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[Custom Header] ${ctrlIcon} "View" link ${ctrlMessage}.`);
        }

        // Validate claim number is displayed (without star icon in breadcrumbs)
        const reader = new ExcelReader(`${this.driverPath}${this.driverFile}`);
        reader.selectDataSet('ClaimSearch', dataset);
        for(let row = 0; row < reader.count(); row++){
            reader.useRow(row);
            const expectedClaimNumber = reader.getValue('ClaimNumber', '');
            const claimNumberInBreadcrumb = await this.breadcrumbClaimNumber.textContent();
            isCond = (claimNumberInBreadcrumb || '').includes(expectedClaimNumber) || claimNumberInBreadcrumb !== null;
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? `contains claim number "${expectedClaimNumber}"` : `should contain claim number "${expectedClaimNumber}" but found "${claimNumberInBreadcrumb}"`;
            console.log(`[Custom Header] ${ctrlIcon} Breadcrumb ${ctrlMessage}.`);
            expect(claimNumberInBreadcrumb, `Breadcrumb should contain claim number ${expectedClaimNumber}`).toBeTruthy();
        }
    }

    @step('Validate View Link Navigation - Req 3.2.001')
    async validateViewLinkNavigation() {
        const viewLink = this.breadcrumbViewLink;
        // Store current URL before navigation
        await expect.soft(viewLink, 'Element view/ Link in breadcrumb should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(viewLink);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} View link ${ctrlMessage}.`);
        
        console.log(`[Custom Header] Clicking View link in breadcrumb.`);
        await viewLink.click();
        await this.waitForPageLoad();
        console.log(`[Custom Header] Page load completed after navigation.`);
        
        // Validate navigation occurred (URL should change)
        const viewHeader = await this.viewHeader;
        await expect.soft(viewHeader, 'Page should be redirected to View Page after click on view/ Link in breadcrumb').toBeVisible();
        isCond = await this.isLocatorVisible(viewHeader);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible after navigation with view/ Link' : 'should be visible after navigation but was not found';
        console.log(`[Custom Header] ${ctrlIcon} View header ${ctrlMessage}.`);
    }

    @step('Validate Line of Business Absence Type Display - Req 3.2.002')
    async validateLineOfBusinessAbsenceType(expectedValue?: string) {
        const lobElement = this.lineOfBusinessAbsenceType;

        //Validate if Line of Business - Absence Type is visible
        let isCond = await lobElement.isVisible();
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Line of Business - Absence Type ${ctrlMessage} on Claim Header.`);
        await expect(lobElement, 'Line of Business - Absence Type should be visible').toBeVisible();
            
        // Validate gray font color
        isCond = await lobElement.evaluate((el) => window.getComputedStyle(el).color === 'rgb(116, 122, 136)');
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'should have gray color' : 'should have gray color but has another color';
        console.log(`[Custom Header] ${ctrlIcon} Line of Business - Absence Type ${ctrlMessage}.`);
        await expect(lobElement, 'Line of Business should have gray color').toHaveCSS('color', 'rgb(116, 122, 136)');
        
        // Validate text is left justified (default)
        const textAlign = await lobElement.evaluate((el) => window.getComputedStyle(el).textAlign);
        isCond = textAlign === 'left' || textAlign === 'start';
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'should be left justified' : `should be left justified but is justified to ${textAlign}`;
        console.log(`[Custom Header] ${ctrlIcon} Line of Business - Absence Type ${ctrlMessage}.`);
        await expect(textAlign === 'left' || textAlign === 'start', 'Line of Business should be left justified').toBeTruthy();
        
        // Validate expected value
        if (expectedValue) {
            const text = await lobElement.textContent();
            isCond = (text?.trim() || '').includes(expectedValue);
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? `should display "${expectedValue}"` : `should display "${expectedValue}" but found "${text?.trim()}"`;
            console.log(`[Custom Header] ${ctrlIcon} Line of Business - Absence Type ${ctrlMessage}.`);
            expect(text?.trim(), `Line of Business should display "${expectedValue}"`).toContain(expectedValue);
        }
    }

    @step('Validate Claim Number Display with Star Icon - Req 3.2.002')
    async validateClaimNumberDisplayWithStarIcon(expectedClaimNumber?: string) {
        const claimNumberElement = this.claimNumberHeader;
        
        let isCond = await claimNumberElement.isVisible();
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Claim number ${ctrlMessage} on Claim Header.`);
        await expect(claimNumberElement, 'Claim number should be visible').toBeVisible();
        
        // Validate bold and larger font
        const fontWeight = await claimNumberElement.evaluate((el) => window.getComputedStyle(el).fontWeight);
        const fontWeightValue = parseInt(fontWeight);
        isCond = fontWeightValue >= 400;
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'should be bold' : `should be bold but font weight is ${fontWeightValue}`;
        console.log(`[Custom Header] ${ctrlIcon} Claim number ${ctrlMessage}.`);
        expect(fontWeightValue, 'Claim number should be bold').toBeGreaterThanOrEqual(400);
        
        // Validate star icon is present (not in breadcrumbs, but in header)
        await this.valiteAddToWatchlistIconIsVisible();
        
        // Validate expected value
        if (expectedClaimNumber) {
            const text = await claimNumberElement.textContent();
            isCond = (text?.trim() || '').includes(expectedClaimNumber);
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? `should display "${expectedClaimNumber}"` : `should display "${expectedClaimNumber}" but found "${text?.trim()}"`;
            console.log(`[Custom Header] ${ctrlIcon} Claim number ${ctrlMessage}.`);
            expect(text?.trim(), `Claim number should display "${expectedClaimNumber}"`).toContain(expectedClaimNumber);
        }
    }

    @step('Validate Glasses Icon Display and Functionality - Req 3.2.002')
    async validateGlassesIconDisplay() {
        const glassesIcon = this.glassesIcon;
        
        //Validate if Glasses icon is visible
        await expect.soft(glassesIcon, 'Glasses icon should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(glassesIcon);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Glasses icon ${ctrlMessage} on Claim Header.`);
    }

    @step('Validate Employee ID Display - Req 3.2.003')
    async validateEmployeeIDDisplay(expectedEmployeeId?: string, shouldBeMasked: boolean = false) {
        const employeeIdLabel = this.employeeIdLabel;

        //Validate if Employee ID is visible
        let isCond = await employeeIdLabel.isVisible();
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Employee ID label ${ctrlMessage} on Claim Header.`);
        await expect(employeeIdLabel, 'Employee ID label should be visible').toBeVisible();
            
        // Validate text is right justified
        const textAlign = await employeeIdLabel.evaluate((el) => window.getComputedStyle(el).textAlign);
        isCond = textAlign === 'right';
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'should be right justified' : `should be right justified but is justified to ${textAlign}`;
        console.log(`[Custom Header] ${ctrlIcon} Employee ID label ${ctrlMessage}.`);
        await expect(textAlign === 'right' || textAlign === 'end', 'Employee ID should be right justified').toBeTruthy();

        // Validate gray font color
        isCond = await employeeIdLabel.evaluate((el) => window.getComputedStyle(el).color === 'rgb(116, 122, 136)');
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'should have gray color' : 'should have gray color but has another color';
        console.log(`[Custom Header] ${ctrlIcon} Employee ID label ${ctrlMessage}.`);
        await expect(employeeIdLabel, 'Employee ID should have gray color').toHaveCSS('color', 'rgb(116, 122, 136)');
        
        // Validate Employee ID value
        if (expectedEmployeeId) {
            const employeeIdText = await employeeIdLabel.textContent();
            if (shouldBeMasked) {
                // Validate masking (should contain asterisks or similar)
                const maskingPattern = /[\*X-]/;
                isCond = maskingPattern.test(employeeIdText || '');
                ctrlIcon = isCond ? '✅': '❌';
                ctrlMessage = isCond ? `should be masked and has: ${employeeIdText}` : `should be masked but found "${employeeIdText}"`;
                console.log(`[Custom Header] ${ctrlIcon} Employee ID ${ctrlMessage}.`);
                expect(employeeIdText, `Employee ID should be masked and has ${employeeIdText}`).toMatch(maskingPattern);
            } else {
                isCond = (employeeIdText || '').includes(expectedEmployeeId);
                ctrlIcon = isCond ? '✅': '❌';
                ctrlMessage = isCond ? `should display "${expectedEmployeeId}"` : `should display "${expectedEmployeeId}" but found "${employeeIdText}"`;
                console.log(`[Custom Header] ${ctrlIcon} Employee ID ${ctrlMessage}.`);
                expect(employeeIdText, `Employee ID should display "${expectedEmployeeId}"`).toContain(expectedEmployeeId);
            }
        }
    }

    @step('Validate Employee Name Display - Req 3.2.003')
    async validateEmployeeNameDisplay(expectedFirstName?: string, expectedLastName?: string) {
        const employeeNameElement = this.employeeName;

        //Validate if Employee Name is visible
        let isCond = await employeeNameElement.isVisible();
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Employee name ${ctrlMessage} on Claim Header.`);
        await expect(employeeNameElement, 'Employee name should be visible').toBeVisible();

        // Validate bold font weight
        const fontWeight = await employeeNameElement.evaluate((el) => window.getComputedStyle(el).fontWeight);
        const fontWeightValue = parseInt(fontWeight);
        isCond = fontWeightValue >= 400;
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'should be bold' : `should be bold but font weight is ${fontWeightValue}`;
        console.log(`[Custom Header] ${ctrlIcon} Employee name ${ctrlMessage}.`);
        expect(fontWeightValue, 'Employee name should be bold').toBeGreaterThanOrEqual(400);

        // Validate larger font size (matching claim number size)
        const fontSize = await employeeNameElement.evaluate((el) => window.getComputedStyle(el).fontSize);
        isCond = parseInt(fontSize) >= 26;
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? `should have font zise > 26px and has ${fontSize}` : `should have font size >= 26px but it has ${fontSize}`;
        console.log(`[Custom Header] ${ctrlIcon} Employee name ${ctrlMessage}.`);
        expect(fontWeightValue, 'Employee name should have font zise > 26px').toBeGreaterThanOrEqual(26);

        
        if (expectedFirstName && expectedLastName) {
            const nameText = await employeeNameElement.textContent();
            const trimmedName = nameText?.trim() || '';
            // Validate format: First Last (both capitalized, not sentence case)
            const nameRegex = /^[A-Z][a-z]* [A-Z][a-z]*$/;
            isCond = nameRegex.test(trimmedName);
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? 'should be in First Last format with both capitalized' : `should be in First Last format but found "${trimmedName}"`;
            console.log(`[Custom Header] ${ctrlIcon} Employee name ${ctrlMessage}.`);
            expect(trimmedName, 'Employee name should be in First Last format with both capitalized').toMatch(nameRegex);
            
            isCond = trimmedName.includes(expectedFirstName);
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? `should contain "${expectedFirstName} ${expectedLastName}"` : `should contain "${expectedFirstName} ${expectedLastName}" but found "${trimmedName}"`;
            console.log(`[Custom Header] ${ctrlIcon} Employee name ${ctrlMessage}.`);
            expect(trimmedName, `Employee name should contain "${expectedFirstName} ${expectedLastName}"`).toContain(expectedFirstName);
        }
    }

    @step('Validate Leave Claim Header Structure - Req 3.2.002-3.2.003')
    async validateLeaveClaimHeaderStructure() {
        // Validate all main header elements
        await this.validateLineOfBusinessAbsenceType();
        await this.validateClaimNumberDisplayWithStarIcon();
        await this.validateGlassesIconDisplay();
        await this.validateEmployeeIDDisplay();
        await this.validateEmployeeNameDisplay();
    }

    @step('Validate Leave Case Type Display - Req 3.2.004')
    async validateLeaveCaseTypeDisplay(expectedCaseTypes?: string[]) {
        const caseTypeValue = this.getClaimFieldValue('Case type');
        await expect.soft(caseTypeValue, 'Case Type value should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(caseTypeValue);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Case type value ${ctrlMessage}.`);
        
        if (expectedCaseTypes) {
            const caseTypeText = await caseTypeValue.textContent();
            const foundCaseType = expectedCaseTypes.some(type => caseTypeText?.includes(type));
            isCond = foundCaseType;
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? `should be one of: ${expectedCaseTypes.join(', ')} and has "${caseTypeText}"` : `should be one of: ${expectedCaseTypes.join(', ')} but found "${caseTypeText}"`;
            console.log(`[Custom Header] ${ctrlIcon} Case type ${ctrlMessage}.`);
            expect(foundCaseType, `Case Type should be one of: ${expectedCaseTypes.join(', ')}`).toBeTruthy();
        }
    }

    @step('Validate Leave Date Fields Format - Req 3.2.004')
    async validateLeaveDateFieldsFormat() {
        const dateFields = ['Begin', 'End'];
        
        for (const field of dateFields) {
            await this.validateDateFormat(field);
        }
    }

    @step('Validate Leave Available Additional Fields - Req 3.2.005')
    async validateLeaveAvailableAdditionalFields() {
        console.log(`[Custom Header] Validating leave available additional fields.`);
        await this.openLeaveCustomizationPopup();

        const expectedAdditionalFields = [
            'Caring for', 
            'Client #',
            'Client name', 
            'Gender', 
            'Hours worked in last 12 months', 
            'Months of service', 
            'Phone #', 
            'Relationship', 
            'Spouse at same client', 
            'SSN', 
            'Work state/province'
        ];
        
        const selectPanel = this.availableListRoot;
        await expect.soft(selectPanel, `Available Panel should be visible`).toBeVisible();
        let isCond = await this.isLocatorVisible(selectPanel);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Available panel ${ctrlMessage}.`);

        console.log(`[Custom Header] Validating ${expectedAdditionalFields.length} additional fields are available for selection.`);
        for (const field of expectedAdditionalFields) {
            await this.validateFieldIsAvailableForSelection(field);
        }
        console.log(`[Custom Header] All ${expectedAdditionalFields.length} additional fields validated.`);
        
        //await this.closeCustomizationPopup();
    }

    @step('Validate SSN Field with Eye Icon - Req 3.2.005')
    async validateSSNFieldWithEyeIcon() {
        // Add SSN field to header
        await this.customizeHeaderWithFields(['SSN'], [], true);
        
        // Validate SSN field is visible
        await this.validateFieldIsVisible('SSN');
        
        // Validate eye icon for unmasking is present
        const ssnEyeIcon = this.ssnEyeIcon;
        await expect.soft(ssnEyeIcon, 'Eye icon for SSN unmasking should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(ssnEyeIcon);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Eye icon for SSN unmasking ${ctrlMessage}.`);
    
        
        // Validate SSN is masked by default
        const ssnValue = this.getClaimFieldValue('SSN');
        const ssnText = await ssnValue.textContent();
        const maskingPattern = /[\*X-]/;
        expect.soft(ssnText, 'SSN should be masked by default').toMatch(maskingPattern);
        isCond = maskingPattern.test(ssnText || '');
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? `should be masked by default and has "${ssnText}"` : `should be masked by default but found "${ssnText}"`;
        console.log(`[Custom Header] ${ctrlIcon} SSN ${ctrlMessage}.`);
    }

    @step('Verify Add To Watchlist Is Not Visible')
    async valiteAddToWatchlistIconIsNotVisible() {
        const starIconInBreadcrumb = this.addWatchlistIcon;
        await expect.soft(starIconInBreadcrumb, 'Add Watchlist Icon should not be visible').not.toBeVisible();
        let isCond = !(await this.isLocatorVisible(starIconInBreadcrumb));
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is not visible' : 'should not be visible but was found';
        console.log(`[Custom Header] ${ctrlIcon} Add to Watchlist icon ${ctrlMessage}.`);
    }
    
    @step('Verify Add To Watchlist Is Visible')
    async valiteAddToWatchlistIconIsVisible() {
        const starIconInBreadcrumb = await this.removeWatchlistIcon;
        const starCount = await starIconInBreadcrumb.count();
        let isCond = await starIconInBreadcrumb.isVisible();
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'should be visible' : 'should be visible but was not found';
        console.log(`[Custom Header] ${ctrlIcon} Star icon (Add to Watchlist) ${ctrlMessage}.`);
        await expect(starIconInBreadcrumb, 'Add Watchlist Icon should be visible').toBeVisible();
    }

    @step('Get Options Radio Buttons Count')
    async getOptionsRadioButtonsCount(): Promise<number> {
        const optionRadioButtons = this.configureForRadioButton;
        return await optionRadioButtons.count();
    }

}

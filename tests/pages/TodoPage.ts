import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { step } from '../fixtures/BaseTest';

export class TodoPage extends BasePage {
    private readonly name = "My to-do";
    
    constructor(page: Page) {
        super(page);
    }

    //--------------------------------------------------------------------------------------------
    // Module Header and Navigation Locators
    //--------------------------------------------------------------------------------------------

    private get todoHeader(): Locator {
        return this.page.getByRole('heading', { name: 'My to-do' });
    }

    private get todoHeaderLine(): Locator {
        return this.page.locator('app-page-header hr');
    }

    private get sharedDiariesTab(): Locator {
        return this.page.getByRole('tab', { name: 'Shared Diaries' });
    }

    private get personalTasksTab(): Locator {
        return this.page.getByRole('tab', { name: 'Personal Tasks' });
    }

    //--------------------------------------------------------------------------------------------
    // Shared Diaries - Browse View Locators
    //--------------------------------------------------------------------------------------------

    private get browseRadioButton(): Locator {
        return this.page.getByRole('radio', { name: 'Browse' });
    }

    private get searchRadioButton(): Locator {
        return this.page.getByRole('radio', { name: 'Search' });
    }

    private get calendarHeader(): Locator {
        return this.page.locator('//div[contains(@class, "calendar")]//div[contains(@class, "header")]');
    }

    private get calendarPreviousArrow(): Locator {
        return this.page.locator('//div[contains(@class, "calendar")]//button[contains(@aria-label, "Previous") or contains(@aria-label, "<")]');
    }

    private get calendarNextArrow(): Locator {
        return this.page.locator('//div[contains(@class, "calendar")]//button[contains(@aria-label, "Next") or contains(@aria-label, ">")]');
    }

    private get todayButton(): Locator {
        return this.page.getByRole('button', { name: /Today/i });
    }

    private get includeCompletedToggle(): Locator {
        return this.page.locator('//label[contains(text(), "Included completed")]//following-sibling::*[contains(@class, "toggle")]');
    }

    private getCalendarDayHeader(dayIndex: number): Locator {
        return this.page.locator(`//div[contains(@class, "calendar")]//div[contains(@class, "day-header")]`).nth(dayIndex);
    }

    private getCalendarDay(dayIndex: number): Locator {
        return this.page.locator(`//div[contains(@class, "calendar")]//div[contains(@class, "day")]`).nth(dayIndex);
    }

    //--------------------------------------------------------------------------------------------
    // Shared Diaries - Search View Locators
    //--------------------------------------------------------------------------------------------

    private get clientSearchField(): Locator {
        return this.page.locator('//label[contains(text(), "Client")]//following-sibling::*//input');
    }

    private get diaryStatusDropdown(): Locator {
        return this.page.locator('//label[contains(text(), "Diary status")]//following-sibling::*//div[contains(@class, "multiselect")]');
    }

    private get diaryTypeDropdown(): Locator {
        return this.page.locator('//label[contains(text(), "Diary type")]//following-sibling::*//div[contains(@class, "multiselect")]');
    }

    private get diaryDueDropdown(): Locator {
        return this.page.locator('//label[contains(text(), "Diary due")]//following-sibling::*//div[contains(@class, "multiselect")]');
    }

    private get followUpUserField(): Locator {
        return this.page.locator('//label[contains(text(), "Follow-up user")]//following-sibling::*//input');
    }

    private get createdByField(): Locator {
        return this.page.locator('//label[contains(text(), "Created by")]//following-sibling::*//input');
    }

    private get dueDateFromField(): Locator {
        return this.page.locator('//label[contains(text(), "Due date")]//following-sibling::*//input[contains(@placeholder, "From") or position()=1]');
    }

    private get dueDateToField(): Locator {
        return this.page.locator('//label[contains(text(), "Due date")]//following-sibling::*//input[contains(@placeholder, "To") or position()=2]');
    }

    private get createDateFromField(): Locator {
        return this.page.locator('//label[contains(text(), "Create date")]//following-sibling::*//input[contains(@placeholder, "From") or position()=1]');
    }

    private get createDateToField(): Locator {
        return this.page.locator('//label[contains(text(), "Create date")]//following-sibling::*//input[contains(@placeholder, "To") or position()=2]');
    }

    private get searchButton(): Locator {
        return this.page.getByRole('button', { name: 'Search' });
    }

    private get clearButton(): Locator {
        return this.page.getByRole('button', { name: 'Clear' });
    }

    //--------------------------------------------------------------------------------------------
    // Shared Diaries - Action Buttons Locators
    //--------------------------------------------------------------------------------------------

    private get newDiaryButton(): Locator {
        return this.page.getByRole('button', { name: 'New diary' });
    }

    private get diaryTypesButton(): Locator {
        return this.page.getByRole('button', { name: 'Diary types' });
    }

    private get expandAllToggle(): Locator {
        return this.page.locator('//label[contains(text(), "Expand all")]//following-sibling::*[contains(@class, "toggle")]');
    }

    //--------------------------------------------------------------------------------------------
    // Shared Diaries - Table Locators
    //--------------------------------------------------------------------------------------------

    private get diariesTableHeader(): Locator {
        return this.page.locator('app-table thead tr');
    }

    private get diariesTableRows(): Locator {
        return this.page.locator('//tbody//tr');
    }

    private getDiaryRowByIndex(index: number): Locator {
        return this.diariesTableRows.nth(index);
    }

    private get diaryFilterButton(): Locator {
        return this.page.locator('//app-table//button[contains(@aria-label, "Filter") or contains(@class, "filter")]');
    }

    private get diaryFilterInput(): Locator {
        return this.page.locator('//app-table//app-filter-input//input').or(this.page.getByRole('textbox', { name: 'Search input' }));
    }

    private get diaryExportButton(): Locator {
        return this.page.locator('//app-table//button[contains(@aria-label, "Export") or contains(@class, "export")]');
    }

    private getDiaryExpandButton(rowIndex: number): Locator {
        return this.getDiaryRowByIndex(rowIndex).locator('app-expand-button button[aria-label*="Expand"]');
    }

    private getDiaryActionsButton(rowIndex: number): Locator {
        return this.getDiaryRowByIndex(rowIndex).locator('app-more-button button');
    }

    //--------------------------------------------------------------------------------------------
    // New Diary Screen Locators
    //--------------------------------------------------------------------------------------------

    private get newDiaryHeader(): Locator {
        return this.page.getByRole('heading', { name: 'New diary' });
    }

    private get backToTodoButton(): Locator {
        return this.page.getByRole('button', { name: /Back to My to-do/i });
    }

    private get followUpUserSearchBox(): Locator {
        return this.page.locator('//label[contains(text(), "Follow-up user")]//following-sibling::*//input');
    }

    private get additionalFollowUpUserDropdown(): Locator {
        return this.page.locator('//label[contains(text(), "Additional follow-up user")]//following-sibling::*//div[contains(@class, "multiselect")]');
    }

    private get dueDateField(): Locator {
        return this.page.locator('//label[contains(text(), "Due date")]//following-sibling::*//input');
    }

    private get diaryTypeDropdownNew(): Locator {
        return this.page.locator('//label[contains(text(), "Diary type")]//following-sibling::*//div[contains(@class, "select")]');
    }

    private get allowOtherUsersCheckbox(): Locator {
        return this.page.locator('//label[contains(text(), "Allow other users to update the diary status")]//preceding-sibling::*[contains(@class, "checkbox")]');
    }

    private get sendEmailReminderCheckbox(): Locator {
        return this.page.locator('//label[contains(text(), "Send email reminder")]//preceding-sibling::*[contains(@class, "checkbox")]');
    }

    private get diaryDescriptionTextarea(): Locator {
        return this.page.locator('//label[contains(text(), "Description") or contains(@placeholder, "description")]//following-sibling::*//textarea').or(this.page.locator('textarea'));
    }

    private get saveDiaryButton(): Locator {
        return this.page.getByRole('button', { name: 'Save diary' });
    }

    private get cancelDiaryButton(): Locator {
        return this.page.getByRole('button', { name: 'Cancel' });
    }

    //--------------------------------------------------------------------------------------------
    // Diary Types Screen Locators
    //--------------------------------------------------------------------------------------------

    private get diaryTypesHeader(): Locator {
        return this.page.getByRole('heading', { name: 'Diary types' });
    }

    private get backToTodoFromDiaryTypesButton(): Locator {
        return this.page.getByRole('button', { name: /Back.*to-do/i });
    }

    private get clientSearchBoxDiaryTypes(): Locator {
        return this.page.locator('//label[contains(text(), "Client")]//following-sibling::*//input');
    }

    private get addDiaryTypeButton(): Locator {
        return this.page.getByRole('button', { name: 'Add' });
    }

    private get diaryTypePopupHeader(): Locator {
        return this.page.locator('//app-dialog//h2[contains(text(), "Diary type")]');
    }

    private get diaryTypeNameField(): Locator {
        return this.page.locator('//app-dialog//label[contains(text(), "Diary type")]//following-sibling::*//input');
    }

    private get sequenceInListField(): Locator {
        return this.page.locator('//app-dialog//label[contains(text(), "Sequence in list")]//following-sibling::*//input');
    }

    private get displayInListCheckbox(): Locator {
        return this.page.locator('//app-dialog//label[contains(text(), "Display in list")]//preceding-sibling::*[contains(@class, "checkbox")]');
    }

    private get diaryTypeDescriptionTextarea(): Locator {
        return this.page.locator('//app-dialog//textarea');
    }

    private get closeDiaryTypePopupButton(): Locator {
        return this.page.locator('//app-dialog//button[contains(@aria-label, "Close") or contains(@class, "close")]');
    }

    private get saveDiaryTypeButton(): Locator {
        return this.page.locator('//app-dialog//button[contains(text(), "Save")]');
    }

    private get cancelDiaryTypeButton(): Locator {
        return this.page.locator('//app-dialog//button[contains(text(), "Cancel")]');
    }

    private get diaryTypesTableHeader(): Locator {
        return this.page.locator('app-table thead tr');
    }

    private get diaryTypesTableRows(): Locator {
        return this.page.locator('//tbody//tr');
    }

    private getDiaryTypeRowByIndex(index: number): Locator {
        return this.diaryTypesTableRows.nth(index);
    }

    private get diaryTypesFilterButton(): Locator {
        return this.page.locator('//app-table//button[contains(@aria-label, "Filter") or contains(@class, "filter")]');
    }

    private get diaryTypesExportButton(): Locator {
        return this.page.locator('//app-table//button[contains(@aria-label, "Export") or contains(@class, "export")]');
    }

    //--------------------------------------------------------------------------------------------
    // Personal Tasks - Browse View Locators
    //--------------------------------------------------------------------------------------------

    private get personalTasksBrowseRadioButton(): Locator {
        return this.page.locator('//app-tab-panel[contains(@aria-labelledby, "Personal Tasks")]//radio-button[@value="Browse"]');
    }

    private get personalTasksSearchRadioButton(): Locator {
        return this.page.locator('//app-tab-panel[contains(@aria-labelledby, "Personal Tasks")]//radio-button[@value="Search"]');
    }

    //--------------------------------------------------------------------------------------------
    // Personal Tasks - Search View Locators
    //--------------------------------------------------------------------------------------------

    private get taskTitleField(): Locator {
        return this.page.locator('//label[contains(text(), "Title")]//following-sibling::*//input');
    }

    private get taskStatusDropdown(): Locator {
        return this.page.locator('//label[contains(text(), "Task Status")]//following-sibling::*//div[contains(@class, "multiselect")]');
    }

    private get taskDueDateFromField(): Locator {
        return this.page.locator('//label[contains(text(), "Due Date")]//following-sibling::*//input[contains(@placeholder, "From") or position()=1]');
    }

    private get taskDueDateToField(): Locator {
        return this.page.locator('//label[contains(text(), "Due Date")]//following-sibling::*//input[contains(@placeholder, "To") or position()=2]');
    }

    //--------------------------------------------------------------------------------------------
    // Personal Tasks - Action Buttons Locators
    //--------------------------------------------------------------------------------------------

    private get newTaskButton(): Locator {
        return this.page.getByRole('button', { name: 'New Task' });
    }

    //--------------------------------------------------------------------------------------------
    // Personal Tasks - Table Locators
    //--------------------------------------------------------------------------------------------

    private get tasksTableHeader(): Locator {
        return this.page.locator('app-table thead tr');
    }

    private get tasksTableRows(): Locator {
        return this.page.locator('//tbody//tr');
    }

    private getTaskRowByIndex(index: number): Locator {
        return this.tasksTableRows.nth(index);
    }

    private get taskFilterButton(): Locator {
        return this.page.locator('//app-table//button[contains(@aria-label, "Filter") or contains(@class, "filter")]');
    }

    private get taskExportButton(): Locator {
        return this.page.locator('//app-table//button[contains(@aria-label, "Export") or contains(@class, "export")]');
    }

    private getTaskExpandButton(rowIndex: number): Locator {
        return this.getTaskRowByIndex(rowIndex).locator('app-expand-button button[aria-label*="Expand"]');
    }

    private getTaskActionsButton(rowIndex: number): Locator {
        return this.getTaskRowByIndex(rowIndex).locator('app-more-button button');
    }

    //--------------------------------------------------------------------------------------------
    // New Task Screen Locators
    //--------------------------------------------------------------------------------------------

    private get newTaskHeader(): Locator {
        return this.page.getByRole('heading', { name: 'New Task' });
    }

    private get backToTodoFromTaskButton(): Locator {
        return this.page.getByRole('button', { name: /Back.*To-Do/i });
    }

    private get taskDueDateField(): Locator {
        return this.page.locator('//label[contains(text(), "Due Date")]//following-sibling::*//input');
    }

    private get taskTitleInputField(): Locator {
        return this.page.locator('//label[contains(text(), "Title")]//following-sibling::*//input');
    }

    private get taskSendEmailReminderCheckbox(): Locator {
        return this.page.locator('//label[contains(text(), "Send Email Reminder")]//preceding-sibling::*[contains(@class, "checkbox")]');
    }

    private get taskDescriptionTextarea(): Locator {
        return this.page.locator('//label[contains(text(), "Description") or contains(@placeholder, "description")]//following-sibling::*//textarea').or(this.page.locator('textarea'));
    }

    private get saveTaskButton(): Locator {
        return this.page.getByRole('button', { name: 'Save Task' });
    }

    private get cancelTaskButton(): Locator {
        return this.page.getByRole('button', { name: 'Cancel' });
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Module Structure
    //--------------------------------------------------------------------------------------------

    @step('Validate TO-DO Module Header')
    async validateTodoModuleHeader() {
        await expect(this.todoHeader, 'My to-do header should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.todoHeader);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Module header ${ctrlMessage}.`);

        await expect.soft(this.todoHeaderLine, 'Header line should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.todoHeaderLine);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Header line ${ctrlMessage}.`);
    }

    @step('Validate Shared Diaries Tab Display')
    async validateSharedDiariesTabDisplay() {
        await expect.soft(this.sharedDiariesTab, 'Shared Diaries tab should be visible if user has diary access').toBeVisible();
        let isCond = await this.isLocatorVisible(this.sharedDiariesTab);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible (user has diary access)' : 'should be visible but was not found (user may not have diary access)';
        console.log(`[My to-do] ${ctrlIcon} Shared Diaries tab ${ctrlMessage}.`);
    }

    @step('Validate Personal Tasks Tab Display')
    async validatePersonalTasksTabDisplay() {
        await expect(this.personalTasksTab, 'Personal Tasks tab should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.personalTasksTab);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Personal Tasks tab ${ctrlMessage}.`);
    }

    @step('Validate Default Tab Selection')
    async validateDefaultTabSelection(hasDiaryAccess: boolean = true) {
        if (hasDiaryAccess) {
            const sharedDiariesTab = this.sharedDiariesTab;
            const isSharedDiariesSelected = await sharedDiariesTab.getAttribute('aria-selected') === 'true';
            expect.soft(isSharedDiariesSelected, 'Shared Diaries should be selected by default if user has diary access').toBe(true);
            let ctrlIcon = isSharedDiariesSelected ? '✅': '❌';
            let ctrlMessage = isSharedDiariesSelected ? 'is selected by default' : 'should be selected by default but was not';
            console.log(`[My to-do] ${ctrlIcon} Shared Diaries tab ${ctrlMessage}.`);
        } else {
            const personalTasksTab = this.personalTasksTab;
            const isPersonalTasksSelected = await personalTasksTab.getAttribute('aria-selected') === 'true';
            expect.soft(isPersonalTasksSelected, 'Personal Tasks should be selected by default if user does not have diary access').toBe(true);
            let ctrlIcon = isPersonalTasksSelected ? '✅': '❌';
            let ctrlMessage = isPersonalTasksSelected ? 'is selected by default' : 'should be selected by default but was not';
            console.log(`[My to-do] ${ctrlIcon} Personal Tasks tab ${ctrlMessage}.`);
        }
    }

    //--------------------------------------------------------------------------------------------
    // Action Methods - Navigation
    //--------------------------------------------------------------------------------------------

    @step('Navigate to TO-DO Module')
    async navigateToTodoModule() {
        await this.selectTabMenu('TO-DO');
        await this.waitForPageLoad();
        await this.delay(2000);
        console.log(`[My to-do] ✅ Navigated to TO-DO module successfully.`);
    }

    @step('Select Shared Diaries Tab')
    async selectSharedDiariesTab() {
        await expect.soft(this.sharedDiariesTab, 'Shared Diaries tab should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.sharedDiariesTab);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Shared Diaries tab ${ctrlMessage}.`);
        
        await this.sharedDiariesTab.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Shared Diaries tab selected successfully.`);
    }

    @step('Select Personal Tasks Tab')
    async selectPersonalTasksTab() {
        await expect.soft(this.personalTasksTab, 'Personal Tasks tab should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.personalTasksTab);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Personal Tasks tab ${ctrlMessage}.`);
        
        await this.personalTasksTab.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Personal Tasks tab selected successfully.`);
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Shared Diaries Browse View
    //--------------------------------------------------------------------------------------------

    @step('Validate Browse Radio Button')
    async validateBrowseRadioButton() {
        await expect.soft(this.browseRadioButton, 'Browse radio button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.browseRadioButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Browse radio button ${ctrlMessage}.`);

        const isSelected = await this.browseRadioButton.isChecked();
        expect.soft(isSelected, 'Browse radio button should be selected by default').toBe(true);
        ctrlIcon = isSelected ? '✅': '❌';
        ctrlMessage = isSelected ? 'is selected by default' : 'should be selected by default but was not';
        console.log(`[My to-do] ${ctrlIcon} Browse radio button ${ctrlMessage}.`);
    }

    @step('Validate Calendar Elements')
    async validateCalendarElements() {
        await expect.soft(this.calendarHeader, 'Calendar header should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.calendarHeader);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Calendar header ${ctrlMessage}.`);

        await expect.soft(this.calendarPreviousArrow, 'Calendar previous arrow should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.calendarPreviousArrow);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Calendar previous arrow ${ctrlMessage}.`);

        await expect.soft(this.calendarNextArrow, 'Calendar next arrow should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.calendarNextArrow);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Calendar next arrow ${ctrlMessage}.`);

        await expect.soft(this.todayButton, 'Today button should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.todayButton);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Today button ${ctrlMessage}.`);

        await expect.soft(this.includeCompletedToggle, 'Include completed toggle should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.includeCompletedToggle);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Include completed toggle ${ctrlMessage}.`);
    }

    @step('Validate Calendar Date Range Display')
    async validateCalendarDateRangeDisplay() {
        const headerText = await this.calendarHeader.textContent();
        const dateRangeRegex = /[A-Za-z]+\s+\d{1,2}\s*–\s*[A-Za-z]+\s+\d{1,2}/;
        const formatMatches = dateRangeRegex.test(headerText?.trim() || '');
        expect.soft(headerText?.trim(), 'Calendar header should display date range in format "Month Day – Month Day"').toMatch(dateRangeRegex);
        
        let ctrlIcon = formatMatches ? '✅': '❌';
        let ctrlMessage = formatMatches 
            ? `displays correct date range format: "${headerText?.trim()}"` 
            : `should be in format "Month Day – Month Day" but found "${headerText?.trim()}"`;
        console.log(`[My to-do] ${ctrlIcon} Calendar date range ${ctrlMessage}.`);
    }

    //--------------------------------------------------------------------------------------------
    // Action Methods - Shared Diaries Browse View
    //--------------------------------------------------------------------------------------------

    @step('Click Calendar Previous Arrow')
    async clickCalendarPreviousArrow() {
        await expect.soft(this.calendarPreviousArrow, 'Calendar previous arrow should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.calendarPreviousArrow);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Calendar previous arrow ${ctrlMessage}.`);
        
        await this.calendarPreviousArrow.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Calendar previous arrow clicked successfully.`);
    }

    @step('Click Calendar Next Arrow')
    async clickCalendarNextArrow() {
        await expect.soft(this.calendarNextArrow, 'Calendar next arrow should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.calendarNextArrow);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Calendar next arrow ${ctrlMessage}.`);
        
        await this.calendarNextArrow.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Calendar next arrow clicked successfully.`);
    }

    @step('Click Today Button')
    async clickTodayButton() {
        await expect.soft(this.todayButton, 'Today button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.todayButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Today button ${ctrlMessage}.`);
        
        await this.todayButton.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Today button clicked successfully.`);
    }

    @step('Toggle Include Completed')
    async toggleIncludeCompleted(enable: boolean = true) {
        await expect.soft(this.includeCompletedToggle, 'Include completed toggle should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.includeCompletedToggle);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Include completed toggle ${ctrlMessage}.`);
        
        const isEnabled = await this.includeCompletedToggle.getAttribute('aria-checked') === 'true';
        if (enable && !isEnabled) {
            await this.includeCompletedToggle.click();
        } else if (!enable && isEnabled) {
            await this.includeCompletedToggle.click();
        }
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Include completed toggle ${enable ? 'enabled' : 'disabled'} successfully.`);
    }

    @step('Click Calendar Day')
    async clickCalendarDay(dayIndex: number) {
        const dayElement = this.getCalendarDay(dayIndex);
        await expect.soft(dayElement, `Calendar day ${dayIndex} should be visible`).toBeVisible();
        let isCond = await this.isLocatorVisible(dayElement);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Calendar day ${dayIndex} ${ctrlMessage}.`);
        
        await dayElement.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Calendar day ${dayIndex} clicked successfully.`);
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Shared Diaries Search View
    //--------------------------------------------------------------------------------------------

    @step('Validate Search Radio Button')
    async validateSearchRadioButton() {
        await expect.soft(this.searchRadioButton, 'Search radio button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.searchRadioButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Search radio button ${ctrlMessage}.`);
    }

    @step('Validate Search Fields Display')
    async validateSearchFieldsDisplay() {
        const searchFields = [
            { locator: this.clientSearchField, name: 'Client' },
            { locator: this.diaryStatusDropdown, name: 'Diary status' },
            { locator: this.diaryTypeDropdown, name: 'Diary type' },
            { locator: this.diaryDueDropdown, name: 'Diary due' },
            { locator: this.followUpUserField, name: 'Follow-up user' },
            { locator: this.createdByField, name: 'Created by' },
            { locator: this.dueDateFromField, name: 'Due date (from)' },
            { locator: this.dueDateToField, name: 'Due date (to)' },
            { locator: this.createDateFromField, name: 'Create date (from)' },
            { locator: this.createDateToField, name: 'Create date (to)' }
        ];

        for (const field of searchFields) {
            await expect.soft(field.locator, `${field.name} field should be visible`).toBeVisible();
            let isCond = await this.isLocatorVisible(field.locator);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[My to-do] ${ctrlIcon} ${field.name} field ${ctrlMessage}.`);
        }

        await expect.soft(this.searchButton, 'Search button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.searchButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Search button ${ctrlMessage}.`);

        await expect.soft(this.clearButton, 'Clear button should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.clearButton);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Clear button ${ctrlMessage}.`);
    }

    //--------------------------------------------------------------------------------------------
    // Action Methods - Shared Diaries Search View
    //--------------------------------------------------------------------------------------------

    @step('Select Search Radio Button')
    async selectSearchRadioButton() {
        await expect.soft(this.searchRadioButton, 'Search radio button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.searchRadioButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Search radio button ${ctrlMessage}.`);
        
        await this.searchRadioButton.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Search radio button selected successfully.`);
    }

    @step('Click Search Button')
    async clickSearchButton() {
        await expect.soft(this.searchButton, 'Search button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.searchButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Search button ${ctrlMessage}.`);
        
        await this.searchButton.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Search button clicked successfully.`);
    }

    @step('Click Clear Button')
    async clickClearButton() {
        await expect.soft(this.clearButton, 'Clear button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.clearButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Clear button ${ctrlMessage}.`);
        
        await this.clearButton.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Clear button clicked successfully.`);
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Shared Diaries Table
    //--------------------------------------------------------------------------------------------

    @step('Validate Diaries Table Structure')
    async validateDiariesTableStructure() {
        const expectedColumns = ['STATUS', 'CLAIM', 'NAME', 'DUE DATE', 'NOTIFICATION TIME', 'FOLLOW UP USER', 'DIARY TYPE', 'ACTIONS'];
        
        for (const column of expectedColumns) {
            const columnHeader = this.diariesTableHeader.getByRole('columnheader', { name: new RegExp(column, 'i') });
            await expect.soft(columnHeader, `Column "${column}" should be visible`).toBeVisible();
            let isCond = await this.isLocatorVisible(columnHeader);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[My to-do] ${ctrlIcon} Column "${column}" ${ctrlMessage}.`);
        }
    }

    @step('Validate Diaries Table Actions')
    async validateDiariesTableActions() {
        await expect.soft(this.diaryFilterButton, 'Filter button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.diaryFilterButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Filter button ${ctrlMessage}.`);

        await expect.soft(this.diaryExportButton, 'Export button should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.diaryExportButton);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Export button ${ctrlMessage}.`);
    }

    //--------------------------------------------------------------------------------------------
    // Action Methods - Shared Diaries Table
    //--------------------------------------------------------------------------------------------

    @step('Click New Diary Button')
    async clickNewDiaryButton() {
        await expect.soft(this.newDiaryButton, 'New diary button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.newDiaryButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} New diary button ${ctrlMessage}.`);
        
        await this.newDiaryButton.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ New diary button clicked successfully.`);
    }

    @step('Click Diary Types Button')
    async clickDiaryTypesButton() {
        await expect.soft(this.diaryTypesButton, 'Diary types button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.diaryTypesButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Diary types button ${ctrlMessage}.`);
        
        await this.diaryTypesButton.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Diary types button clicked successfully.`);
    }

    @step('Toggle Expand All')
    async toggleExpandAll(enable: boolean = true) {
        await expect.soft(this.expandAllToggle, 'Expand all toggle should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.expandAllToggle);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Expand all toggle ${ctrlMessage}.`);
        
        const isEnabled = await this.expandAllToggle.getAttribute('aria-checked') === 'true';
        if (enable && !isEnabled) {
            await this.expandAllToggle.click();
        } else if (!enable && isEnabled) {
            await this.expandAllToggle.click();
        }
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ Expand all toggle ${enable ? 'enabled' : 'disabled'} successfully.`);
    }

    @step('Expand Diary Row')
    async expandDiaryRow(rowIndex: number = 0) {
        const expandButton = this.getDiaryExpandButton(rowIndex);
        await expect.soft(expandButton, 'Expand button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(expandButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Expand button ${ctrlMessage}.`);
        await expandButton.click();
        await this.delay(1000);
        console.log(`[My to-do] ✅ Diary row ${rowIndex} expanded successfully.`);
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - New Diary Screen
    //--------------------------------------------------------------------------------------------

    @step('Validate New Diary Screen Elements')
    async validateNewDiaryScreenElements() {
        await expect(this.newDiaryHeader, 'New diary header should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.newDiaryHeader);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} New diary header ${ctrlMessage}.`);

        const newDiaryElements = [
            { locator: this.backToTodoButton, name: 'Back to My to-do button' },
            { locator: this.followUpUserSearchBox, name: 'Follow-up user search box' },
            { locator: this.additionalFollowUpUserDropdown, name: 'Additional follow-up user dropdown' },
            { locator: this.dueDateField, name: 'Due date field' },
            { locator: this.diaryTypeDropdownNew, name: 'Diary type dropdown' },
            { locator: this.allowOtherUsersCheckbox, name: 'Allow other users checkbox' },
            { locator: this.sendEmailReminderCheckbox, name: 'Send email reminder checkbox' },
            { locator: this.diaryDescriptionTextarea, name: 'Diary description textarea' },
            { locator: this.saveDiaryButton, name: 'Save diary button' },
            { locator: this.cancelDiaryButton, name: 'Cancel button' }
        ];

        for (const element of newDiaryElements) {
            await expect.soft(element.locator, `${element.name} should be visible`).toBeVisible();
            isCond = await this.isLocatorVisible(element.locator);
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[My to-do] ${ctrlIcon} ${element.name} ${ctrlMessage}.`);
        }
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Diary Types Screen
    //--------------------------------------------------------------------------------------------

    @step('Validate Diary Types Screen Elements')
    async validateDiaryTypesScreenElements() {
        await expect(this.diaryTypesHeader, 'Diary types header should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.diaryTypesHeader);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Diary types header ${ctrlMessage}.`);

        await expect.soft(this.clientSearchBoxDiaryTypes, 'Client search box should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.clientSearchBoxDiaryTypes);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Client search box ${ctrlMessage}.`);

        await expect.soft(this.addDiaryTypeButton, 'Add button should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.addDiaryTypeButton);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Add button ${ctrlMessage}.`);
    }

    @step('Validate Diary Types Table Structure')
    async validateDiaryTypesTableStructure() {
        const expectedColumns = ['DIARY TYPE', 'DISPLAYED', 'ORDER', 'DEFAULT TEXT', 'CREATED BY', 'CREATED ON', 'LAST MODIFIED BY', 'LAST MODIFIED ON', 'ACTIONS'];
        
        for (const column of expectedColumns) {
            const columnHeader = this.diaryTypesTableHeader.getByRole('columnheader', { name: new RegExp(column, 'i') });
            await expect.soft(columnHeader, `Column "${column}" should be visible`).toBeVisible();
            let isCond = await this.isLocatorVisible(columnHeader);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[My to-do] ${ctrlIcon} Column "${column}" ${ctrlMessage}.`);
        }
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Personal Tasks Browse View
    //--------------------------------------------------------------------------------------------

    @step('Validate Personal Tasks Browse Radio Button')
    async validatePersonalTasksBrowseRadioButton() {
        await expect.soft(this.personalTasksBrowseRadioButton, 'Browse radio button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.personalTasksBrowseRadioButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Personal Tasks Browse radio button ${ctrlMessage}.`);

        const isSelected = await this.personalTasksBrowseRadioButton.isChecked();
        expect.soft(isSelected, 'Browse radio button should be selected by default').toBe(true);
        ctrlIcon = isSelected ? '✅': '❌';
        ctrlMessage = isSelected ? 'is selected by default' : 'should be selected by default but was not';
        console.log(`[My to-do] ${ctrlIcon} Personal Tasks Browse radio button ${ctrlMessage}.`);
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Personal Tasks Search View
    //--------------------------------------------------------------------------------------------

    @step('Validate Personal Tasks Search Fields Display')
    async validatePersonalTasksSearchFieldsDisplay() {
        const searchFields = [
            { locator: this.taskTitleField, name: 'Title' },
            { locator: this.taskStatusDropdown, name: 'Task Status' },
            { locator: this.taskDueDateFromField, name: 'Due Date (from)' },
            { locator: this.taskDueDateToField, name: 'Due Date (to)' }
        ];

        for (const field of searchFields) {
            await expect.soft(field.locator, `${field.name} field should be visible`).toBeVisible();
            let isCond = await this.isLocatorVisible(field.locator);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[My to-do] ${ctrlIcon} ${field.name} field ${ctrlMessage}.`);
        }

        await expect.soft(this.searchButton, 'Search button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.searchButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Search button ${ctrlMessage}.`);

        await expect.soft(this.clearButton, 'Clear button should be visible').toBeVisible();
        isCond = await this.isLocatorVisible(this.clearButton);
        ctrlIcon = isCond ? '✅': '❌';
        ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} Clear button ${ctrlMessage}.`);
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - Personal Tasks Table
    //--------------------------------------------------------------------------------------------

    @step('Validate Tasks Table Structure')
    async validateTasksTableStructure() {
        const expectedColumns = ['STATUS', 'CLAIM', 'NAME', 'DUE DATE', 'TITLE', 'ACTIONS'];
        
        for (const column of expectedColumns) {
            const columnHeader = this.tasksTableHeader.getByRole('columnheader', { name: new RegExp(column, 'i') });
            await expect.soft(columnHeader, `Column "${column}" should be visible`).toBeVisible();
            let isCond = await this.isLocatorVisible(columnHeader);
            let ctrlIcon = isCond ? '✅': '❌';
            let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[My to-do] ${ctrlIcon} Column "${column}" ${ctrlMessage}.`);
        }
    }

    //--------------------------------------------------------------------------------------------
    // Action Methods - Personal Tasks
    //--------------------------------------------------------------------------------------------

    @step('Click New Task Button')
    async clickNewTaskButton() {
        await expect.soft(this.newTaskButton, 'New Task button should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.newTaskButton);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} New Task button ${ctrlMessage}.`);
        
        await this.newTaskButton.click();
        await this.waitForPageLoad();
        console.log(`[My to-do] ✅ New Task button clicked successfully.`);
    }

    //--------------------------------------------------------------------------------------------
    // Validation Methods - New Task Screen
    //--------------------------------------------------------------------------------------------

    @step('Validate New Task Screen Elements')
    async validateNewTaskScreenElements() {
        await expect(this.newTaskHeader, 'New Task header should be visible').toBeVisible();
        let isCond = await this.isLocatorVisible(this.newTaskHeader);
        let ctrlIcon = isCond ? '✅': '❌';
        let ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
        console.log(`[My to-do] ${ctrlIcon} New Task header ${ctrlMessage}.`);

        const newTaskElements = [
            { locator: this.backToTodoFromTaskButton, name: 'Back to To-Do button' },
            { locator: this.taskDueDateField, name: 'Due Date field' },
            { locator: this.taskTitleInputField, name: 'Title field' },
            { locator: this.taskSendEmailReminderCheckbox, name: 'Send Email Reminder checkbox' },
            { locator: this.taskDescriptionTextarea, name: 'Task description textarea' },
            { locator: this.saveTaskButton, name: 'Save Task button' },
            { locator: this.cancelTaskButton, name: 'Cancel button' }
        ];

        for (const element of newTaskElements) {
            await expect.soft(element.locator, `${element.name} should be visible`).toBeVisible();
            isCond = await this.isLocatorVisible(element.locator);
            ctrlIcon = isCond ? '✅': '❌';
            ctrlMessage = isCond ? 'is visible' : 'should be visible but was not found';
            console.log(`[My to-do] ${ctrlIcon} ${element.name} ${ctrlMessage}.`);
        }
    }

    //--------------------------------------------------------------------------------------------
    // Data Retrieval Methods
    //--------------------------------------------------------------------------------------------

    @step('Get Diaries Table Row Count')
    async getDiariesTableRowCount(): Promise<number> {
        return await this.diariesTableRows.count();
    }

    @step('Get Tasks Table Row Count')
    async getTasksTableRowCount(): Promise<number> {
        return await this.tasksTableRows.count();
    }

    @step('Get Diary Types Table Row Count')
    async getDiaryTypesTableRowCount(): Promise<number> {
        return await this.diaryTypesTableRows.count();
    }

    //--------------------------------------------------------------------------------------------
    // Public Getter Methods for Test Access
    //--------------------------------------------------------------------------------------------

    public getTodoHeader(): Locator {
        return this.todoHeader;
    }

    public getSharedDiariesTab(): Locator {
        return this.sharedDiariesTab;
    }

    public getCalendarHeader(): Locator {
        return this.calendarHeader;
    }

    public getIncludeCompletedToggle(): Locator {
        return this.includeCompletedToggle;
    }

    public getDiaryFilterButton(): Locator {
        return this.diaryFilterButton;
    }

    public getDiaryFilterInput(): Locator {
        return this.diaryFilterInput;
    }

    public getDiaryExportButton(): Locator {
        return this.diaryExportButton;
    }

    public getDiariesTableHeader(): Locator {
        return this.diariesTableHeader;
    }

    public getBackToTodoButton(): Locator {
        return this.backToTodoButton;
    }

    public getDiaryDescriptionTextarea(): Locator {
        return this.diaryDescriptionTextarea;
    }

    public getCancelDiaryButton(): Locator {
        return this.cancelDiaryButton;
    }

    public getDiaryStatusDropdown(): Locator {
        return this.diaryStatusDropdown;
    }

    public getTaskStatusDropdown(): Locator {
        return this.taskStatusDropdown;
    }

    public getTaskFilterButton(): Locator {
        return this.taskFilterButton;
    }

    public getTaskExportButton(): Locator {
        return this.taskExportButton;
    }

    public getTasksTableHeader(): Locator {
        return this.tasksTableHeader;
    }

    public getBackToTodoFromTaskButton(): Locator {
        return this.backToTodoFromTaskButton;
    }

    public getTaskDescriptionTextarea(): Locator {
        return this.taskDescriptionTextarea;
    }

    public getCancelTaskButton(): Locator {
        return this.cancelTaskButton;
    }

    public getExpandAllToggle(): Locator {
        return this.expandAllToggle;
    }

    public getPage(): Page {
        return this.page;
    }
}


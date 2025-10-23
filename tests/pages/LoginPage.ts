import { expect,  type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { step, test } from '../fixtures/BaseTest';
import { ExcelReader } from '../../utils/helpers/excel-reader';
import { HomePage } from './HomePage';

export class LoginPage extends BasePage {
  //--------------------------------------------------------------------------------------------
  // Getter properties 
  //--------------------------------------------------------------------------------------------
  private readonly name = "Login VOV";

  private get usernameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Username *' });
  }

  private get passwordInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Password *' });
  }

  private get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' });
  }

  private get errorMessage(): Locator {
    return this.page.locator("div[class*='toast-error'] div[class*='toast-text']");
  }

  private get userIcon(): Locator {
    return this.page.locator("//app-icon[@name='fa-user fa-light']");
  }

  private get logoutLink(): Locator {
    return this.page.getByRole('menuitem', { name: 'Log out'});
  }

  constructor(page: Page) {
    super(page);
  }


  
  //--------------------------------------------------------------------------------------------
  // Actions for Page Object Model
  //--------------------------------------------------------------------------------------------

  @step('Navigate to login page')
  async gotoLogin() {
    await this.goToPage('/login');
    await this.waitForPageLoad();
  }

  @step('Enter username')
  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  @step('Enter password')
  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  @step('Click login button')
  async clickLogin() {
    await this.loginButton.click();
  }

  @step('Login with valid credentials')
  async performLogin(username: string, password: string) {
    await this.gotoLogin();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
    const homePage = new HomePage(this.page);
    await homePage.validateHomePageLoaded();
  }


  @step('Login with valid credentials')
  async performLoginDataDriven(dataset: number) {

    const reader = new ExcelReader(`${this.driverPath}${this.driverFile}`);
    reader.selectDataSet('Login', dataset);
    for(let row = 0; row < reader.count(); row++){
      reader.useRow(row);
      await this.gotoLogin();
      await this.enterUsername(reader.getValue('UserID', ''));
      await this.enterPassword(reader.getValue('Password', ''));
      await this.clickLogin();
      const homePage = new HomePage(this.page);
      await homePage.validateHomePageLoaded();
      console.log(`✅ Login was completed successfully.`);
    }
  }
  
  @step('Perform Logout')
  async performLogout() {
    await this.userIcon.click();
    await this.logoutLink.click();
    await this.waitForPageLoad();
  }

}
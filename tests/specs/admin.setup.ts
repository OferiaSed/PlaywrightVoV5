import { test as setup, expect } from '../fixtures/BaseTest';
const authFile = '.auth/user.json';


setup('Global Setup Login', async ({ page, login }) => {
    await login.performLoginDataDriven(1);
    await page.context().storageState({path: authFile});
});


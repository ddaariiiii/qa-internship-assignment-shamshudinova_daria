//automatic tests
const { test, expect } = require('@playwright/test');

test.describe('Form Submission on Voxys.ru', () => {

    const testData = {
        name: 'Тест Имя',
        phone: '+79001234567',
        email: 'test@example.com',
    };
    //1
    test('should successfully submit the "Оставить заявку" form', async ({ page }) => {
        await test.step('Navigate to the home page', async () => {
            await page.goto('https://www.voxys.ru/');
            await expect(page).toHaveTitle(/Voxys/);
        });
    //2    
    test('should show error when submitting form without consent', async ({ page }) => {
        await page.goto('https://www.voxys.ru/');
        await page.getByRole('button', { name: 'Оставить заявку' }).click();
        await expect(page.getByText('Оставить заявку')).toBeVisible();
        await page.getByPlaceholder('Ваше имя').fill(testData.name);
        await page.getByPlaceholder('Телефон').fill(testData.phone);
        await page.getByPlaceholder('E-mail').fill(testData.email);
        await page.getByPlaceholder('Ваше сообщение').fill(testData.message);
        await page.locator('div[role="dialog"] button', { hasText: 'Отправить' }).click();
        const consentErrorGeneral = page.getByText('Поле обязательно для заполнения');
        await expect(consentErrorGeneral).toBeVisible();
        });
    });
});

test.describe('Mandatory fields validation on Voxys.ru "Оставить заявку" form', () => {
    const testData = {
        name: 'Тест Имя',
        phone: '+79001234567',
        email: 'test@example.com',
    };

//3
    async function setupForm(page, excludeField) {
        await test.step('Navigate to the home page and open form', async () => {
            await page.goto('https://www.voxys.ru/');
            await expect(page).toHaveTitle(/Voxys/);
            const leaveRequestButton = page.getByRole('button', { name: 'Оставить заявку' });
            await expect(leaveRequestButton).toBeVisible();
            await leaveRequestButton.click();
            await expect(page.getByText('Оставить заявку')).toBeVisible();
        });
            await test.step('Fill all fields except the excluded one', async () => {
            if (excludeField !== 'name') {
                await page.getByPlaceholder('Ваше имя').fill(testData.name);
            }
            if (excludeField !== 'phone') {
                await page.getByPlaceholder('Телефон').fill(testData.phone);
            }
            if (excludeField !== 'email') {
                await page.getByPlaceholder('E-mail').fill(testData.email);
            }
            if (excludeField !== 'message') {
                 await page.getByPlaceholder('Ваше сообщение').fill(testData.message);
            }
            if (excludeField !== 'consent') {
                await page.getByLabel('Согласен с обработкой персональных данных').check();
                await expect(page.getByLabel('Согласен с обработкой персональных данных')).toBeChecked();
            }
        });
    };
});

//4
test.describe('Email field validation on Voxys.ru "Оставить заявку" form', () => {
    const commonTestData = {
        name: 'Тест Имя',
        phone: '+79001234567',
    };
    async function setupFormAndFillOthers(page, emailToFill) {
        await test.step('Navigate to the home page and open form', async () => {
            await page.goto('https://www.voxys.ru/');
            await expect(page).toHaveTitle(/Voxys/);
            const leaveRequestButton = page.getByRole('button', { name: 'Оставить заявку' });
            await expect(leaveRequestButton).toBeVisible();
            await leaveRequestButton.click();
            await expect(page.getByText('Оставить заявку')).toBeVisible(); // Wait for modal to appear
        });

        await test.step('Fill other mandatory fields and consent', async () => {
            await page.getByPlaceholder('Ваше имя').fill(commonTestData.name);
            await page.getByPlaceholder('Телефон').fill(commonTestData.phone);
            await page.getByPlaceholder('Ваше сообщение').fill(commonTestData.message);
            await page.getByLabel('Согласен с обработкой персональных данных').check();
            await expect(page.getByLabel('Согласен с обработкой персональных данных')).toBeChecked();
        });

        await test.step(`Fill "E-mail" field with: "${emailToFill}"`, async () => {
            await page.getByPlaceholder('E-mail').fill(emailToFill);
        });
    };
});

//5
test.describe('Contacts block on Voxys.ru', () => {
    const expectedContacts = {
        address: 'г. Москва, Пресненская наб., 10, стр. 2, МФК «Башня на Набережной»',
        phoneText: '+7 (495) 787-88-88',
        phoneHref: 'tel:+74957878888',
        emailText: 'info@voxys.ru',
        emailHref: 'mailto:info@voxys.ru',
        socialMedia: {
            telegram: { name: 'Telegram', href: 'https://t.me/voxys_official' },
            vk: { name: 'ВКонтакте', href: 'https://vk.com/voxys_official' },
            youtube: { name: 'YouTube', href: 'https://www.youtube.com/@voxys_official' },
        }
    };
});

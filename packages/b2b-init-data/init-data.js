require('dotenv').config();
const fs = require('fs');
const path = require('path');

const companyADraft = require('./data/companies/companyA.json');
const employeeAAdminDraft = require('./data/employees/companyA/employee-admin.json');
const employeeANormalDraft = require('./data/employees/companyA/employee-normal.json');

const companyBDraft = require('./data/companies/companyB.json');
const employeeBAdminDraft = require('./data/employees/companyB/employee-admin.json');
const employeeBNormalDraft = require('./data/employees/companyB/employee-normal.json');

const companyCDraft = require('./data/companies/companyC.json');
const employeeCAdminDraft = require('./data/employees/companyC/employee-admin.json');
const employeeCNormalDraft = require('./data/employees/companyC/employee-normal.json');

const { createCompany } = require('./companies');
const { createCustomer } = require('./commercetools/services/customers')();

const getLogo = fileName => {
  let image = `./assets/${fileName}`;

  return new Promise((resolve, reject) => {
    fs.readFile(image, (err, data) => {
      //error handle
      if (err) return reject(err);

      //get image file extension name
      let extensionName = path.extname(image);

      //convert image file to base64-encoded string
      let base64Image = Buffer.from(data, 'binary').toString('base64');

      //combine all strings
      let imgSrcString = `data:image/${extensionName
        .split('.')
        .pop()};base64,${base64Image}`;

      //send image src string into jade compiler
      resolve(imgSrcString);
    });
  });
};

const addCompany = async companyDraft => {
  console.log('Creating company', companyDraft);
  const company = await createCompany(companyDraft);
  console.log('Company created', company);
  return company;
};

const createEmployee = async (company, employeeDraft) => {
  console.log('Creating employee', employeeDraft);

  const customer = await createCustomer({
    ...employeeDraft,
    customerGroup: {
      typeId: 'customer-group',
      key: company.customerGroup.key
    },
    stores: [
      {
        typeId: 'store',
        key: company.store.key
      }
    ]
  });

  console.log(
    `Employee ${employeeDraft.email} Created for company ${company.name}`
  );

  return customer;
};

const run = async () => {
  // ADD COMPANY 1
  const logoCompanyA = await getLogo('companyA.png');
  const companyA = await addCompany({ ...companyADraft, logo: logoCompanyA });
  await createEmployee(companyA, employeeAAdminDraft);
  await createEmployee(companyA, employeeANormalDraft);

  // ADD COMPANY 2
  const logoCompanyB = await getLogo('companyB.png');
  const companyB = await addCompany({ ...companyBDraft, logo: logoCompanyB });
  await createEmployee(companyB, employeeBAdminDraft);
  await createEmployee(companyB, employeeBNormalDraft);

  // ADD COMPANY 3
  const logoCompanyC = await getLogo('companyC.png');
  const companyC = await addCompany({ ...companyCDraft, logo: logoCompanyC });
  await createEmployee(companyC, employeeCAdminDraft);
  await createEmployee(companyC, employeeCNormalDraft);
};

return run();

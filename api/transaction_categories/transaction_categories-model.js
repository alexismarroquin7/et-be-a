const notion = require('../../notion');

const NOTION_DB_TRANSACTIONS = process.env.NOTION_DB_TRANSACTIONS;

const findAll = async () => {
  const res = await notion.databases.retrieve({
    database_id: NOTION_DB_TRANSACTIONS
  });
  
  return res.properties.category.select.options;
};

module.exports = {
  findAll
};
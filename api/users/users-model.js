const notion = require('../../notion');

const NOTION_DB_USERS = process.env.NOTION_DB_USERS;

const findAll = async () => {

  const users = await notion.databases.query({
    database_id: NOTION_DB_USERS
  });

  return users;
};

const findByUserUUID = async (userUUID) => {

  const users = await findAll();

  const user = users.results.filter(user => user.id === userUUID);

  if(user.length === 1) return user[0];

  return null;
};

const findByUserID = async (userID) => {

  const users = await findAll();
  const user = users.results.filter(user => {
    return user.properties.userID.rich_text[0].text.content === userID;
  });

  if(user.length === 1) return user[0];

  return null;
};

const findByEmail = async (email) => {

  const users = await findAll();

  const user = users.results.filter(user => user.properties.email.email === email);

  if(user.length === 1) return user[0];

  return null;
};

const create = async (newUser) => {
  const users = await notion.pages.create({
    parent: {
      database_id: NOTION_DB_USERS
    },
    properties: {
      
    }
  });
  
  return {};
};



module.exports = {
  findAll,
  findByUserUUID,
  findByUserID,
  findByEmail,
  create
}
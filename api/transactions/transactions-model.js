const notion = require('../../notion');

const NOTION_DB_TRANSACTIONS = process.env.NOTION_DB_TRANSACTIONS;

const findAll = async (
  {
    userUUID = null,
    dir = 'asc',
    sortBy = 'date',
    date_after = '',
    date_before = ''
  }
) => {
  
  let sorts = [
    {
      property: sortBy,
      direction: dir === 'desc' ? 'descending' : 'ascending'
    }
  ];
  
  let transactions;
  if(userUUID && date_after && date_before){
    transactions = await notion.databases.query({
      database_id: NOTION_DB_TRANSACTIONS,
      sorts,
      filter: {
        and: [
          {
            property: "user",
            relation: {
              contains: userUUID
            }
          },
          {
            property: "date",
            date: {
              after: date_after,
              time_zone: 'America/Los_Angeles'
            }
          },
          {
            property: "date",
            date: {
              before: date_before,
              time_zone: 'America/Los_Angeles'
            }
          }
        ]
      }
    });
  } else if(userUUID && date_after && !date_before){
    transactions = await notion.databases.query({
      database_id: NOTION_DB_TRANSACTIONS,
      sorts,
      filter: {
        and: [
          {
            property: "user",
            relation: {
              contains: userUUID
            }
          },
          {
            property: "date",
            date: {
              after: date_after,
              time_zone: 'America/Los_Angeles'
            }
          }
        ]
      }
    });
  } else if(userUUID && !date_after && date_before){
    transactions = await notion.databases.query({
      database_id: NOTION_DB_TRANSACTIONS,
      sorts,
      filter: {        
        and: [
          {
            property: "user",
            relation: {
              contains: userUUID
            }
          },
          {
            property: "date",
            date: {
              before: date_before,
              time_zone: 'America/Los_Angeles'
            }
          }
        ]
      }
    });
  } else if((userUUID && !date_after && !date_before) || userUUID){
    transactions = await notion.databases.query({
      database_id: NOTION_DB_TRANSACTIONS,
      sorts,
      filter: {        
        property: "user",
        relation: {
          contains: userUUID
        }
      }
    });
  } else {
    transactions = await notion.databases.query({
      database_id: NOTION_DB_TRANSACTIONS,
      sorts
    });
  }

  
  return transactions;
}

const create = async ({ userUUID, name = '', description = '', category, type, amount, date }) => {

  const trx = await notion.pages.create({  
    parent: {
      database_id: NOTION_DB_TRANSACTIONS
    },
    properties: {
      name: {
        title: [
          {
            type: "text",
            text: {
              content: name
            }
          }
        ]
      },
      description: {
        rich_text: [
          {
            type: "text",
            text: {
              content: description
            }
          }
        ]
      },
      type: {
        select: {
          name: type
        }
      },
      amount: {
        number: type === 'withdrawal' ? (Number(amount) * -1) : Number(amount)
      },
      date: {
        date: {
          start: date
        }
      },
      category: {
        select: {
          name: category
        }
      },
      user: {
        relation: [
          {
            id: userUUID
          }
        ]
      },
    }
  });

  return trx;
}

const findById = async (transaction_id) => {
  
  const trx = await notion.databases.query({
    database_id: NOTION_DB_TRANSACTIONS,
  });

  const matchingPages = trx.results
  .filter(page => page.id === transaction_id);

  return matchingPages.length === 1
  ? matchingPages[0]
  : null;

}

const updateById = async (transaction_id, changes) => {
  const trx = await findById(transaction_id);

  

  return {};
}

const deleteById = async (transaction_id) => {
  const trx = await findById(transaction_id);

  await notion.pages.update({
    page_id: transaction_id,
    archived: true
  });

  return { id: trx.id };
}

module.exports = {
  findAll,
  create,
  updateById,
  findById,
  deleteById
}
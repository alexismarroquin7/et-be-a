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

module.exports = {
  findAll
}
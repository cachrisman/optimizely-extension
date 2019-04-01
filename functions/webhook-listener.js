const contentful = require("contentful");

const client = contentful.createClient({
  space: process.env.SPACE_ID,
  environment: process.env.ENVIRONMENT_ID, // defaults to 'master' if not set
  accessToken: process.env.DELIVERY_TOKEN
});

console.log("process.env.SPACE_ID: ", process.env.SPACE_ID);
console.log("process.env.ENVIRONMENT_ID: ", process.env.ENVIRONMENT_ID);
console.log("process.env.DELIVERY_TOKEN: ", process.env.DELIVERY_TOKEN);

exports.handler = function(event, context, callback) {
  console.log("event: ", JSON.stringify(event, null, 2));
  const content_type_id =
    event.body.fields.variations["en-US"][0].sys.contentType.sys.id;
  const entry_ids = event.body.fields.variations["en-US"].reduce(
    (acc, cur) => acc.concat(cur.sys.id),
    []
  );
  console.log("entry_ids:", entry_ids);
  client
    .getEntries({
      content_type: content_type_id,
      "sys.id[in]": entry_ids.join(",")
    })
    .then(entries => {
      console.log("entries:", JSON.stringify(entries, null, 2));
      callback(null, {
        statusCode: 200,
        body: `Hello, World\nhere are your entries: \n${JSON.stringify(
          entries,
          null,
          2
        )}`
      });
    });
};

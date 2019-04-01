const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.SPACE_ID,
  environment: process.env.ENVIRONMENT_ID, // defaults to 'master' if not set
  accessToken: process.env.DELIVERY_TOKEN
});

exports.handler = function(event, context, callback) {
  console.log("event: ", JSON.stringify(event, null, 2));
  const content_type_id =
    event.body.fields.variations["en-US"][0].sys.contentType.sys.id;
  const default_entry = event.body.fields.variations["en-US"][0].sys.id;
  const variation = event.body.fields.variations["en-US"][1].sys.id;
  client
    .getEntries({
      content_type: content_type_id,
      "sys.id[in]": `${default_entry},${variation}`
    })
    .then(entries => {
      console.log(entries);
      callback(null, {
        statusCode: 200,
        body: `Hello, World\nhere are your entries: ${entries}`
      });
    });
};

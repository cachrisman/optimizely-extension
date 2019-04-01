import contentful from "contentful"
const { SPACE_ID, ENVIRONMENT_ID, DELIVERY_TOKEN } = process.env

const client = contentful.createClient({
  space: SPACE_ID,
  environment: ENVIRONMENT_ID, // defaults to 'master' if not set
  accessToken: DELIVERY_TOKEN
})

console.log("SPACE_ID: ", SPACE_ID)
console.log("ENVIRONMENT_ID: ", ENVIRONMENT_ID)
console.log("DELIVERY_TOKEN: ", DELIVERY_TOKEN)

exports.handler = function (event, context, callback) {
  console.log("event: ", JSON.stringify(event, null, 2));
  const content_type_id = event.body.fields.variations["en-US"][0].sys.contentType.sys.id;
  const entry_ids = event.body.fields.variations["en-US"].reduce((acc, cur) => acc.concat(cur.sys.id),[]);
  console.log("entry_ids:", entry_ids);
  client.getEntries({
    content_type: content_type_id,
    "sys.id[in]": entry_ids.join(",")
  }).then(entries => {
    console.log("entries:", JSON.stringify(entries, null, 2));
    callback(null, {
      statusCode: 200,
      body: `Hello, World\nhere are your entries: \n${JSON.stringify(entries,null,2)}`
    })
  })
}

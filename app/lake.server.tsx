// Import the Google Cloud client library using default credentials
import { BigQuery } from "@google-cloud/bigquery";

let client: BigQuery;

declare global {
  var __bq__: BigQuery;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  client = new BigQuery();
} else {
  if (!global.__bq__) {
    global.__bq__ = new BigQuery();
  }
  client = global.__bq__;
}

export async function findProfileData(email: string) {
  // Queries the U.S. given names dataset for the state of Texas.

  const query = `SELECT contact__wizeos_profile_id, contact__employee_number, contact__email,
      contact__first_name, contact__preferred_name, contact__last_name,
      contact__photo__url,
      contact__location, contact__country,
      contact__status, contact__department,
      contact__wizeos__level, contact__title, contact__role
    FROM \`wizelake-prod.wizelabs_wzlk.contact\`
    WHERE contact__email = @email
    LIMIT 10`;

  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  const options = {
    query: query,
    // Location must match that of the dataset(s) referenced in the query.
    location: "US",
    params: { email },
  };

  // Wait for the query to finish
  const [rows] = await client.query(options);

  // Print the results
  if (rows.length > 0) {
    return rows[0];
  } else {
    throw new Error("Profile not found on lake");
  }
}
